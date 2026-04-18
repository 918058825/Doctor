/**
 * nav.js — 体检报告网页统一导航
 * IIFE 风格，与其他科目保持一致
 */
(function () {
    const page = location.pathname.split('/').pop() || 'index.html';

    const chapters = [
        { h: 'chapter1.html',  n: '1',  t: '怎么正确参加体检' },
        { h: 'chapter2.html',  n: '2',  t: '血常规' },
        { h: 'chapter3.html',  n: '3',  t: '肝功能' },
        { h: 'chapter4.html',  n: '4',  t: '肾功能' },
        { h: 'chapter5.html',  n: '5',  t: '血糖与糖化血红蛋白' },
        { h: 'chapter6.html',  n: '6',  t: '血脂四项' },
        { h: 'chapter7.html',  n: '7',  t: '甲状腺' },
        { h: 'chapter8.html',  n: '8',  t: '肿瘤标志物' },
        { h: 'chapter9.html',  n: '9',  t: '影像报告' },
        { h: 'chapter10.html', n: '10', t: '体检报告综合解读' },
    ];

    const tools = [
        { h: 'indicator-lookup.html', i: '📊', t: '指标速查表' },
        { h: 'risk-signals.html',     i: '🚨', t: '风险信号清单' },
        { h: 'followup-guide.html',   i: '📅', t: '复查时间表' },
    ];

    const isAct = h => h === page;
    const lnk = (h, cls, txt) => `<a href="${h}"${cls ? ` class="${cls}"` : ''}>${txt}</a>`;

    const phases = [
        { label: '🟢 准备篇',               items: chapters.slice(0, 1) },
        { label: '🔵 血液检查（第 2-6 章）', items: chapters.slice(1, 6) },
        { label: '🟣 专项检查（第 7-10 章）', items: chapters.slice(6) },
    ];

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
        ${lnk('index.html', 'logo', '📋 体检报告')}
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
            <span>📋 体检报告篇</span>
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

    document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
        const toggle = dd.querySelector('.nav-dropdown-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const wasOpen = dd.classList.contains('open');
            document.querySelectorAll('.nav-dropdown').forEach(function (d) { d.classList.remove('open'); });
            if (!wasOpen) dd.classList.add('open');
        });
    });

    document.addEventListener('click', function (e) {
        const inDropdown = e.target && e.target.closest && e.target.closest('.nav-dropdown');
        if (!inDropdown) {
            document.querySelectorAll('.nav-dropdown').forEach(function (d) { d.classList.remove('open'); });
        }
    });
})();
