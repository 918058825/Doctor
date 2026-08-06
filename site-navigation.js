/* 求学少年 · 学科页辅助导航
   只提供网站首页、当前科目首页和刷题入口；不提供跨学科切换。 */
(function () {
  'use strict';

  if (document.documentElement.dataset.siteNavigationBound === '1') return;
  document.documentElement.dataset.siteNavigationBound = '1';

  const page = location.pathname.split('/').pop() || 'index.html';

  function getSubjectName() {
    const logo = document.querySelector('.top-nav .logo');
    const text = logo ? logo.textContent.trim() : '';
    return text.replace(/^[^\u4e00-\u9fa5]*/, '').trim() || '本科目';
  }

  function addStyles() {
    if (document.getElementById('_site_navigation_styles')) return;
    const style = document.createElement('style');
    style.id = '_site_navigation_styles';
    style.textContent = `
      .nav-quiz-link { white-space: nowrap; }
      .home-section-header.has-subject-quiz-shortcut { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between; gap: .75rem; margin: .35rem 0 .7rem !important; padding: .58rem .72rem !important; border: 1px solid rgba(125, 211, 252, .28) !important; border-radius: 12px; background: rgba(15, 35, 58, .58); }
      .home-section-header.has-subject-quiz-shortcut h2 { flex: 1; min-width: 0; margin: 0 !important; padding: 0 !important; border: 0 !important; border-radius: 0 !important; background: none !important; box-shadow: none !important; color: #f1f5f9 !important; font-size: clamp(1.05rem, 4.4vw, 1.28rem) !important; white-space: nowrap; }
      .subject-quiz-shortcut { display: inline-flex; flex: 0 0 auto; align-items: center; gap: .3rem; margin: 0; padding: .42rem .68rem; border: 1px solid rgba(125, 211, 252, .34); border-radius: 9px; background: rgba(56, 189, 248, .14); color: #dff4ff !important; text-decoration: none; font-size: .78rem; font-weight: 700; line-height: 1.2; white-space: nowrap; transition: transform .18s ease, background .18s ease; }
      .subject-quiz-shortcut:hover { background: rgba(56, 189, 248, .2); transform: translateY(-1px); }
      .index-hero .subject-quiz-shortcut { margin-top: 1rem; padding: .58rem .9rem; border-radius: 10px; }
      @media (max-width: 430px) { .home-section-header.has-subject-quiz-shortcut { gap: .45rem; padding: .52rem .56rem !important; } .home-section-header.has-subject-quiz-shortcut h2 { font-size: 1rem !important; } .subject-quiz-shortcut { padding: .4rem .5rem; font-size: .73rem; } }
    `;
    document.head.appendChild(style);
  }

  function enhanceTopNavigation() {
    const navList = document.querySelector('.top-nav .nav-links');
    if (!navList || navList.dataset.siteEnhanced === '1') return;
    navList.dataset.siteEnhanced = '1';

    const portal = navList.querySelector('.nav-portal-link');
    if (portal && portal.parentElement) portal.parentElement.remove();

    Array.from(navList.children).forEach(item => {
      const home = item.querySelector('a[href="index.html"]');
      if (home && !home.classList.contains('nav-dropdown-toggle')) {
        home.href = '../index.html';
        home.textContent = '🏠 网站首页';
        home.classList.add('nav-site-home-link');
      }
    });

    if (!navList.querySelector('.nav-quiz-link')) {
      const quizItem = document.createElement('li');
      quizItem.innerHTML = `<a href="quiz.html" class="nav-quiz-link${page === 'quiz.html' ? ' active' : ''}">🧪 本课刷题</a>`;
      const siteHome = navList.querySelector('.nav-site-home-link');
      navList.insertBefore(quizItem, siteHome ? siteHome.parentElement : null);
    }
  }

  function enhanceSidebar() {
    const sidebarBody = document.querySelector('.nav-sidebar .sidebar-body');
    if (!sidebarBody || sidebarBody.dataset.siteEnhanced === '1') return;
    sidebarBody.dataset.siteEnhanced = '1';

    const portal = sidebarBody.querySelector('.sidebar-portal-link');
    if (portal) {
      portal.href = '../index.html';
      portal.textContent = '🏠 网站首页';
      portal.classList.remove('sidebar-portal-link');
      portal.classList.add('sidebar-site-home-link');
    }

    const currentSubjectHome = Array.from(sidebarBody.querySelectorAll('a.sidebar-link[href="index.html"]'))[0];
    if (currentSubjectHome) currentSubjectHome.textContent = `📖 ${getSubjectName()}首页`;

    if (!sidebarBody.querySelector('.sidebar-quiz-link')) {
      const quizLink = document.createElement('a');
      quizLink.href = 'quiz.html';
      quizLink.className = `sidebar-link sidebar-quiz-link${page === 'quiz.html' ? ' active' : ''}`;
      quizLink.textContent = '🧪 进入本课刷题';
      const firstSection = sidebarBody.querySelector('.sidebar-section');
      sidebarBody.insertBefore(quizLink, firstSection || null);
    }
  }

  function enhanceFloatingHome() {
    document.querySelectorAll('.fab-home').forEach(button => {
      button.href = '../index.html';
      button.title = '返回网站首页';
      button.setAttribute('aria-label', '返回网站首页');
      button.innerHTML = '🏠';
    });
  }

  function addQuizShortcut() {
    if (page !== 'index.html') return;
    const target = document.querySelector('.page-hero, .index-hero, .home-section-header') || document.querySelector('.main-content, main');
    if (!target || target.querySelector('.subject-quiz-shortcut')) return;
    const shortcut = document.createElement('a');
    shortcut.href = 'quiz.html';
    shortcut.className = 'subject-quiz-shortcut';
    shortcut.innerHTML = '🧪 进入本课刷题 <span aria-hidden="true">→</span>';
    target.classList.add('has-subject-quiz-shortcut');
    target.appendChild(shortcut);
  }

  addStyles();
  enhanceTopNavigation();
  enhanceSidebar();
  enhanceFloatingHome();
  addQuizShortcut();
})();
