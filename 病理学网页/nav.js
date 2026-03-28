/**
 * nav.js — 病理学网站统一导航脚本
 * 功能：下拉菜单 / 汉堡侧边栏 / FAB返回首页 / 自动高亮当前页
 * 用法：在每个页面 </body> 前添加 <script src="nav.js"></script>
 */
(function () {
    const page = location.pathname.split('/').pop() || 'index.html';

    const chapters = [
        { h: 'chapter1.html',  n: '1',  t: '细胞损伤与死亡' },
        { h: 'chapter2.html',  n: '2',  t: '炎症' },
        { h: 'chapter3.html',  n: '3',  t: '修复与再生' },
        { h: 'chapter4.html',  n: '4',  t: '肿瘤基础' },
        { h: 'chapter5.html',  n: '5',  t: '循环系统病理' },
        { h: 'chapter6.html',  n: '6',  t: '呼吸系统病理' },
        { h: 'chapter7.html',  n: '7',  t: '消化系统病理' },
        { h: 'chapter8.html',  n: '8',  t: '泌尿系统病理' },
        { h: 'chapter9.html',  n: '9',  t: '神经系统病理' },
        { h: 'chapter10.html', n: '10', t: '内分泌病理' },
        { h: 'chapter11.html', n: '11', t: '免疫与自身免疫' },
        { h: 'chapter12.html', n: '12', t: '运动与代谢病理' },
    ];

    const tools = [
        { h: 'glossary.html',    i: '📖', t: '术语词典' },
        { h: 'disease-map.html', i: '🗺️', t: '疾病关联地图' },
        { h: 'drug-logic.html',  i: '💊', t: '药物逻辑解析' },
    ];

    const isAct = h => h === page;
    const lnk = (h, cls, txt) => `<a href="${h}"${cls ? ` class="${cls}"` : ''}>${txt}</a>`;

    /* ---- 下拉菜单：章节按3个阶段分组 ---- */
    const phases = [
        { label: '🔴 基础病理（通用机制）', items: chapters.slice(0, 4) },
        { label: '🟠 系统病理·上篇',        items: chapters.slice(4, 8) },
        { label: '🟣 系统病理·下篇',        items: chapters.slice(8) },
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

    /* ---- 顶部导航 HTML ---- */
    const navHTML = `
        ${lnk('index.html', 'logo', '🔬 病理学入门')}
        <ul class="nav-links" id="navLinks">
            <li>${lnk('index.html', isAct('index.html') ? 'active' : null, '首页')}</li>
            <li class="nav-dropdown">
                <a href="#" class="nav-dropdown-toggle${chapterActive ? ' active' : ''}">📚 章节 <span class="nav-arrow">▾</span></a>
                <div class="nav-dropdown-menu chapters-menu">${chapGroup}</div>
            </li>
            <li class="nav-dropdown">
                <a href="#" class="nav-dropdown-toggle${toolActive ? ' active' : ''}">🛠️ 工具 <span class="nav-arrow">▾</span></a>
                <div class="nav-dropdown-menu tools-menu">${toolGroup}</div>
            </li>
            <li><a href="../index.html" class="nav-portal-link">🏠 总目录</a></li>
        </ul>
        <button class="nav-hamburger" id="navHamburger" aria-label="打开菜单">
            <span></span><span></span><span></span>
        </button>`;

    /* ---- 侧边栏内容 ---- */
    let sidebarContent = '<a href="../index.html" class="sidebar-link sidebar-portal-link">← 返回总目录</a>';
    sidebarContent += lnk('index.html', 'sidebar-link' + (isAct('index.html') ? ' active' : ''), '🏠 首页');
    phases.forEach(p => {
        sidebarContent += `<div class="sidebar-section">${p.label}</div>`;
        sidebarContent += p.items.map(c =>
            lnk(c.h, 'sidebar-link' + (isAct(c.h) ? ' active' : ''), `${c.n}. ${c.t}`)
        ).join('');
    });
    sidebarContent += '<div class="sidebar-section">🛠️ 学习工具</div>';
    sidebarContent += tools.map(t =>
        lnk(t.h, 'sidebar-link' + (isAct(t.h) ? ' active' : ''), `${t.i} ${t.t}`)
    ).join('');

    const sidebarHTML = `
    <div class="nav-overlay" id="navOverlay"></div>
    <div class="nav-sidebar" id="navSidebar">
        <div class="sidebar-header">
            <span>🔬 病理学入门</span>
            <button class="sidebar-close" id="sidebarClose">✕</button>
        </div>
        <div class="sidebar-body">${sidebarContent}</div>
    </div>`;

    /* ---- 注入 DOM ---- */
    const navInner = document.querySelector('.top-nav-inner');
    if (navInner) navInner.innerHTML = navHTML;

    // 注入门户链接样式
    if (!document.getElementById('_nps')) {
        const _s = document.createElement('style');
        _s.id = '_nps';
        _s.textContent = '.nav-portal-link{padding:.25em .65em;border-radius:5px;border:1px solid rgba(255,255,255,.2);font-size:.8em;opacity:.75;margin-left:.3rem;transition:opacity .15s,background .15s;color:inherit;text-decoration:none;display:inline-block}.nav-portal-link:hover{opacity:1;background:rgba(255,255,255,.08)}.sidebar-portal-link{opacity:.6!important;font-size:.8em!important;border-bottom:1px dashed rgba(255,255,255,.15);padding-bottom:.55em!important;margin-bottom:.3em}';
        document.head.appendChild(_s);
    }

    document.body.insertAdjacentHTML('beforeend', sidebarHTML);

    /* ---- FAB 返回首页（非首页才显示） ---- */
    if (page !== 'index.html') {
        const fab = document.createElement('a');
        fab.href = 'index.html';
        fab.className = 'fab-home';
        fab.title = '返回首页';
        fab.innerHTML = '🏠';
        document.body.appendChild(fab);
    }

    /* ---- 事件绑定 ---- */
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

    /* ---- 下拉菜单点击切换 ---- */
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

    /* ---- 点击其他区域关闭下拉 ---- */
    document.addEventListener('click', function (e) {
        const inDropdown = e.target && e.target.closest && e.target.closest('.nav-dropdown');
        if (!inDropdown) {
            document.querySelectorAll('.nav-dropdown').forEach(function (d) { d.classList.remove('open'); });
        }
    });

})();
