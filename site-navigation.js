/* 求学少年 · 学科页辅助导航
   提供网站首页、当前科目首页、刷题入口和学习路径切换。 */
(function () {
  'use strict';

  if (document.documentElement.dataset.siteNavigationBound === '1') return;
  document.documentElement.dataset.siteNavigationBound = '1';

  const page = location.pathname.split('/').pop() || 'index.html';
  const pathParts = decodeURIComponent(location.pathname).split('/').filter(Boolean);
  const folder = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : '';
  const learningPath = [
    { folder: '解剖学网页', name: '解剖学', next: '生理学网页', nextName: '生理学' },
    { folder: '生理学网页', name: '生理学', next: '病理学网页', nextName: '病理学' },
    { folder: '病理学网页', name: '病理学', next: '药理学网页', nextName: '药理学' },
    { folder: '药理学网页', name: '药理学', next: '心血管网页', nextName: '心血管系统' },
    { folder: '心血管网页', name: '心血管系统', next: '脑血管网页', nextName: '脑血管系统' },
    { folder: '脑血管网页', name: '脑血管系统', next: '呼吸网页', nextName: '呼吸系统' },
    { folder: '呼吸网页', name: '呼吸系统', next: '消化网页', nextName: '消化系统' },
    { folder: '消化网页', name: '消化系统', next: '代谢网页', nextName: '代谢系统' },
    { folder: '代谢网页', name: '代谢系统', next: '体检报告网页', nextName: '体检报告' },
    { folder: '体检报告网页', name: '体检报告', next: '身体说明书网页', nextName: '身体说明书' },
    { folder: '身体说明书网页', name: '身体说明书', next: '解剖学网页', nextName: '解剖学' }
  ];
  const currentSubject = learningPath.find(item => item.folder === folder);

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
      .subject-home-bottom-nav { max-width: 1120px; margin: 0 auto; padding: 0 1.5rem 2.4rem; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .85rem; }
      .subject-home-bottom-link { min-height: 58px; display: flex; align-items: center; justify-content: space-between; gap: .75rem; padding: .8rem 1rem; border: 1px solid rgba(71, 85, 105, .72); border-radius: 13px; background: rgba(30, 41, 59, .72); color: #cbd5e1 !important; text-decoration: none; box-shadow: 0 7px 18px rgba(2, 6, 23, .16); transition: transform .18s ease, border-color .18s ease, background .18s ease; }
      .subject-home-bottom-link:hover { transform: translateY(-2px); border-color: rgba(125, 211, 252, .55); background: rgba(37, 52, 74, .94); color: #f8fafc !important; }
      .subject-home-bottom-link.is-next { background: linear-gradient(135deg, rgba(14, 116, 144, .28), rgba(30, 41, 59, .82)); border-color: rgba(56, 189, 248, .38); color: #e0f2fe !important; }
      .subject-home-bottom-link.is-next:hover { background: linear-gradient(135deg, rgba(14, 116, 144, .4), rgba(37, 52, 74, .96)); border-color: rgba(125, 211, 252, .68); }
      .subject-home-bottom-label { display: flex; flex-direction: column; gap: .14rem; min-width: 0; }
      .subject-home-bottom-kicker { color: #64748b; font-size: .7rem; letter-spacing: .04em; }
      .subject-home-bottom-title { font-size: .92rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .subject-home-bottom-arrow { flex: 0 0 auto; font-size: 1.15rem; color: #7dd3fc; }
      .site-footer.subject-footer { margin-top: 2.25rem !important; padding: 1.2rem 1rem !important; text-align: center; }
      .subject-footer p { margin: 0 !important; }
      .subject-footer-title { font-size: .9rem; font-weight: 700; line-height: 1.45; }
      .subject-footer-note { margin-top: .3rem !important; font-size: .78rem; line-height: 1.5; opacity: .74; }
      @media (max-width: 560px) { .subject-home-bottom-nav { grid-template-columns: 1fr; padding: 0 1rem 2rem; gap: .65rem; } .subject-home-bottom-link { min-height: 52px; } }
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

  function normalizeFooter() {
    const footer = document.querySelector('footer.site-footer, footer');
    if (!currentSubject || !footer) return;

    footer.classList.add('site-footer', 'subject-footer');
    footer.innerHTML = `
      <p class="subject-footer-title">${currentSubject.name}</p>
      <p class="subject-footer-note">内容仅供健康教育参考，不替代医疗诊断与建议。</p>`;
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

  function addSubjectHomeBottomNav() {
    if (page !== 'index.html' || document.querySelector('.subject-home-bottom-nav')) return;

    const footer = document.querySelector('footer');
    if (!currentSubject || !footer || !footer.parentNode) return;

    const nav = document.createElement('nav');
    nav.className = 'subject-home-bottom-nav';
    nav.setAttribute('aria-label', '学习路径导航');
    nav.innerHTML = `
      <a class="subject-home-bottom-link" href="../index.html">
        <span class="subject-home-bottom-arrow" aria-hidden="true">←</span>
        <span class="subject-home-bottom-label">
          <span class="subject-home-bottom-kicker">返回上一级</span>
          <span class="subject-home-bottom-title">返回网站首页</span>
        </span>
      </a>
      <a class="subject-home-bottom-link is-next" href="../${currentSubject.next}/index.html">
        <span class="subject-home-bottom-label">
          <span class="subject-home-bottom-kicker">下一阶段</span>
          <span class="subject-home-bottom-title">学习${currentSubject.nextName}</span>
        </span>
        <span class="subject-home-bottom-arrow" aria-hidden="true">→</span>
      </a>`;
    footer.parentNode.insertBefore(nav, footer);
  }

  addStyles();
  enhanceTopNavigation();
  enhanceSidebar();
  enhanceFloatingHome();
  normalizeFooter();
  addQuizShortcut();
  addSubjectHomeBottomNav();
})();
