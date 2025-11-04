// ===== 訪問者カウンター（Persistent Storage使用） =====
async function initVisitorCounter() {
    try {
        // ユニークな訪問者IDを生成または取得（ブラウザごとに固有）
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitorId', visitorId);
        }
        
        // 総訪問者数を取得
        let totalVisitors = 0;
        let visitorsList = [];
        
        try {
            // 訪問者リストを取得
            const result = await window.storage.get('visitors_list', true);
            if (result && result.value) {
                visitorsList = JSON.parse(result.value);
                totalVisitors = visitorsList.length;
            }
        } catch (error) {
            console.log('初回カウンター作成');
            visitorsList = [];
            totalVisitors = 0;
        }
        
        // このvisitorIdが既に訪問済みかチェック
        const hasVisited = visitorsList.includes(visitorId);
        
        // 初回訪問の場合のみカウントアップ
        if (!hasVisited) {
            visitorsList.push(visitorId);
            totalVisitors = visitorsList.length;
            
            // 永続ストレージに保存（shared: true で全ユーザーで共有）
            await window.storage.set('visitors_list', JSON.stringify(visitorsList), true);
            
            console.log('新規訪問者を記録しました。総訪問者数:', totalVisitors);
        } else {
            console.log('既存の訪問者です。総訪問者数:', totalVisitors);
        }
        
        // カウンターに表示
        const counterElement = document.getElementById('visitorCount');
        const counterText = document.getElementById('visitorText');
        
        if (counterElement && counterText) {
            // アニメーション付きでカウントアップ
            animateCounter(counterElement, 0, totalVisitors, 1000);
            counterText.textContent = 'あなたは今までで ' + totalVisitors.toLocaleString() + ' 人目の訪問者です';
        }
        
    } catch (error) {
        console.error('カウンターエラー:', error);
        // エラー時はローカルストレージにフォールバック
        fallbackCounter();
    }
}

// フォールバック用カウンター（window.storageが使えない場合）
function fallbackCounter() {
    let visitorCount = localStorage.getItem('fallbackVisitorCount');
    
    if (!visitorCount) {
        visitorCount = 1;
    } else {
        visitorCount = parseInt(visitorCount);
    }
    
    localStorage.setItem('fallbackVisitorCount', visitorCount);
    
    const counterElement = document.getElementById('visitorCount');
    const counterText = document.getElementById('visitorText');
    
    if (counterElement && counterText) {
        animateCounter(counterElement, 0, visitorCount, 1000);
        counterText.textContent = 'あなたは今までで ' + visitorCount.toLocaleString() + ' 人目の訪問者です';
    }
}

// カウンターアニメーション
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== ページ読み込み時の初期化 =====
document.addEventListener('DOMContentLoaded', () => {
    // タブ切り替え機能初期化
    initTabs();
    
    // FAQ アコーディオン機能初期化
    initFAQ();
    
    // 訪問者カウンター初期化
    initVisitorCounter();
});

// お問い合わせフォームを開く
function openContactForm() {
    window.open('contact.html', '_blank', 'width=700,height=800');
}


// ===== タブ切り替え機能 =====
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // タブ切り替えの共通処理（PC・スマホ共通）
    function switchTab(targetTab) {
        // 全てのナビゲーションアイテムから active クラスを削除
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // 対応するナビゲーションアイテムに active クラスを追加
        navItems.forEach(nav => {
            if (nav.getAttribute('data-tab') === targetTab) {
                nav.classList.add('active');
            }
        });
        
        // 全てのタブコンテンツから active クラスを削除
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 対応するタブコンテンツに active クラスを追加
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // コンテンツエリアを最上部にスクロール
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.scrollTop = 0;
            }
            
            // スマホの場合、コンテンツエリアの先頭までスクロール
            if (window.innerWidth <= 768) {
                // 少し待ってからスクロール（コンテンツの描画を待つ）
                setTimeout(() => {
                    const contentArea = document.querySelector('.content-area');
                    if (contentArea) {
                        // コンテンツエリアの位置を取得
                        const contentRect = contentArea.getBoundingClientRect();
                        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                        
                        // コンテンツエリアの上端までスクロール
                        window.scrollTo({
                            top: currentScroll + contentRect.top,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        }
    }
    
    // ナビゲーションアイテムのクリックイベント
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // data-tab属性を持つすべてのリンク/ボタンに対応
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-tab]');
        if (target && !target.classList.contains('nav-item')) {
            e.preventDefault();
            const targetTab = target.getAttribute('data-tab');
            switchTab(targetTab);
        }
    });
}


// ===== FAQ アコーディオン機能 =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 既に開いている場合は閉じる
            const isActive = item.classList.contains('active');
            
            // 全てのFAQを閉じる
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // クリックされたFAQが閉じていた場合は開く
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}


// ===== ページトップへ戻るボタン =====
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // スクロール時の表示/非表示
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // クリック時の動作
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ===== ローディング画面 =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    });
}


// ===== ダークモード切り替え =====
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (!darkModeToggle) return;
    
    // ローカルストレージから設定を読み込み
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    // クリック時の動作
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // 設定を保存
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}


