/**
 * XWAuth - 求学少年认证系统 v3.0
 * 纯 fetch() 调用 Supabase REST API，无需额外依赖
 */
(function () {
  'use strict';

  var SUPA_URL = 'https://zehnaclrzehoetuiobrd.supabase.co';
  var SUPA_KEY = 'sb_publishable_gXoC13G2xfS6Nbp3hDgoKg_L38_axGF';
  var SESS_KEY = 'xw_sess_v1';
  var PROF_KEY = 'xw_prof_v1';  // profile 本地缓存

  // ROOT路径：子目录页面在加载 auth.js 前设置 window._AUTH_ROOT = '../'
  var ROOT = (typeof window._AUTH_ROOT !== 'undefined') ? window._AUTH_ROOT : './';

  // ---------- Session ----------
  function getSess() {
    try { return JSON.parse(localStorage.getItem(SESS_KEY)); } catch (e) { return null; }
  }
  function setSess(d) {
    if (d) localStorage.setItem(SESS_KEY, JSON.stringify(d));
    else localStorage.removeItem(SESS_KEY);
  }

  // ---------- Profile 缓存（24小时有效，网络失败时兜底） ----------
  function getCachedProfile() {
    try {
      var p = JSON.parse(localStorage.getItem(PROF_KEY));
      if (p && p._ts && (Date.now() - p._ts) < 86400000) return p;
    } catch (e) {}
    return null;
  }
  function setCachedProfile(p) {
    if (p) { p._ts = Date.now(); localStorage.setItem(PROF_KEY, JSON.stringify(p)); }
  }

  // ---------- Token 是否过期 ----------
  function isTokenExpired(sess) {
    if (!sess || !sess.expires_at) return true;
    return (sess.expires_at - 60) < Math.floor(Date.now() / 1000);
  }

  // ---------- 自动刷新 Token ----------
  async function refreshSess() {
    var sess = getSess();
    if (!sess || !sess.refresh_token) return null;
    try {
      var r = await fetch(SUPA_URL + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify({ refresh_token: sess.refresh_token })
      });
      if (!r.ok) { setSess(null); localStorage.removeItem(PROF_KEY); return null; }
      var d = await r.json();
      setSess(d);
      return d;
    } catch (e) { return null; }
  }

  // ---------- HTTP ----------
  function makeHeaders(token) {
    return {
      'Content-Type': 'application/json',
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + (token || SUPA_KEY)
    };
  }

  async function apiPost(path, body, token) {
    var r = await fetch(SUPA_URL + path, {
      method: 'POST',
      headers: makeHeaders(token),
      body: JSON.stringify(body)
    });
    var d = await r.json();
    if (!r.ok) throw new Error(d.error_description || d.msg || d.message || ('请求失败 ' + r.status));
    return d;
  }

  async function apiGet(path, token) {
    var r = await fetch(SUPA_URL + path, {
      headers: Object.assign({}, makeHeaders(token), { 'Accept': 'application/json' })
    });
    var d = await r.json();
    if (!r.ok) throw new Error(d.msg || d.message || ('请求失败 ' + r.status));
    return d;
  }

  // ---------- 课程类型名称映射 ----------
  var COURSE_NAMES = {
    'medical4': '基础医学全套（解剖+生理+病理+药理）',
    'all': '全站所有内容'
  };

  // ---------- 公开 API ----------
  var XWAuth = {
    ROOT: ROOT,
    COURSE_NAMES: COURSE_NAMES,
    isLoggedIn: function () { return !!getSess(); },
    getSess: getSess,

    async signUp(email, password) {
      var d = await apiPost('/auth/v1/signup', { email: email, password: password });
      if (d.access_token) setSess(d);
      return d;
    },

    async signIn(email, password) {
      var d = await apiPost('/auth/v1/token?grant_type=password', { email: email, password: password });
      setSess(d);
      return d;
    },

    async signOut() {
      var sess = getSess();
      if (sess) {
        try {
          await fetch(SUPA_URL + '/auth/v1/logout', {
            method: 'POST',
            headers: makeHeaders(sess.access_token)
          });
        } catch (e) {}
      }
      setSess(null);
      localStorage.removeItem(PROF_KEY);
      window.location.href = ROOT + 'index.html';
    },

    async getProfile() {
      var sess = getSess();
      if (!sess) return null;
      // token 过期先尝试刷新
      if (isTokenExpired(sess)) {
        sess = await refreshSess();
        if (!sess) return getCachedProfile(); // 刷新失败用缓存
      }
      try {
        var d = await apiGet('/rest/v1/profiles?select=*', sess.access_token);
        var profile = Array.isArray(d) ? (d[0] || null) : null;
        if (profile) setCachedProfile(profile); // 成功则更新缓存
        return profile;
      } catch (e) {
        return getCachedProfile(); // 网络失败用缓存兜底
      }
    },

    async redeemCode(code) {
      var sess = getSess();
      if (!sess) throw new Error('请先登录');
      var r = await fetch(SUPA_URL + '/rest/v1/rpc/redeem_code', {
        method: 'POST',
        headers: makeHeaders(sess.access_token),
        body: JSON.stringify({ input_code: code })
      });
      var d = await r.json();
      if (!r.ok) throw new Error(d.message || d.msg || '兑换请求失败');
      return d; // { success: true/false, message: "...", type: "..." }
    },

    canAccessCourse: function (profile, courseId) {
      if (!profile || !profile.is_vip) return false;
      var u = profile.unlocked || [];
      return u.indexOf('medical4') >= 0 || u.indexOf('all') >= 0;
    },

    // 发送重置密码邮件
    async sendResetEmail(email) {
      var r = await fetch(SUPA_URL + '/auth/v1/recover', {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify({ email: email })
      });
      if (!r.ok) {
        var d = await r.json();
        throw new Error(d.error_description || d.message || '发送失败');
      }
    },

    // 用新密码更新（用户点邮件链接跳回后调用）
    async updatePassword(newPassword) {
      var sess = getSess();
      if (!sess) throw new Error('登录状态已失效，请重新点击邮件中的链接');
      var r = await fetch(SUPA_URL + '/auth/v1/user', {
        method: 'PUT',
        headers: makeHeaders(sess.access_token),
        body: JSON.stringify({ password: newPassword })
      });
      var d = await r.json();
      if (!r.ok) throw new Error(d.error_description || d.message || '更新失败');
      return d;
    }
  };

  window.XWAuth = XWAuth;

  // ---------- 章节门禁（自动执行） ----------
  var _COURSE = window._COURSE;
  var _CHAPTER = parseInt(window._CHAPTER, 10) || 0;
  var FREE_CHAPTERS = parseInt(window._FREE_CHAPTERS, 10) || 2;

  if (_COURSE && _CHAPTER > FREE_CHAPTERS) {
    document.addEventListener('DOMContentLoaded', async function () {
      addAccountFAB();
      var sess = getSess();
      if (!sess) { lockPage('login'); return; }
      var profile = await XWAuth.getProfile();
      if (!XWAuth.canAccessCourse(profile, _COURSE)) { lockPage('vip'); }
    });
  } else {
    document.addEventListener('DOMContentLoaded', addAccountFAB);
  }

  // ---------- 锁定遮罩 ----------
  function lockPage(type) {
    var main = document.querySelector('.main-content') || document.querySelector('main');
    if (main) {
      main.style.cssText += 'filter:blur(8px);pointer-events:none;user-select:none;';
    }
    var hero = document.querySelector('.page-hero');
    if (hero) hero.style.cssText += 'filter:blur(3px);pointer-events:none;';

    var next = encodeURIComponent(window.location.href);
    var inner = type === 'login'
      ? '<div style="font-size:2.6rem;margin-bottom:1rem">🔒</div>'
        + '<h2 style="color:#f1f5f9;font-size:1.15rem;font-weight:800;margin-bottom:.5rem">此章节需要登录</h2>'
        + '<p style="color:#94a3b8;font-size:.85rem;line-height:1.7;margin-bottom:1.8rem">登录账号后即可查看已解锁的内容</p>'
        + '<a href="' + ROOT + 'login.html?next=' + next + '" style="display:block;background:#0284c7;color:white;padding:.8rem;border-radius:10px;font-weight:700;text-decoration:none;margin-bottom:.65rem">登录账号</a>'
        + '<a href="' + ROOT + 'register.html" style="display:block;background:#172554;color:#93c5fd;padding:.8rem;border-radius:10px;font-weight:600;text-decoration:none">没有账号？联系管理员开通</a>'
      : '<div style="font-size:2.6rem;margin-bottom:1rem">🔐</div>'
        + '<h2 style="color:#f1f5f9;font-size:1.15rem;font-weight:800;margin-bottom:.5rem">付费章节</h2>'
        + '<p style="color:#94a3b8;font-size:.85rem;line-height:1.7;margin-bottom:1.8rem">小红书「求学少年」购买兑换码<br>一码解锁全套四门课程 · 长期有效</p>'
        + '<a href="' + ROOT + 'redeem.html" style="display:block;background:#059669;color:white;padding:.8rem;border-radius:10px;font-weight:700;text-decoration:none;margin-bottom:.65rem">🎟️ 已有兑换码？去兑换</a>'
        + '<a href="https://www.xiaohongshu.com" target="_blank" style="display:block;background:#3f0d22;color:#fda4af;padding:.8rem;border-radius:10px;font-weight:600;text-decoration:none">📕 去小红书购买</a>'
        + '<p style="color:#475569;font-size:.72rem;margin-top:1.2rem">公众号：求学少年 &nbsp;·&nbsp; 邮箱：bitw@foxmail.com</p>';

    var el = document.createElement('div');
    el.id = 'xw-lock-overlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.9);backdrop-filter:blur(6px);padding:1.5rem';
    el.innerHTML = '<div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:2.5rem 2rem;max-width:340px;width:100%;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,.6)">' + inner + '</div>';
    document.body.appendChild(el);
  }

  // ---------- 账号 FAB ----------
  function addAccountFAB() {
    var curr = (window.location.pathname.split('/').pop() || 'index.html');
    var authPages = ['login.html', 'register.html', 'redeem.html', 'account.html'];
    if (authPages.indexOf(curr) >= 0) return;

    var fab = document.createElement('a');
    fab.href = ROOT + 'account.html';
    fab.title = XWAuth.isLoggedIn() ? '我的账号' : '登录 / 注册';
    fab.style.cssText = [
      'position:fixed;bottom:5.5rem;right:1.25rem;z-index:8999;',
      'width:40px;height:40px;border-radius:50%;',
      'background:#1e293b;border:1px solid #334155;',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:1rem;text-decoration:none;',
      'box-shadow:0 4px 14px rgba(0,0,0,.5);',
      'transition:transform .2s,box-shadow .2s;'
    ].join('');
    fab.innerHTML = XWAuth.isLoggedIn() ? '👤' : '🔑';
    fab.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.12)';
      this.style.boxShadow = '0 6px 20px rgba(0,0,0,.7)';
    });
    fab.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 14px rgba(0,0,0,.5)';
    });
    document.body.appendChild(fab);
  }

})();
