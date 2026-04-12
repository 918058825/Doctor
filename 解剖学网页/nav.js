/**
 * nav.js — 解剖学网站统一导航脚本
 * 功能：下拉菜单 / 汉堡侧边栏 / FAB返回首页 / 自动高亮当前页
 * 用法：在每个页面 </body> 前添加 <script src="nav.js"></script>
 */
(function () {
    const page = location.pathname.split('/').pop() || 'index.html';

    const chapters = [
        { h: 'chapter1.html',  n: '1',  t: '解剖学是什么' },
        { h: 'chapter2.html',  n: '2',  t: '解剖学分支' },
        { h: 'chapter3.html',  n: '3',  t: '结构层次' },
        { h: 'chapter4.html',  n: '4',  t: '方位术语' },
        { h: 'chapter5.html',  n: '5',  t: '运动系统' },
        { h: 'chapter6.html',  n: '6',  t: '消化系统' },
        { h: 'chapter7.html',  n: '7',  t: '呼吸系统' },
        { h: 'chapter8.html',  n: '8',  t: '循环系统' },
        { h: 'chapter9.html',  n: '9',  t: '泌尿系统' },
        { h: 'chapter10.html', n: '10', t: '生殖系统' },
        { h: 'chapter11.html', n: '11', t: '神经系统' },
        { h: 'chapter12.html', n: '12', t: '内分泌' },
        { h: 'chapter13.html', n: '13', t: '感觉器官' },
        { h: 'chapter14.html', n: '14', t: '总结复习' },
    ];

    const tools = [
        { h: 'glossary.html',        i: '📖', t: '术语词典' },
        { h: 'compare.html',         i: '⚖️', t: '系统对比' },
        { h: 'daily-scenarios.html', i: '🎬', t: '日常场景' },
        { h: 'body-signals.html',    i: '📡', t: '信号解码' },
        { h: 'hands-on.html',        i: '🖐️', t: '动手体验' },
    ];

    const isAct = h => h === page;
    const lnk = (h, cls, txt) => `<a href="${h}"${cls ? ` class="${cls}"` : ''}>${txt}</a>`;

    /* ---- 下拉菜单内容 ---- */
    const phases = [
        { label: '🟢 基础阶段', items: chapters.slice(0, 4) },
        { label: '🟡 系统阶段', items: chapters.slice(4, 10) },
        { label: '🔴 调控阶段', items: chapters.slice(10) },
    ];
    const chapGroup = phases.map(p =>
        `<div class="dropdown-group">
            <div class="dropdown-label">${p.label}</div>
            ${p.items.map(c => lnk(c.h, isAct(c.h) ? 'active' : null, `${c.n}. ${c.t}`)).join('\n            ')}
        </div>`
    ).join('');

    const toolGroups = [
        { label: '📚 参考工具', items: tools.slice(0, 2) },
        { label: '🎯 理解工具', items: tools.slice(2) },
    ];
    const toolGroup = toolGroups.map(g =>
        `<div class="dropdown-group">
            <div class="dropdown-label">${g.label}</div>
            ${g.items.map(t => lnk(t.h, isAct(t.h) ? 'active' : null, `${t.i} ${t.t}`)).join('\n            ')}
        </div>`
    ).join('');

    const chapterActive = chapters.some(c => c.h === page);
    const toolActive    = tools.some(t => t.h === page);

    /* ---- 顶部导航 HTML ---- */
    const navHTML = `
        ${lnk('index.html', 'logo', '🫀 结构篇')}
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

    /* ---- 侧边栏内容 ---- */
    let sidebarContent = '<a href="../index.html" class="sidebar-link sidebar-portal-link">← 返回总目录</a>';
    sidebarContent += lnk('index.html', 'sidebar-link' + (isAct('index.html') ? ' active' : ''), '🏠 主页');
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
            <span>🫀 结构篇</span>
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
        _s.textContent = '.nav-portal-link{padding:6px 12px;border-radius:6px;font-size:0.85rem;color:rgba(255,255,255,0.85);text-decoration:none;display:inline-block;transition:all 0.2s}.nav-portal-link:hover{background:rgba(255,255,255,0.2);color:white}.sidebar-portal-link{opacity:.6!important;font-size:.8em!important;border-bottom:1px dashed rgba(255,255,255,.15);padding-bottom:.55em!important;margin-bottom:.3em}';
        document.head.appendChild(_s);
    }

    document.body.insertAdjacentHTML('beforeend', sidebarHTML);

    // FAB 返回首页（非首页才显示）
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

    // 下拉菜单点击切换
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

    // 点击其他区域关闭下拉
    document.addEventListener('click', function (e) {
        const inDropdown = e.target && e.target.closest && e.target.closest('.nav-dropdown');
        if (!inDropdown) {
            document.querySelectorAll('.nav-dropdown').forEach(function (d) { d.classList.remove('open'); });
        }
    });

})();