// ===== スムーズスクロール効果の強化 =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.content-section, .gallery-item, .roadmap-step, .testimonial-item, .faq-item');
    animateElements.forEach(el => observer.observe(el));
}


// ===== 訪問者統計の可視化 =====
async function initVisitorStats() {
    try {
        // 訪問者リストを取得
        const result = await window.storage.get('visitors_list', true);
        if (result && result.value) {
            const visitorsList = JSON.parse(result.value);
            const totalVisitors = visitorsList.length;
            
            // 統計情報を保存
            const stats = {
                total: totalVisitors,
                lastUpdated: new Date().toISOString()
            };
            
            console.log('訪問者統計:', stats);
        }
    } catch (error) {
        console.log('統計情報の取得エラー:', error);
    }
}


// ===== パンくずリスト更新 =====
function updateBreadcrumb(sectionName) {
    // 将来的にパンくずリストを実装する場合の準備
    console.log('現在のセクション:', sectionName);
}


// ===== ページ読み込み時の初期化（更新版） =====
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化
    initTabs();
    initFAQ();
    initVisitorCounter();
    
    // 新機能の初期化
    initBackToTop();
    initLoadingScreen();
    initDarkMode();
    initScrollAnimations();
    initVisitorStats();
});


// ===== サイト内検索機能 =====
function initSiteSearch() {
    const searchInput = document.getElementById('siteSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchBtn || !searchResults) return;
    
    // 検索対象のコンテンツを収集
    function getSearchableContent() {
        const content = [];
        
        // FAQを収集
        document.querySelectorAll('.faq-item').forEach((item, index) => {
            const question = item.querySelector('.faq-question h3')?.textContent || '';
            const answer = item.querySelector('.faq-answer p')?.textContent || '';
            content.push({
                type: 'FAQ',
                title: question,
                content: answer,
                section: 'faq',
                id: index
            });
        });
        
        // 初心者向けロードマップを収集
        document.querySelectorAll('.roadmap-step').forEach((item, index) => {
            const title = item.querySelector('.step-title')?.textContent || '';
            const contentText = item.querySelector('.step-content')?.textContent || '';
            content.push({
                type: 'ガイド',
                title: title,
                content: contentText,
                section: 'roadmap',
                id: index
            });
        });
        
        // お客様の声を収集
        document.querySelectorAll('.testimonial-item').forEach((item, index) => {
            const name = item.querySelector('.testimonial-name')?.textContent || '';
            const contentText = item.querySelector('.testimonial-content')?.textContent || '';
            content.push({
                type: '体験談',
                title: name,
                content: contentText,
                section: 'testimonials',
                id: index
            });
        });
        
        return content;
    }
    
    // 検索実行
    function performSearch(query) {
        if (!query || query.trim().length < 2) {
            searchResults.innerHTML = '<p class="search-no-results">2文字以上で検索してください</p>';
            return;
        }
        
        const searchableContent = getSearchableContent();
        const results = searchableContent.filter(item => {
            return item.title.toLowerCase().includes(query.toLowerCase()) ||
                   item.content.toLowerCase().includes(query.toLowerCase());
        });
        
        displaySearchResults(results, query);
    }
    
    // 検索結果を表示
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="search-no-results">「' + query + '」に一致する結果が見つかりませんでした</p>';
            return;
        }
        
        let html = '';
        results.slice(0, 5).forEach(result => {
            const excerpt = result.content.substring(0, 80) + '...';
            html += `
                <div class="search-result-item" onclick="navigateToResult('${result.section}')">
                    <div class="search-result-title">${result.type}: ${result.title}</div>
                    <div class="search-result-excerpt">${excerpt}</div>
                </div>
            `;
        });
        
        searchResults.innerHTML = html;
    }
    
    // 検索結果をクリック
    window.navigateToResult = function(sectionId) {
        const navItem = document.querySelector(`[data-tab="${sectionId}"]`);
        if (navItem) {
            navItem.click();
            searchResults.innerHTML = '';
            searchInput.value = '';
        }
    };
    
    // 検索ボタンクリック
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // Enterキーで検索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // リアルタイム検索（入力中）
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchInput.value.trim().length >= 2) {
                performSearch(searchInput.value);
            } else {
                searchResults.innerHTML = '';
            }
        }, 300);
    });
}


// ===== パンくずリスト更新機能の改善 =====
function updateBreadcrumbEnhanced(sectionId) {
    const sectionNames = {
        'top': 'TOP',
        'gallery': '活動ギャラリー',
        'roadmap': '初めての方へ',
        'profile': 'プロフィール',
        'sns': 'SNS',
        'activity': '活動記録',
        'goods': 'グッズ',
        'support': 'RC支援・サポート',
        'testimonials': 'サポートを受けた方の声',
        'faq': 'よくある質問',
        'contact': 'お問い合わせ'
    };
    
    const sectionName = sectionNames[sectionId] || sectionId;
    console.log('現在のページ:', sectionName);
    
    // ページタイトルも更新
    document.title = sectionName + ' - ぽすとそに工房';
}


