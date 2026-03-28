// 药理学入门 — 导航脚本

const pharmacologyNav = {
  brand: { text: '💊 药理学入门', href: 'index.html' },
  groups: [
    {
      label: '基础药理',
      pages: [
        { href: 'chapter1.html', label: '第1章 · 药物与受体' },
        { href: 'chapter2.html', label: '第2章 · 药动学 ADME' },
        { href: 'chapter3.html', label: '第3章 · 药效学·治疗窗' },
        { href: 'chapter4.html', label: '第4章 · 不良反应与耐药' },
      ]
    },
    {
      label: '系统药理·循环呼消',
      pages: [
        { href: 'chapter5.html', label: '第5章 · 心血管药物' },
        { href: 'chapter6.html', label: '第6章 · 呼吸系统药物' },
        { href: 'chapter7.html', label: '第7章 · 消化系统药物' },
        { href: 'chapter8.html', label: '第8章 · 镇痛与麻醉药' },
      ]
    },
    {
      label: '系统药理·神内抗菌',
      pages: [
        { href: 'chapter9.html',  label: '第9章 · 中枢神经系统药物' },
        { href: 'chapter10.html', label: '第10章 · 内分泌系统药物' },
        { href: 'chapter11.html', label: '第11章 · 抗菌药物' },
        { href: 'chapter12.html', label: '第12章 · 抗肿瘤药物' },
      ]
    },
    {
      label: '🛠️ 工具页',
      pages: [
        { href: 'drug-index.html',        label: '💊 药物快查索引' },
        { href: 'receptor-map.html',      label: '🎯 受体靶点图谱' },
        { href: 'interaction-guide.html', label: '⚠️ 相互作用速查' },
      ]
    }
  ]
};

function buildNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navInner = document.querySelector('.top-nav-inner');
  if (!navInner) return;

  // 注入门户链接样式
  if (!document.getElementById('_nps')) {
    const _s = document.createElement('style');
    _s.id = '_nps';
    _s.textContent = '.nav-portal-link{padding:.25em .65em;border-radius:5px;border:1px solid rgba(255,255,255,.2);font-size:.8em;opacity:.75;margin-left:.3rem;transition:opacity .15s,background .15s;color:inherit;text-decoration:none;display:inline-block}.nav-portal-link:hover{opacity:1;background:rgba(255,255,255,.08)}.mobile-nav-portal{display:block;padding:.55em 1em;font-size:.83em;opacity:.65;border-bottom:1px dashed rgba(255,255,255,.15);margin-bottom:.4em;color:inherit;text-decoration:none}';
    document.head.appendChild(_s);
  }

  // Brand
  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  brand.href = pharmacologyNav.brand.href;
  brand.textContent = pharmacologyNav.brand.text;
  navInner.appendChild(brand);

  // Desktop menu
  const menu = document.createElement('div');
  menu.className = 'nav-menu';

  pharmacologyNav.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'nav-group';

    const isActiveGroup = group.pages.some(p => p.href === currentPage);
    const btn = document.createElement('button');
    btn.className = 'nav-group-btn' + (isActiveGroup ? ' active' : '');
    btn.innerHTML = group.label + ' <span style="font-size:0.62rem;opacity:0.65">▼</span>';
    groupDiv.appendChild(btn);

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-dropdown';
    group.pages.forEach(page => {
      const a = document.createElement('a');
      a.href = page.href;
      a.textContent = page.label;
      if (page.href === currentPage) a.className = 'current';
      dropdown.appendChild(a);
    });
    groupDiv.appendChild(dropdown);
    menu.appendChild(groupDiv);
  });

  navInner.appendChild(menu);

  // 总目录链接（返回门户首页）
  const portalLink = document.createElement('a');
  portalLink.href = '../index.html';
  portalLink.className = 'nav-portal-link';
  portalLink.textContent = '🏠 总目录';
  navInner.appendChild(portalLink);

  // Hamburger
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = '☰';
  hamburger.setAttribute('aria-label', '菜单');
  navInner.appendChild(hamburger);

  // Mobile nav
  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';

  // 移动端总目录链接
  const mobilePortal = document.createElement('a');
  mobilePortal.href = '../index.html';
  mobilePortal.className = 'mobile-nav-portal';
  mobilePortal.textContent = '🏠 返回总目录';
  mobileNav.appendChild(mobilePortal);

  pharmacologyNav.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'mobile-nav-group';

    const title = document.createElement('div');
    title.className = 'mobile-nav-group-title';
    title.textContent = group.label;
    groupDiv.appendChild(title);

    group.pages.forEach(page => {
      const a = document.createElement('a');
      a.href = page.href;
      a.textContent = page.label;
      if (page.href === currentPage) a.className = 'current';
      groupDiv.appendChild(a);
    });
    mobileNav.appendChild(groupDiv);
  });

  // Insert mobile nav after top-nav
  const topNav = document.querySelector('.top-nav');
  if (topNav && topNav.parentNode) {
    topNav.parentNode.insertBefore(mobileNav, topNav.nextSibling);
  }

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.innerHTML = mobileNav.classList.contains('open') ? '✕' : '☰';
  });

  buildTOC();
}

function buildTOC() {
  const tocContainer = document.querySelector('.sidebar-toc');
  if (!tocContainer) return;

  const headings = document.querySelectorAll('.section-card h2');
  headings.forEach(h => {
    if (!h.id) {
      h.id = 'section-' + Math.random().toString(36).substr(2, 6);
    }
    const a = document.createElement('a');
    a.href = '#' + h.id;
    // Strip emoji for TOC display
    a.textContent = h.textContent.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\s]+/gu, '').trim();
    tocContainer.appendChild(a);
  });

  // Scroll spy
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = tocContainer.querySelector(`a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        tocContainer.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -75% 0px' });

  headings.forEach(h => observer.observe(h));
}

document.addEventListener('DOMContentLoaded', buildNav);
