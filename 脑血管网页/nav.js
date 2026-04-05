/**
 * nav.js — 脑血管网页统一导航
 * IIFE 风格，与其他科目保持一致
 */
(function () {
    const page = location.pathname.split('/').pop() || 'index.html';

    const chapters = [
        { h: 'chapter1.html', n: '1',  t: '大脑的血液供应' },
        { h: 'chapter2.html', n: '2',  t: '脑卒中是什么' },
        { h: 'chapter3.html', n: '3',  t: '识别卒中 FAST' },
        { h: 'chapter4.html', n: '4',  t: '急救黄金时间' },
        { h: 'chapter5.html', n: '5',  t: '脑梗' },
        { h: 'chapter6.html', n: '6',  t: '脑出血' },
        { h: 'chapter7.html', n: '7',  t: '卒中后遗症与康复' },
        { h: 'chapter8.html', n: '8',  t: '头痛：普通还是危险' },
        { h: 'chapter9.html', n: '9',  t: '预防复发' },
    ];

    const tools = [
        { h: 'stroke-card.html',    i: '🆘', t: '卒中识别卡' },
        { h: 'risk-checklist.html', i: '📋', t: '风险因素清单' },
        { h: 'rehab-timeline.html', i: '🏥', t: '康复时间表' },
    ];

    const phases = [
        { label: '🔵 大脑基础',    items: chapters.slice(0, 1) },
        { label: '🔴 认识卒中',    items: chapters.slice(1, 4) },
        { label: '🟠 卒中类型',    items: chapters.slice(4, 6) },
        { label: '🟢 恢复与预防', items: chapters.slice(6) },
    ];

    const isAct = h => h === page;
    const lnk = (h, cls, txt) => `<a href="${h}"${cls ? ` class="${cls}"` : ''}>${txt}</a>`;

    const chapGroup = phases.map(p =>
        `<div class="dropdown-group">
            <div class="dropdown-label">${p.label}</div>
            ${p.items.map(c => lnk(c.h, isAct(c.h) ? 'active' : null, `${c.n}. ${c.t}`)).join('\n            ')}
        </div>`
    ).join('');

    const toolGroup = `<div class="dropdown-group">
            <div class="dropdown-label">🛠️ 工具页</div>
            ${tools.map(t => lnk(t.h, isAct(t.h) ? 'active' : null, `${t.i} ${t.t}`)).join('\n            ')}
        </div>`;

    const chapterActive = chapters.some(c => c.h === page);
    const toolActive    = tools.some(t => t.h === page);

    const navHTML = `
        ${lnk('index.html', 'logo', '🧠 脑血管篇')}
        <ul class="nav-links" id="navLinks">
            <li><a href="../index.html" class="nav-portal-link">🏠 总目录</a></li>
            <li class="nav-dropdown">
                <a href="#" class="nav-dropdown-toggle${chapterActive ? ' active' : ''}">📚 章节 <span class="nav-arrow">▾</span></a>
                <div class="nav-dropdown-menu chapters-menu">${chapGroup}</div>
            </li>
            <li class="nav-dropdown">
                <a href="#" class="nav-dropdown-toggle${toolActive ? ' active' : ''}">🛠️ 工具 <span class="nav-arrow">▾</span></a>
                <div class="nav-dropdown-menu tools-menu">${toolGroup}</div>
            </li>
            <li>${lnk('index.html', isAct('index.html') ? 'active' : null, '主页')}</li>
        </ul>
        <button class="nav-hamburger" id="navHamburger" aria-label="打开菜单">
            <span></span><span></span><span></span>
        </button>`;

    let sidebarContent = '<a href="../index.html" class="sidebar-link sidebar-portal-link">← 返回总目录</a>';
    sidebarContent += lnk('index.html', 'sidebar-link' + (isAct('index.html') ? ' active' : ''), '🏠 主页');
    phases.forEach(p => {
        sidebarContent += `<div class="sidebar-section">${p.label}</div>`;
        sidebarContent += p.items.map(c =>
            lnk(c.h, 'sidebar-link' + (isAct(c.h) ? ' active' : ''), `${c.n}. ${c.t}`)
        ).join('');
    });
    sidebarContent += '<div class="sidebar-section">🛠️ 工具页</div>';
    sidebarContent += tools.map(t =>
        lnk(t.h, 'sidebar-link' + (isAct(t.h) ? ' active' : ''), `${t.i} ${t.t}`)
    ).join('');

    const sidebarHTML = `
    <div class="nav-overlay" id="navOverlay"></div>
    <div class="nav-sidebar" id="navSidebar">
        <div class="sidebar-header">
            <span>🧠 脑血管篇</span>
            <button class="sidebar-close" id="sidebarClose">✕</button>
        </div>
        <div class="sidebar-body">${sidebarContent}</div>
    </div>`;

    const navInner = document.querySelector('.top-nav-inner');
    if (navInner) navInner.innerHTML = navHTML;

    if (!document.getElementById('_nps')) {
        const _s = document.createElement('style');
        _s.id = '_nps';
        _s.textContent = '.nav-portal-link{padding:6px 12px;border-radius:6px;font-size:0.85rem;color:rgba(255,255,255,0.85);text-decoration:none;display:inline-block;transition:all 0.2s}.nav-portal-link:hover{background:rgba(255,255,255,0.2);color:white}.sidebar-portal-link{opacity:.6!important;font-size:.8em!important;border-bottom:1px dashed rgba(255,255,255,.15);padding-bottom:.55em!important;margin-bottom:.3em}';
        document.head.appendChild(_s);
    }

    document.body.insertAdjacentHTML('beforeend', sidebarHTML);

    if (page !== 'index.html') {
        const fab = document.createElement('a');
        fab.href = 'index.html';
        fab.className = 'fab-home';
        fab.title = '返回首页';
        fab.innerHTML = '🏠';
        document.body.appendChild(fab);
    }

    const hamburger = document.getElementById('navHamburger');
    const sidebar   = document.getElementById('navSidebar');
    const overlay   = document.getElementById('navOverlay');
    const closeBtn  = document.getElementById('sidebarClose');

    const openSidebar = () => {
        sidebar && sidebar.classList.add('open');
        overlay && overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    const closeSidebar = () => {
        sidebar && sidebar.classList.remove('open');
        overlay && overlay.classList.remove('show');
        document.body.style.overflow = '';
    };

    hamburger && hamburger.addEventListener('click', openSidebar);
    overlay   && overlay.addEventListener('click', closeSidebar);
    closeBtn  && closeBtn.addEventListener('click', closeSidebar);

    document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', e => {
            e.preventDefault();
            const li = toggle.closest('.nav-dropdown');
            const isOpen = li.classList.contains('open');
            document.querySelectorAll('.nav-dropdown.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) li.classList.add('open');
        });
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown.open').forEach(el => el.classList.remove('open'));
        }
    });
})();

  var chapters = [
    { file: 'chapter1.html', label: '第1章 · 大脑的血液供应' },
    { file: 'chapter2.html', label: '第2章 · 脑卒中是什么' },
    { file: 'chapter3.html', label: '第3章 · 识别卒中 FAST' },
    { file: 'chapter4.html', label: '第4章 · 急救黄金时间' },
    { file: 'chapter5.html', label: '第5章 · 脑梗' },
    { file: 'chapter6.html', label: '第6章 · 脑出血' },
    { file: 'chapter7.html', label: '第7章 · 卒中后遗症与康复' },
    { file: 'chapter8.html', label: '第8章 · 头痛：普通还是危险' },
    { file: 'chapter9.html', label: '第9章 · 预防复发' }
  ];

  var tools = [
    { file: 'stroke-card.html',    label: '🆘 卒中识别卡' },
    { file: 'risk-checklist.html', label: '📋 风险因素清单' },
    { file: 'rehab-timeline.html', label: '🏥 康复时间表' }
  ];

  var phases = [
    { label: '🔵 大脑基础',   items: [chapters[0]] },
    { label: '🔴 认识卒中',   items: [chapters[1], chapters[2], chapters[3]] },
    { label: '🟠 卒中类型',   items: [chapters[4], chapters[5]] },
    { label: '🟢 恢复与预防', items: [chapters[6], chapters[7], chapters[8]] }
  ];

  function li(item) {
    var cls = item.file === currentPath ? ' class="active"' : '';
    return '<a href="' + item.file + '"' + cls + '>' + item.label + '</a>';
  }

  var dropdownHTML = '';
  phases.forEach(function (p) {
    dropdownHTML += '<div class="dropdown-group-label">' + p.label + '</div>';
    dropdownHTML += '<div class="dropdown-group">';
    p.items.forEach(function (it) { dropdownHTML += li(it); });
    dropdownHTML += '</div>';
  });
  dropdownHTML += '<div class="dropdown-divider"></div>';
  dropdownHTML += '<div class="dropdown-group-label">🛠 工具页</div>';
  dropdownHTML += '<div class="dropdown-group">';
  tools.forEach(function (t) { dropdownHTML += li(t); });
  dropdownHTML += '</div>';

  var sidebarHTML = '';
  phases.forEach(function (p) {
    sidebarHTML += '<div class="sidebar-section-label">' + p.label + '</div>';
    p.items.forEach(function (it) { sidebarHTML += li(it); });
  });
  sidebarHTML += '<div class="sidebar-section-label">🛠 工具页</div>';
  tools.forEach(function (t) { sidebarHTML += li(t); });

  var navHTML = '<nav class="top-nav">' +
    '<div class="nav-inner">' +
      '<div class="nav-logo"><a href="index.html">🧠 脑血管篇</a></div>' +
      '<div class="nav-links">' +
        '<a href="index.html"' + (currentPath === 'index.html' ? ' class="active"' : '') + '>首页</a>' +
        '<div class="nav-dropdown">' +
          '<button class="dropdown-toggle">章节 ▾</button>' +
          '<div class="dropdown-menu">' + dropdownHTML + '</div>' +
        '</div>' +
        '<a href="../index.html">↩ 总目录</a>' +
      '</div>' +
      '<button class="hamburger" id="hamburger" aria-label="菜单">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
    '</div>' +
  '</nav>' +
  '<div class="mobile-sidebar" id="mobileSidebar">' +
    '<div class="sidebar-overlay" id="sidebarOverlay"></div>' +
    '<div class="sidebar-panel">' +
      '<button class="sidebar-close" id="sidebarClose">✕</button>' +
      '<a href="index.html" style="font-weight:700;font-size:1.05rem;">🧠 脑血管篇 · 首页</a>' +
      sidebarHTML +
      '<div style="height:1px;background:rgba(255,255,255,.2);margin:.8rem 0"></div>' +
      '<a href="../index.html">↩ 返回总目录</a>' +
    '</div>' +
  '</div>';

  document.write(navHTML);

  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger');
    var sidebar   = document.getElementById('mobileSidebar');
    var overlay   = document.getElementById('sidebarOverlay');
    var closeBtn  = document.getElementById('sidebarClose');
    if (hamburger) hamburger.addEventListener('click', function () { sidebar.classList.add('open'); });
    if (overlay)   overlay.addEventListener('click',   function () { sidebar.classList.remove('open'); });
    if (closeBtn)  closeBtn.addEventListener('click',  function () { sidebar.classList.remove('open'); });
  });
})();