// ===== ページ読み込み時の初期化（最終版） =====
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化
    initTabs();
    initFAQ();
    initVisitorCounter();
    
    // 新機能の初期化
    initBackToTop();
    initLoadingScreen();
    initDarkMode();
    initScrollAnimations();
    initVisitorStats();
    
    // 残り3つの機能初期化
    initSiteSearch();
    
    // タブ切り替え時にパンくずリスト更新
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            updateBreadcrumbEnhanced(targetTab);
        });
    });
});


// ===== 多言語対応 =====
const translations = {
    ja: {
        title: 'ぽすとそに工房',
        subtitle: 'RC技術と情熱の融合 - 次世代へ繋ぐラジコン文化',
        nav: {
            top: 'TOP',
            news: '最新の活動報告',
            gallery: '活動ギャラリー',
            roadmap: '初めての方へ',
            profile: 'プロフィール',
            sns: 'SNS',
            activity: '活動記録',
            goods: 'グッズ',
            support: 'RC支援・サポート',
            testimonials: 'サポートを受けた方の声',
            faq: 'よくある質問',
            contact: 'お問い合わせ'
        }
    },
    en: {
        title: 'Postsoni Workshop',
        subtitle: 'RC Technology & Passion - Connecting RC Culture to the Next Generation',
        nav: {
            top: 'TOP',
            news: 'Latest Updates',
            gallery: 'Activity Gallery',
            roadmap: 'For Beginners',
            profile: 'Profile',
            sns: 'SNS',
            activity: 'Activity Log',
            goods: 'Goods',
            support: 'RC Support',
            testimonials: 'Testimonials',
            faq: 'FAQ',
            contact: 'Contact'
        }
    },
    zh: {
        title: 'Postsoni工作室',
        subtitle: 'RC技术与热情的融合 - 将RC文化传承给下一代',
        nav: {
            top: '首页',
            news: '最新活动报告',
            gallery: '活动画廊',
            roadmap: '新手指南',
            profile: '简介',
            sns: '社交媒体',
            activity: '活动记录',
            goods: '商品',
            support: 'RC支援',
            testimonials: '用户评价',
            faq: '常见问题',
            contact: '联系我们'
        }
    }
};

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'ja';
    
    // 初期言語を設定
    setLanguage(currentLang);
    
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // ボタンのアクティブ状態を更新
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 言語を変更
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
}

function setLanguage(lang) {
    const trans = translations[lang];
    if (!trans) return;
    
    // タイトルとサブタイトル
    const mainTitle = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    if (mainTitle) mainTitle.textContent = trans.title;
    if (subtitle) subtitle.textContent = trans.subtitle;
    
    // ナビゲーション
    Object.keys(trans.nav).forEach(key => {
        const navItem = document.querySelector(`[data-tab="${key}"]`);
        if (navItem) {
            const icon = navItem.textContent.split(' ')[0]; // アイコンを保持
            navItem.textContent = icon + ' ' + trans.nav[key];
        }
    });
    
    // ページタイトル
    document.title = trans.title + ' | RC Support & Repair';
}


// ===== PWA対応 =====
function initPWA() {
    // Service Worker登録
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/postori-site/sw.js')
                .then(registration => {
                    console.log('Service Worker登録成功:', registration);
                })
                .catch(error => {
                    console.log('Service Worker登録失敗:', error);
                });
        });
    }
    
    // インストールプロンプト
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // インストールバナーを表示（任意）
        showInstallBanner();
    });
    
    function showInstallBanner() {
        // すでにインストール済みかチェック
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }
        
        // バナーを作成して表示
        const banner = document.createElement('div');
        banner.className = 'pwa-install-banner show';
        banner.innerHTML = `
            <div class="pwa-banner-content">
                <div class="pwa-banner-title">📱 ホーム画面に追加</div>
                <div class="pwa-banner-text">オフラインでも閲覧できます</div>
            </div>
            <div class="pwa-banner-buttons">
                <button class="pwa-install-btn" id="pwaInstallBtn">インストール</button>
                <button class="pwa-close-btn" id="pwaCloseBtn">閉じる</button>
            </div>
        `;
        document.body.appendChild(banner);
        
        // インストールボタン
        document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('インストール:', outcome);
                deferredPrompt = null;
                banner.remove();
            }
        });
        
        // 閉じるボタン
        document.getElementById('pwaCloseBtn').addEventListener('click', () => {
            banner.remove();
        });
    }
}


// ===== ページ読み込み時の初期化（最終版） =====
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化
    initTabs();
    initFAQ();
    initVisitorCounter();
    initBackToTop();
    initLoadingScreen();
    initDarkMode();
    initScrollAnimations();
    initVisitorStats();
    initSiteSearch();
    
    // 新機能の初期化
    initLanguageSwitcher();
    initPWA();
    
    // タブ切り替え時にパンくずリスト更新
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            updateBreadcrumbEnhanced(targetTab);
        });
    });
});
