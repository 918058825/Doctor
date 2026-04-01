/**
 * XWAuth - 求学少年认证系统 v3.0
 * 纯 fetch() 调用 Supabase REST API，无需额外依赖
 */
(function () {
  'use strict';

  // 立即应用已保存的主题，避免闪烁
  (function () {
    var t = localStorage.getItem('xw-theme') || 'light';
    if (t === 'dark') document.documentElement.classList.add('xw-dark');
  })();

  var SUPA_URL = 'https://zehnaclrzehoetuiobrd.supabase.co';
  var SUPA_KEY = 'sb_publishable_gXoC13G2xfS6Nbp3hDgoKg_L38_axGF';
  var SESS_KEY = 'xw_sess_v1';
  var PROF_KEY = 'xw_prof_v1';  // profile 本地缓存

  // ROOT路径：子目录页面在加载 auth.js 前设置 window._AUTH_ROOT = '../'
  var ROOT = (typeof window._AUTH_ROOT !== 'undefined') ? window._AUTH_ROOT : './';

  // ---------- 全局导航 CSS ----------
  var NAV_CSS = `
html:not(.xw-dark){--bg:#f8fafc;--surface:#ffffff;--border:#e2e8f0;--text:#0f172a;--muted:#475569}
html:not(.xw-dark) body{background:#f8fafc!important;color:#0f172a!important}
body{padding-top:44px!important}
#xw-topnav{position:fixed;top:0;left:0;right:0;z-index:9997;height:44px;display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:0 1rem;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;border-bottom:1px solid var(--border,#334155);background:var(--surface,#1e293b);box-shadow:0 1px 6px rgba(0,0,0,.12)}
html:not(.xw-dark) #xw-topnav{background:#fff;border-bottom-color:#e2e8f0;box-shadow:0 1px 6px rgba(0,0,0,.06)}
.xw-nav-left{display:flex;align-items:center;gap:.9rem}
.xw-logo{display:flex;align-items:center;gap:.55rem;text-decoration:none;flex-shrink:0}
.xw-avatar{width:28px;height:28px;border-radius:7px;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#059669,#0284c7);font-size:.78rem;font-weight:800;color:white}
.xw-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.xw-brand{font-size:.92rem;font-weight:800;white-space:nowrap;color:var(--text,#f1f5f9)}
html:not(.xw-dark) .xw-brand{color:#0f172a}
.xw-nav-links{display:flex;align-items:center;gap:.1rem}
.xw-nav-links>a,.xw-dropdown-btn{padding:.28rem .65rem;border-radius:6px;font-size:.8rem;font-weight:600;color:var(--muted,#94a3b8);text-decoration:none;background:transparent;border:none;cursor:pointer;font-family:inherit;transition:background .15s,color .15s;white-space:nowrap;line-height:1.4}
.xw-nav-links>a:hover,.xw-dropdown-btn:hover{background:rgba(255,255,255,.07);color:var(--text,#f1f5f9)}
html:not(.xw-dark) .xw-nav-links>a,html:not(.xw-dark) .xw-dropdown-btn{color:#64748b}
html:not(.xw-dark) .xw-nav-links>a:hover,html:not(.xw-dark) .xw-dropdown-btn:hover{background:#f1f5f9;color:#0f172a}
.xw-dropdown{position:relative}
.xw-dropdown-menu{display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:155px;background:var(--surface,#1e293b);border:1px solid var(--border,#334155);border-radius:10px;padding:.4rem;z-index:10000;box-shadow:0 8px 24px rgba(0,0,0,.25)}
html:not(.xw-dark) .xw-dropdown-menu{background:#fff;border-color:#e2e8f0;box-shadow:0 8px 24px rgba(0,0,0,.1)}
.xw-dropdown-menu.open{display:block}
.xw-dropdown-menu a{display:block;padding:.4rem .7rem;border-radius:6px;font-size:.8rem;color:var(--muted,#94a3b8);text-decoration:none;white-space:nowrap;transition:background .12s,color .12s}
.xw-dropdown-menu a:hover{background:rgba(255,255,255,.07);color:var(--text,#f1f5f9)}
html:not(.xw-dark) .xw-dropdown-menu a{color:#475569}
html:not(.xw-dark) .xw-dropdown-menu a:hover{background:#f1f5f9;color:#0f172a}
.xw-nav-right{display:flex;align-items:center;gap:.4rem;flex-shrink:0}
#xw-theme-toggle,#xw-hamburger{width:30px;height:30px;border-radius:7px;flex-shrink:0;background:transparent;border:1px solid var(--border,#334155);display:flex;align-items:center;justify-content:center;font-size:.88rem;cursor:pointer;transition:background .15s;line-height:1}
html:not(.xw-dark) #xw-theme-toggle,html:not(.xw-dark) #xw-hamburger{border-color:#e2e8f0}
#xw-theme-toggle:hover,#xw-hamburger:hover{background:rgba(255,255,255,.08)}
html:not(.xw-dark) #xw-theme-toggle:hover,html:not(.xw-dark) #xw-hamburger:hover{background:#f1f5f9}
.xw-btn-login,.xw-btn-register,.xw-btn-account{padding:.24rem .7rem;border-radius:6px;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;text-decoration:none;white-space:nowrap;display:inline-block;transition:opacity .15s}
.xw-btn-login{background:transparent;border:1px solid var(--border,#334155);color:var(--text,#f1f5f9)}
html:not(.xw-dark) .xw-btn-login{border-color:#cbd5e1;color:#0f172a}
.xw-btn-register{background:#059669;border:1px solid #059669;color:white}
.xw-btn-account{background:transparent;border:1px solid var(--border,#334155);color:var(--text,#f1f5f9)}
.xw-btn-account.vip{border-color:rgba(251,191,36,.5);color:#fbbf24}
html:not(.xw-dark) .xw-btn-account{border-color:#cbd5e1;color:#0f172a}
.xw-btn-login:hover,.xw-btn-register:hover,.xw-btn-account:hover{opacity:.8}
#xw-mobile-menu{display:none;position:fixed;top:44px;left:0;right:0;background:var(--surface,#1e293b);border-bottom:1px solid var(--border,#334155);padding:.6rem 1.25rem 1rem;z-index:9996;box-shadow:0 4px 16px rgba(0,0,0,.2)}
html:not(.xw-dark) #xw-mobile-menu{background:#fff;border-color:#e2e8f0}
#xw-mobile-menu.open{display:block}
#xw-mobile-menu a{display:block;padding:.55rem .4rem;font-size:.88rem;font-weight:600;color:var(--muted,#94a3b8);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.05);transition:color .12s}
html:not(.xw-dark) #xw-mobile-menu a{color:#475569;border-color:#f1f5f9}
#xw-mobile-menu a:last-child{border-bottom:none}
#xw-mobile-menu a:hover{color:var(--text,#f1f5f9)}
html:not(.xw-dark) #xw-mobile-menu a:hover{color:#0f172a}
@media(min-width:640px){#xw-hamburger{display:none!important}.xw-nav-links{display:flex!important}}
@media(max-width:639px){.xw-nav-links{display:none!important}#xw-hamburger{display:flex!important}}
.top-nav{top:44px!important}
`;

  // ---------- 弹窗 CSS ----------
  var MODAL_CSS = [
    '.xw-modal-ov{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(5px);padding:1rem}',
    '.xw-mc{background:#fff;border-radius:18px;padding:2.2rem 1.75rem;width:100%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.25);position:relative;max-height:92vh;overflow-y:auto}',
    '.xw-mc-x{position:absolute;top:.85rem;right:.85rem;width:30px;height:30px;border:1px solid #e2e8f0;border-radius:7px;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;color:#94a3b8;line-height:1;transition:background .12s}',
    '.xw-mc-x:hover{background:#f1f5f9}',
    '.xw-mc-ttl{font-size:1.2rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:.3rem}',
    '.xw-mc-sub{font-size:.8rem;color:#64748b;text-align:center;margin-bottom:1.6rem;line-height:1.6}',
    '.xw-mf{margin-bottom:1rem}',
    '.xw-mf label{display:block;font-size:.82rem;font-weight:600;color:#334155;margin-bottom:.38rem}',
    '.xw-ph-row{display:flex;gap:.45rem}',
    '.xw-ph-pre{flex-shrink:0;display:flex;align-items:center;gap:.3rem;padding:.7rem .9rem;border:1px solid #e2e8f0;border-radius:8px;font-size:.84rem;color:#334155;background:#f8fafc;white-space:nowrap}',
    '.xw-mi{width:100%;padding:.72rem 1rem;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem;color:#0f172a;outline:none;transition:border-color .15s,box-shadow .15s;font-family:inherit;background:#fff}',
    '.xw-mi:focus{border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.1)}',
    '.xw-mi::placeholder{color:#94a3b8}',
    '.xw-mb{width:100%;padding:.85rem;border:none;border-radius:10px;font-size:.95rem;font-weight:700;cursor:pointer;background:#16a34a;color:#fff;margin-top:.6rem;transition:opacity .15s;font-family:inherit;display:block}',
    '.xw-mb:hover:not(:disabled){opacity:.88}.xw-mb:disabled{opacity:.5;cursor:default}',
    '.xw-merr2{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:.62rem 1rem;border-radius:8px;font-size:.82rem;margin-bottom:.9rem;display:none}',
    '.xw-ml{margin-top:1.2rem;text-align:center;font-size:.83rem;color:#64748b;line-height:2}',
    '.xw-ml a,.xw-mswitch{color:#16a34a;cursor:pointer;text-decoration:none;font-weight:600}',
    '.xw-ml a:hover,.xw-mswitch:hover{text-decoration:underline}',
    '.xw-mfgt{display:block;text-align:center;margin-top:.65rem;font-size:.82rem;color:#16a34a;cursor:pointer;font-weight:600}',
    '.xw-mfgt:hover{text-decoration:underline}'
  ].join('');

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
    },

    // 使用授权码
    async useActivationCode(code) {
      var sess = getSess();
      if (!sess) throw new Error('请先登录');
      if (isTokenExpired(sess)) {
        sess = await refreshSess();
        if (!sess) throw new Error('登录已过期，请重新登录');
      }
      var r = await fetch(SUPA_URL + '/rest/v1/rpc/use_activation_code', {
        method: 'POST',
        headers: makeHeaders(sess.access_token),
        body: JSON.stringify({ input_code: code })
      });
      if (!r.ok) {
        var d = await r.json();
        throw new Error(d.message || '请求失败');
      }
      // 激活成功后清除本地 profile 缓存，强制下次重新拉取
      localStorage.removeItem('xw_prof_v1');
      return await r.json(); // 返回 'ok' / 'used' / 'invalid'
    },

    // 使用授权码重置密码
    async resetPasswordWithCode(email, code, newPassword) {
      var r = await fetch(SUPA_URL + '/rest/v1/rpc/reset_password_with_code', {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify({ p_email: email, p_auth_code: code, p_new_password: newPassword })
      });
      var d = await r.json();
      if (!r.ok) throw new Error(d.message || d.error_description || '请求失败');
      return d; // 'ok' / 'invalid' / 'not_found'
    }
  };

  window.XWAuth = XWAuth;

  // ---------- 手机号转邮箱 ----------
  function phoneToEmail(p) { return p.replace(/\D/g, '') + '@qxsn.user'; }

  // ---------- Auth 弹窗 ----------
  var _modalStyled = false;
  function _ensureModalStyle() {
    if (_modalStyled) return; _modalStyled = true;
    var s = document.createElement('style'); s.textContent = MODAL_CSS;
    document.head.appendChild(s);
  }

  function openAuthModal(type) {
    closeAuthModal(); _ensureModalStyle();
    var ov = document.createElement('div');
    ov.className = 'xw-modal-ov'; ov.id = 'xw-auth-modal';
    ov.addEventListener('click', function (e) { if (e.target === ov) closeAuthModal(); });
    ov.innerHTML = '<div class="xw-mc" id="xw-mc"></div>';
    document.body.appendChild(ov);
    _renderModal(type);
  }
  window.openAuthModal = openAuthModal;

  function closeAuthModal() {
    var el = document.getElementById('xw-auth-modal'); if (el) el.remove();
  }
  window.closeAuthModal = closeAuthModal;

  function _renderModal(type) {
    var mc = document.getElementById('xw-mc'); if (!mc) return;
    var h = '<button class="xw-mc-x" onclick="closeAuthModal()">✕</button>';
    if (type === 'login') {
      h += '<div class="xw-mc-ttl">立即访问</div>'
         + '<div class="xw-mc-sub">输入授权手机号和激活码即可访问全部内容</div>'
         + '<div id="xw-merr" class="xw-merr2"></div>'
         + '<div class="xw-mf"><label>手机号</label>'
         + '<div class="xw-ph-row"><div class="xw-ph-pre">🇨🇳 +86</div>'
         + '<input class="xw-mi" type="tel" id="xw-ph" placeholder="请输入手机号码" maxlength="11" inputmode="numeric"></div></div>'
         + '<div class="xw-mf"><label>激活码</label>'
         + '<input class="xw-mi" type="text" id="xw-code" placeholder="请输入激活码" autocomplete="off" style="text-transform:uppercase;letter-spacing:.1em"></div>'
         + '<button class="xw-mb" id="xw-mb-btn" onclick="_doLogin()">立即访问</button>';
    } else if (type === 'reset') {
      h += '<div class="xw-mc-ttl">重置密码</div>'
         + '<div class="xw-mc-sub">请联系管理员重置您的密码</div>'
         + '<div style="text-align:center;padding:1.5rem 0">'
         + '<div style="font-size:2.5rem;margin-bottom:.75rem">📧</div>'
         + '<div style="font-size:.88rem;color:#475569;line-height:1.9">如需重置密码，请联系管理员<br>'
         + '<strong style="color:#0f172a">qiuxueshaonian@163.com</strong></div></div>'
         + '<div class="xw-ml">记起密码了？<span class="xw-mswitch" onclick="_renderModal(\'login\')">返回登录</span></div>';
    }
    mc.innerHTML = h;
    var fi = mc.querySelector('input');
    if (fi) setTimeout(function () { fi.focus(); }, 80);
    mc.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (type === 'login') _doLogin();
      else if (type === 'reset') _doReset();
    });
  }
  window._renderModal = _renderModal;

  function _showMErr(m) {
    var el = document.getElementById('xw-merr');
    if (el) { el.textContent = m; el.style.display = 'block'; }
  }

  async function _doLogin() {
    var ph = (document.getElementById('xw-ph').value || '').replace(/\D/g, '');
    var code = (document.getElementById('xw-code').value || '').trim().toUpperCase();
    var btn = document.getElementById('xw-mb-btn');
    if (!ph || ph.length < 11) { _showMErr('请输入正确的11位手机号'); return; }
    if (!code) { _showMErr('请输入激活码'); return; }
    btn.disabled = true; btn.textContent = '验证中…';
    try {
      // 1. 查询激活码是否有效
      var r = await fetch(SUPA_URL + '/rest/v1/activation_codes?code=eq.' + encodeURIComponent(code) + '&select=code,is_used', {
        headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
      });
      var rows = await r.json();
      if (!rows || !rows.length) { _showMErr('激活码无效，请检查后重试'); btn.disabled = false; btn.textContent = '立即访问'; return; }
      var row = rows[0];
      var email = phoneToEmail(ph);
      if (!row.is_used) {
        // 首次使用：创建账号并激活
        btn.textContent = '创建账号中…';
        try { await XWAuth.signUp(email, code); } catch(e2) { /* 已存在则忽略 */ }
        btn.textContent = '登录中…';
        await XWAuth.signIn(email, code);
        await XWAuth.useActivationCode(code);
      } else {
        // 已激活：直接登录（激活码即密码）
        btn.textContent = '登录中…';
        try {
          await XWAuth.signIn(email, code);
        } catch(e3) {
          _showMErr('手机号与激活码不匹配，请检查后重试');
          btn.disabled = false; btn.textContent = '立即访问'; return;
        }
      }
      closeAuthModal();
      var next = new URLSearchParams(location.search).get('next');
      var curr = location.pathname.split('/').pop() || '';
      if (curr === 'login.html') { location.replace(next || ROOT + 'index.html'); }
      else { location.reload(); }
    } catch (e) {
      var msg = e.message || '验证失败';
      if (/invalid/i.test(msg)) msg = '手机号或激活码错误，请重试';
      _showMErr(msg); btn.disabled = false; btn.textContent = '立即访问';
    }
  }
  window._doLogin = _doLogin;

  async function _doReset() {
    var ph = (document.getElementById('xw-ph').value || '').replace(/\D/g, '');
    var name = (document.getElementById('xw-name').value || '').trim();
    var code = (document.getElementById('xw-code').value || '').trim();
    var pw = document.getElementById('xw-pw').value;
    var pw2 = document.getElementById('xw-pw2').value;
    var btn = document.getElementById('xw-mb-btn');
    if (!ph || ph.length < 11) { _showMErr('请输入正确的11位手机号'); return; }
    if (!name) { _showMErr('请输入姓名'); return; }
    if (!code) { _showMErr('请输入授权码'); return; }
    if (!pw || pw.length < 6) { _showMErr('新密码至少需要 6 位'); return; }
    if (pw !== pw2) { _showMErr('两次密码不一致'); return; }
    btn.disabled = true; btn.textContent = '重置中…';
    try {
      var res = await XWAuth.resetPasswordWithCode(phoneToEmail(ph), code, pw);
      if (res === 'ok') {
        var mc = document.getElementById('xw-mc');
        if (mc) mc.innerHTML = '<div style="text-align:center;padding:2rem 1.5rem">'
          + '<div style="font-size:2.5rem;margin-bottom:.75rem">✅</div>'
          + '<div style="font-size:1.1rem;font-weight:800;color:#0f172a;margin-bottom:.5rem">密码已重置</div>'
          + '<div style="font-size:.85rem;color:#64748b;margin-bottom:1.5rem">请使用新密码登录</div>'
          + '<button class="xw-mb" onclick="_renderModal(\'login\')"返回登录</button></div>';
      } else if (res === 'invalid') {
        _showMErr('授权码与手机号不匹配，请检查后重试');
        btn.disabled = false; btn.textContent = '重置密码';
      } else if (res === 'not_found') {
        _showMErr('该手机号未注册，请先注册账号');
        btn.disabled = false; btn.textContent = '重置密码';
      } else {
        _showMErr('重置失败，请重试');
        btn.disabled = false; btn.textContent = '重置密码';
      }
    } catch (e) {
      _showMErr(e.message || '重置失败，请重试');
      btn.disabled = false; btn.textContent = '重置密码';
    }
  }
  window._doReset = _doReset;

  // ---------- 主题切换 ----------
  function applyTheme(t) {
    if (t === 'dark') document.documentElement.classList.add('xw-dark');
    else document.documentElement.classList.remove('xw-dark');
    var btn = document.getElementById('xw-theme-toggle');
    if (btn) btn.textContent = (t === 'dark') ? '☀️' : '🌙';
  }

  // ---------- 全局顶部导航 ----------
  function injectTopNav() {
    if (document.getElementById('xw-topnav')) return;
    var curr = window.location.pathname.split('/').pop() || 'index.html';
    if (curr === 'admin.html') return;

    var s = document.createElement('style');
    s.textContent = NAV_CSS;
    document.head.appendChild(s);

    var loggedIn = XWAuth.isLoggedIn();
    var authHtml = loggedIn
      ? '<a href="' + ROOT + 'account.html" class="xw-btn-account" id="xw-account-btn">👤 我的账号</a>'
      : '<button class="xw-btn-login" onclick="openAuthModal(\'login\')">登录</button>';

    document.body.insertAdjacentHTML('afterbegin',
      '<nav id="xw-topnav">'
      + '<div class="xw-nav-left">'
      +   '<a class="xw-logo" href="' + ROOT + 'index.html">'
      +     '<div class="xw-avatar" id="xw-avatar-el">求</div>'
      +     '<span class="xw-brand">求学少年</span>'
      +   '</a>'
      +   '<div class="xw-nav-links">'
      +     '<a href="' + ROOT + 'index.html">首页</a>'
      +     '<div class="xw-dropdown">'
      +       '<button class="xw-dropdown-btn" id="xw-course-btn">课程 ▾</button>'
      +       '<div class="xw-dropdown-menu" id="xw-course-menu">'
      +         '<a href="' + ROOT + '身体说明书网页/index.html">📖 身体说明书</a>'
      +         '<a href="' + ROOT + '解剖学网页/index.html">🫀 解剖学</a>'
      +         '<a href="' + ROOT + '生理学网页/index.html">⚡ 生理学</a>'
      +         '<a href="' + ROOT + '病理学网页/index.html">🔬 病理学</a>'
      +         '<a href="' + ROOT + '药理学网页/index.html">💊 药理学</a>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      + '</div>'
      + '<div class="xw-nav-right">'
      +   '<button id="xw-theme-toggle" title="切换日夜模式">🌙</button>'
      +   '<div style="display:flex;gap:.4rem;align-items:center">' + authHtml + '</div>'
      +   '<button id="xw-hamburger">☰</button>'
      + '</div>'
      + '</nav>'
      + '<div id="xw-mobile-menu">'
      +   '<a href="' + ROOT + 'index.html">🏠 首页</a>'
      +   '<a href="' + ROOT + '身体说明书网页/index.html">📖 身体说明书</a>'
      +   '<a href="' + ROOT + '解剖学网页/index.html">🫀 解剖学</a>'
      +   '<a href="' + ROOT + '生理学网页/index.html">⚡ 生理学</a>'
      +   '<a href="' + ROOT + '病理学网页/index.html">🔬 病理学</a>'
      +   '<a href="' + ROOT + '药理学网页/index.html">💊 药理学</a>'
      + '</div>'
    );

    // 尝试加载头像图片
    var avEl = document.getElementById('xw-avatar-el');
    if (avEl) {
      var img = new Image();
      img.onload = function () { avEl.innerHTML = '<img src="' + this.src + '" alt="">'; };
      img.src = ROOT + 'avatar.png';
    }

    // 应用主题
    var theme = localStorage.getItem('xw-theme') || 'light';
    applyTheme(theme);

    // 主题切换按钮
    document.getElementById('xw-theme-toggle').addEventListener('click', function () {
      var dark = document.documentElement.classList.contains('xw-dark');
      var next = dark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('xw-theme', next);
    });

    // 课程下拉菜单
    var courseBtn = document.getElementById('xw-course-btn');
    var courseMenu = document.getElementById('xw-course-menu');
    if (courseBtn) {
      courseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        courseMenu.classList.toggle('open');
      });
      document.addEventListener('click', function () { courseMenu.classList.remove('open'); });
    }

    // 移动端汉堡菜单
    var hamburger = document.getElementById('xw-hamburger');
    var mobileMenu = document.getElementById('xw-mobile-menu');
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
        hamburger.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
      });
    }

    // VIP 账号样式
    if (loggedIn) {
      XWAuth.getProfile().then(function (p) {
        var btn = document.getElementById('xw-account-btn');
        if (btn && p && p.is_vip) { btn.textContent = '✨ 我的账号'; btn.classList.add('vip'); }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', injectTopNav);

  // ---------- 章节门禁（自动执行） ----------
  var _COURSE = window._COURSE;
  var _CHAPTER = parseInt(window._CHAPTER, 10) || 0;
  var FREE_CHAPTERS = parseInt(window._FREE_CHAPTERS, 10) || 1;

  if (_COURSE && _CHAPTER > FREE_CHAPTERS) {
    // 未登录直接隐藏内容，避免闪烁
    var _earlySess = getSess();
    if (!_earlySess) {
      var _earlyStyle = document.createElement('style');
      _earlyStyle.id = 'xw-early-hide';
      _earlyStyle.textContent = '.main-content,.chapter-content,main{visibility:hidden!important}';
      document.head && document.head.appendChild(_earlyStyle) || document.addEventListener('DOMContentLoaded', function(){ document.head.appendChild(_earlyStyle); });
    }
    document.addEventListener('DOMContentLoaded', function () {
      var sess = getSess();
      if (!sess) { lockPage('login'); }
      // 登录后默认可访问全部内容，无需VIP检查
    });
  }

  // ---------- 章节链接拦截（未登录时直接弹窗，不跳转页面） ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var m = href.match(/chapter(\d+)\.html/);
    if (!m) return;
    var chNum = parseInt(m[1], 10);
    var freeNum = parseInt(window._FREE_CHAPTERS, 10) || 1;
    if (chNum <= freeNum) return;   // 免费章节，放行
    if (getSess()) return;          // 已登录，放行
    e.preventDefault();
    e.stopPropagation();
    openAuthModal('login');
  }, true);

  // ---------- 锁定遮罩 ----------
  function lockPage(type) {
    // 移除早期隐藏，改用模糊遮罩
    var earlyHide = document.getElementById('xw-early-hide');
    if (earlyHide) earlyHide.remove();
    var main = document.querySelector('.main-content') || document.querySelector('main');
    if (main) {
      main.style.cssText += 'filter:blur(8px);pointer-events:none;user-select:none;';
    }
    var hero = document.querySelector('.page-hero');
    if (hero) hero.style.cssText += 'filter:blur(3px);pointer-events:none;';

    var next = encodeURIComponent(window.location.href);
    var inner = '<div style="font-size:2.6rem;margin-bottom:1rem">🔒</div>'
        + '<h2 style="color:#f1f5f9;font-size:1.15rem;font-weight:800;margin-bottom:.5rem">登录后才能查看此章节</h2>'
        + '<p style="color:#94a3b8;font-size:.85rem;line-height:1.7;margin-bottom:1.8rem">请先登录，登录后即可访问全部内容</p>'
        + '<button onclick="openAuthModal(\'login\')" style="display:block;width:100%;background:#0284c7;color:white;padding:.8rem;border-radius:10px;font-weight:700;border:none;cursor:pointer;font-size:.9rem">立即登录</button>';

    var el = document.createElement('div');
    el.id = 'xw-lock-overlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.9);backdrop-filter:blur(6px);padding:1.5rem';
    el.innerHTML = '<div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:2.5rem 2rem;max-width:340px;width:100%;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,.6)">' + inner + '</div>';
    document.body.appendChild(el);
  }

})();
