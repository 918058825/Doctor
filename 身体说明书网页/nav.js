/* ============================================================
   身体说明书 — 导航组件 nav.js
   风格与四门课统一：顶部导航 + 移动端右侧抽屉
   ============================================================ */
(function () {
    /* ---- 页面数据 ---- */
    var pages = [
        { h: 'index.html',         i: '🏠', t: '首页' },
        { h: 'normal-values.html',  i: '📊', t: '人体正常值手册' },
        { h: 'abbreviations.html',  i: '🔤', t: '医学缩写词典' },
        { h: 'mnemonics.html',      i: '🧠', t: '趣味记忆口诀' },
        { h: 'key-points.html',     i: '⭐', t: '核心考点速记' },
        { h: 'drug-quick.html',     i: '💊', t: '疾病用药速查' },
        { h: 'knowledge-map.html',  i: '🗺️', t: '知识图谱' },
        { h: 'quiz-daily.html',     i: '❓', t: '每日一题' }
    ];

    var curFile = location.pathname.split('/').pop() || 'index.html';

    /* ---- 桌面端导航 HTML ---- */
    var navHTML = '<div class="top-nav"><div class="top-nav-inner">';
    navHTML += '<a href="index.html" class="logo">📖 身体说明书</a>';

    /* 导航链接 */
    navHTML += '<ul class="nav-links">';
    /* 下拉：全部页面 */
    navHTML += '<li class="nav-dropdown">';
    navHTML += '<button class="nav-dropdown-toggle">' + (curFile === 'index.html' ? '首页' : pages.find(function(p){ return p.h === curFile; })?.t || '目录') + ' <span class="nav-arrow">▼</span></button>';
    navHTML += '<div class="nav-dropdown-menu chapters-menu">';
    navHTML += '<div class="dropdown-group">';
    pages.forEach(function (p) {
        var ac = (p.h === curFile) ? ' class="active"' : '';
        navHTML += '<a href="' + p.h + '"' + ac + '>' + p.i + ' ' + p.t + '</a>';
    });
    navHTML += '</div></div></li>';
    navHTML += '<li><a href="../index.html" style="opacity:0.75;font-size:0.82rem">← 返回总目录</a></li>';
    navHTML += '</ul>';

    /* 汉堡按钮 */
    navHTML += '<button class="nav-hamburger" aria-label="菜单"><span></span><span></span><span></span></button>';
    navHTML += '</div></div>';

    /* ---- 侧边栏 HTML ---- */
    var sidebarLinks = '';
    sidebarLinks += '<a href="../index.html" class="sidebar-link" style="color:#6b7280;font-size:0.82rem">← 返回总目录</a>';
    pages.forEach(function (p) {
        var ac = (p.h === curFile) ? ' active' : '';
        sidebarLinks += '<a href="' + p.h + '" class="sidebar-link' + ac + '">' + p.i + ' ' + p.t + '</a>';
    });

    var sidebarHTML = '<div class="nav-overlay" id="navOverlay"></div>';
    sidebarHTML += '<div class="nav-sidebar" id="navSidebar">';
    sidebarHTML += '<div class="sidebar-header"><span>📖 身体说明书</span><button class="sidebar-close" id="sidebarClose">✕</button></div>';
    sidebarHTML += '<div class="sidebar-body">' + sidebarLinks + '</div>';
    sidebarHTML += '</div>';

    /* ---- 注入 DOM ---- */
    document.body.innerHTML = navHTML + document.body.innerHTML;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);

    /* 非首页显示 FAB */
    if (curFile !== 'index.html') {
        var fab = document.createElement('a');
        fab.href = 'index.html';
        fab.className = 'fab-home';
        fab.title = '返回首页';
        fab.textContent = '🏠';
        document.body.appendChild(fab);
    }

    /* ---- 事件绑定 ---- */
    var overlay = document.getElementById('navOverlay');
    var sidebar = document.getElementById('navSidebar');
    var hamburger = document.querySelector('.nav-hamburger');
    var closeBtn = document.getElementById('sidebarClose');

    function openSidebar()  { overlay.classList.add('show'); sidebar.classList.add('open'); }
    function closeSidebar() { overlay.classList.remove('show'); sidebar.classList.remove('open'); }

    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (overlay)   overlay.addEventListener('click', closeSidebar);
    if (closeBtn)  closeBtn.addEventListener('click', closeSidebar);

    /* 下拉菜单 */
    document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var dd = btn.closest('.nav-dropdown');
            var isOpen = dd.classList.contains('open');
            document.querySelectorAll('.nav-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
            if (!isOpen) dd.classList.add('open');
        });
    });
    document.addEventListener('click', function () {
        document.querySelectorAll('.nav-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    });
})();
