/* 消化篇导航 · nav.js */
(function () {
    const chapters = [
        { h: 'chapter1.html',  n: '1',  t: '消化系统总览' },
        { h: 'chapter2.html',  n: '2',  t: '幽门螺杆菌' },
        { h: 'chapter3.html',  n: '3',  t: '胃炎与胃溃疡' },
        { h: 'chapter4.html',  n: '4',  t: '胃食管反流' },
        { h: 'chapter5.html',  n: '5',  t: '胃癌' },
        { h: 'chapter6.html',  n: '6',  t: '肠易激综合征' },
        { h: 'chapter7.html',  n: '7',  t: '便秘' },
        { h: 'chapter8.html',  n: '8',  t: '结直肠癌' },
        { h: 'chapter9.html',  n: '9',  t: '脂肪肝' },
        { h: 'chapter10.html', n: '10', t: '胆结石与胆囊炎' },
    ];
    const tools = [
        { h: 'symptom-checker.html',   i: '🔍', t: '消化道症状自查' },
        { h: 'colonoscopy-guide.html', i: '🔭', t: '肠镜筛查指南' },
        { h: 'digestive-drugs.html',   i: '💊', t: '常见消化药物说明' },
    ];
    const phases = [
        { label: '🟡 消化基础', ids: [1] },
        { label: '🟠 胃部疾病', ids: [2,3,4,5] },
        { label: '🟢 肠道健康', ids: [6,7,8] },
        { label: '🟣 肝胆问题', ids: [9,10] },
    ];

    const path = location.pathname;
    const isIndex = path.endsWith('index.html') || path.endsWith('消化网页/') || path.endsWith('消化网页');

    function activePath(href) {
        return path.endsWith(href) ? ' active' : '';
    }

    // 构建章节下拉菜单（分组）
    let chapGroups = '';
    phases.forEach(ph => {
        let links = '';
        ph.ids.forEach(id => {
            const c = chapters[id - 1];
            links += `<a href="${c.h}" class="${activePath(c.h)}">第${c.n}章 · ${c.t}</a>`;
        });
        chapGroups += `<div class="dropdown-group"><div class="dropdown-label">${ph.label}</div>${links}</div>`;
    });

    // 构建工具页下拉
    let toolLinks = '';
    tools.forEach(t => {
        toolLinks += `<a href="${t.h}" class="${activePath(t.h)}">${t.i} ${t.t}</a>`;
    });

    // 构建侧边栏（移动端）
    let sidebarLinks = '';
    phases.forEach(ph => {
        sidebarLinks += `<div class="sidebar-section">${ph.label}</div>`;
        ph.ids.forEach(id => {
            const c = chapters[id - 1];
            sidebarLinks += `<a href="${c.h}" class="sidebar-link${activePath(c.h)}">第${c.n}章 · ${c.t}</a>`;
        });
    });
    sidebarLinks += `<div class="sidebar-section">🛠 工具页</div>`;
    tools.forEach(t => {
        sidebarLinks += `<a href="${t.h}" class="sidebar-link${activePath(t.h)}">${t.i} ${t.t}</a>`;
    });

    const fabHTML = isIndex ? '' : `<a href="index.html" class="fab-home" title="返回首页">🏠</a>`;

    const navHTML = `
<nav class="top-nav">
  <div class="top-nav-inner">
    <a href="index.html" class="logo">🍽️ 消化篇</a>
    <ul class="nav-links">
      <li><a href="../index.html" class="nav-portal-link">🏠 总目录</a></li>
      <li class="nav-dropdown" id="chapDropdown">
        <a class="nav-dropdown-toggle">📚 章节 <span class="nav-arrow">▼</span></a>
        <div class="nav-dropdown-menu chapters-menu">${chapGroups}</div>
      </li>
      <li class="nav-dropdown" id="toolDropdown">
        <a class="nav-dropdown-toggle">🛠️ 工具 <span class="nav-arrow">▼</span></a>
        <div class="nav-dropdown-menu">${toolLinks}</div>
      </li>
      <li><a href="index.html"${isIndex ? ' class="active"' : ''}>主页</a></li>
    </ul>
    <button class="nav-hamburger" id="navHamburger" aria-label="菜单">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-overlay" id="navOverlay"></div>
<aside class="nav-sidebar" id="navSidebar">
  <div class="sidebar-header">
    <span>🍽️ 消化篇</span>
    <button class="sidebar-close" id="sidebarClose">✕</button>
  </div>
  <div class="sidebar-body">
    <a href="index.html" class="sidebar-link${activePath('index.html')}">🏠 消化篇首页</a>
    ${sidebarLinks}
    <div class="sidebar-section">🏠 总导航</div>
    <a href="../index.html" class="sidebar-link">← 返回总首页</a>
  </div>
</aside>
${fabHTML}`;

    document.write(navHTML);

    document.addEventListener('DOMContentLoaded', function () {
        // 下拉菜单
        ['chapDropdown', 'toolDropdown'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.querySelector('.nav-dropdown-toggle').addEventListener('click', function (e) {
                e.stopPropagation();
                const wasOpen = el.classList.contains('open');
                document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
                if (!wasOpen) el.classList.add('open');
            });
        });
        document.addEventListener('click', function () {
            document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
        });

        // 汉堡菜单
        const hamburger = document.getElementById('navHamburger');
        const sidebar   = document.getElementById('navSidebar');
        const overlay   = document.getElementById('navOverlay');
        const closeBtn  = document.getElementById('sidebarClose');
        function openSidebar()  { sidebar.classList.add('open'); overlay.classList.add('show'); }
        function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
        if (hamburger) hamburger.addEventListener('click', openSidebar);
        if (overlay)   overlay.addEventListener('click', closeSidebar);
        if (closeBtn)  closeBtn.addEventListener('click', closeSidebar);
    });
})();
