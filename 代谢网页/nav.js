/* 代谢篇导航 · nav.js */
(function () {
    const chapters = [
        { h: 'chapter1.html', n: '1', t: '代谢是什么' },
        { h: 'chapter2.html', n: '2', t: '糖尿病' },
        { h: 'chapter3.html', n: '3', t: '糖尿病并发症' },
        { h: 'chapter4.html', n: '4', t: '甲状腺' },
        { h: 'chapter5.html', n: '5', t: '痛风' },
        { h: 'chapter6.html', n: '6', t: '肥胖' },
        { h: 'chapter7.html', n: '7', t: '骨质疏松' },
        { h: 'chapter8.html', n: '8', t: '代谢综合征' },
        { h: 'chapter9.html', n: '9', t: '生活方式干预' },
    ];
    const tools = [
        { h: 'metabolism-indicators.html', i: '📊', t: '代谢指标一览表' },
        { h: 'glucose-monitor.html',       i: '🩸', t: '血糖自测指南' },
        { h: 'medication-guide.html',      i: '💊', t: '常用药物说明' },
    ];
    const phases = [
        { label: '🟡 代谢基础', ids: [1,2,3] },
        { label: '🟠 内分泌代谢', ids: [4,5,6] },
        { label: '🟣 慢病管理', ids: [7,8,9] },
    ];

    const path = location.pathname;
    const isIndex = path.endsWith('index.html') || path.endsWith('代谢网页/') || path.endsWith('代谢网页');

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
    <a href="index.html" class="logo">🧬 代谢篇</a>
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
    <span>🧬 代谢篇</span>
    <button class="sidebar-close" id="sidebarClose">✕</button>
  </div>
  <div class="sidebar-body">
    <a href="index.html" class="sidebar-link${activePath('index.html')}">🏠 代谢篇首页</a>
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
        function openSidebar()  { sidebar.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
        function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; }
        if (hamburger) hamburger.addEventListener('click', openSidebar);
        if (overlay)   overlay.addEventListener('click', closeSidebar);
        if (closeBtn)  closeBtn.addEventListener('click', closeSidebar);
    });
})();
