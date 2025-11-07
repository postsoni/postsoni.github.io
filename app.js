// ===== グローバル変数 =====
let currentTab = 'top';

// ===== タブ切り替え機能 =====
function initTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // すべてのdata-tab属性を持つ要素にイベントを追加
    const allTabTriggers = document.querySelectorAll('[data-tab]');
    
    allTabTriggers.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            
            if (targetContent) {
                // すべてのタブとコンテンツの active を削除
                navItems.forEach(nav => nav.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // 対応するナビゲーションアイテムをアクティブに
                const correspondingNavItem = document.querySelector(`.nav-item[data-tab="${targetTab}"]`);
                if (correspondingNavItem) {
                    correspondingNavItem.classList.add('active');
                }
                
                // ターゲットのコンテンツをアクティブに
                targetContent.classList.add('active');
                currentTab = targetTab;
                
                // モバイルでスクロール
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        const contentArea = document.querySelector('.content-area');
                        if (contentArea) contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    });
}

// ===== FAQ機能 =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
}

// ===== 訪問者カウンター =====
async function initVisitorCounter() {
    const countElement = document.getElementById('visitorCount');
    const textElement = document.getElementById('visitorText');
    if (!countElement || !textElement) return;
    try {
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitorId', visitorId);
        }
        let visitorList = [];
        try {
            const result = await window.storage.get('visitor-list', true);
            if (result && result.value) visitorList = JSON.parse(result.value);
        } catch (error) {
            visitorList = [];
        }
        if (!visitorList.includes(visitorId)) {
            visitorList.push(visitorId);
            await window.storage.set('visitor-list', JSON.stringify(visitorList), true);
        }
        const count = visitorList.length;
        countElement.textContent = count;
        textElement.textContent = `あなたは${count}人目の訪問者です`;
    } catch (error) {
        console.error('訪問者カウンターエラー:', error);
        countElement.textContent = '---';
        textElement.textContent = 'カウント取得中...';
    }
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
        }, 500);
    });
}

function updateBreadcrumbEnhanced(tabId) {
    const breadcrumb = document.querySelector(`#${tabId} .breadcrumb`);
    if (!breadcrumb) return;
    const tabNames = {
        'top': 'TOP', 'news': '最新の活動報告', 'gallery': '活動ギャラリー',
        'roadmap': '初めての方へ', 'profile': 'プロフィール', 'sns': 'SNS',
        'activity': 'ブログアクセス', 'goods': 'グッズ', 'support': 'RC支援・サポート',
        'testimonials': 'サポートを受けた方の声', 'faq': 'よくある質問', 'contact': 'お問い合わせ'
    };
    const tabIcons = {
        'top': '🏠', 'news': '📰', 'gallery': '📸', 'roadmap': '🛤️',
        'profile': '👤', 'sns': '📱', 'activity': '📰', 'goods': '🛍️',
        'support': '🤝', 'testimonials': '🎉', 'faq': '❓', 'contact': '✉️'
    };
    if (tabId === 'top') {
        breadcrumb.innerHTML = `<span class="breadcrumb-item">${tabIcons[tabId]} ${tabNames[tabId]}</span>`;
    } else {
        breadcrumb.innerHTML = `
            <a href="#" class="breadcrumb-link" data-tab="top">${tabIcons['top']} ${tabNames['top']}</a>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-item">${tabIcons[tabId]} ${tabNames[tabId]}</span>
        `;
    }
}

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') document.body.classList.add('dark-mode');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    const animatedElements = document.querySelectorAll('.greeting-card, .card, .faq-item, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

async function initVisitorStats() {
    console.log('訪問者統計機能：準備完了');
}

function initSiteSearch() {
    const searchInput = document.getElementById('siteSearchInput');
    const searchBtn = document.getElementById('siteSearchBtn');
    const searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchBtn || !searchResults) return;
    const searchableContent = [
        { tab: 'top', title: 'TOP', keywords: ['ぽすとそに', '工房'] },
        { tab: 'faq', title: 'よくある質問', keywords: ['FAQ', '質問'] }
    ];
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) { searchResults.style.display = 'none'; return; }
        const results = searchableContent.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(query))
        );
        if (results.length > 0) {
            searchResults.innerHTML = results.map(result =>
                `<div class="search-result-item" data-tab="${result.tab}">📄 ${result.title}</div>`
            ).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="search-no-results">検索結果が見つかりませんでした</div>';
            searchResults.style.display = 'block';
        }
    }
    searchBtn.addEventListener('click', performSearch);
}

// ===== 完全な翻訳データ =====
const translations = {
    ja: {
        title: 'ぽすとそに工房',
        subtitle: 'RC技術と情熱の融合 - 次世代へ繋ぐラジコン文化',
        nav: {
            top: 'TOP', news: '最新の活動報告', gallery: '活動ギャラリー',
            roadmap: '初めての方へ', profile: 'プロフィール', sns: 'SNS',
            activity: 'ブログアクセス', goods: 'グッズ', support: 'RC支援・サポート',
            testimonials: 'サポートを受けた方の声', faq: 'よくある質問', contact: 'お問い合わせ'
        },
        sidebar: {
            searchTitle: 'サイト内検索',
            searchPlaceholder: 'FAQやブログ記事を検索',
            searchButton: '検索',
            tocTitle: '目次'
        },
        newsSection: {
            title: '最新の活動報告',
            comingSoon: 'Coming Soon...',
            workInProgress: 'ホームページの翻訳作業をしております。少々お待ちください。'
        },
        gallerySection: {
            title: '今までの活動ギャラリー',
            caption1: '平成初期の陸モノOSエンジンを分解清掃メンテで再始動可能を確認しました。',
            caption2: 'こちらは変速ギアがなめています',
            caption3: '変速ギアを交換し、走行チェック後変速タイミングの設定完了',
            caption4: '過去の動画でヘリが墜落した瞬間の切り抜き（私の機体で墜落した機体名はJRのE8です。なかなか今から見ると古くなってきた機体でパーツも少ないです。）',
            caption5: '現在発売されているヘリとMIXして、飛行可能状態にしております。詳しくはYouTubeの遊覧フライト動画にて閲覧可能です。',
            caption6: 'K110Sを分解清掃メンテを行い、マストの軸が見えないレベルでずれていることを確認。修理中の画像です。',
            caption7: '次世代のファンフライ機の制作です。作成の説明書は日本語ではありません、少々難しい図面でも作成しております。（バルサ機も同じように行えます。）',
            badgeBefore: '修理前',
            badgeAfter: '修理後',
            badgeCompleted: '修理完了',
            badgeCrashed: '墜落直後'
        },
        topSection: {
            title: 'ようこそ、ぽすとそに工房へ',
            greetingTitle: 'ぽすとそに ご挨拶',
            greeting: [
                'はじめまして。「ぽすとそに」と申します。2025年現在、33歳の男性であり、まだ若輩者ではございますが、AI技術を積極的に取り入れながら、ラジコン(以下、RC)の魅力と技術を広めていきたいと考えております。',
                '私は、心身ともにいくつかの制約を抱えながらも、それを理由に立ち止まるのではなく、AIという新たな可能性を通じて乗り越えようと日々取り組んでおります。',
                'RCという世界は、単なる「趣味」にとどまらず、機械と人の感覚が交わるリアルの領域だと感じています。人によっては便利さが進むほどに寂しさを覚える現代社会において、RCは手に取れる技術と体験が共存する、温かみのある文化だと思うのです。',
                '私は、このRCの魅力を次の世代へと繋ぐ一人の担い手でありたいと考えています。現代技術と人の情熱が交わる場所にこそ、次の時代に残す価値があると信じています。',
                '「ぽすとそに工房」では、私自身のRC活動の記録や試行錯誤の軌跡を発信しております。もしご興味をお持ちいただけましたら、ぜひ一度ご覧ください。そこには、懐かしさと近未来が共存する不思議な世界が広がっています。',
                'RCが持つ本来の楽しさと、その奥にある「人と技術の融合の美しさ」を、今後も発信し続けてまいります。'
            ],
            rcCollectionTitle: 'これは、ほすとそに自身が所有しているラジコンの一部です',
            imageCaption1: 'JR PROPO E8 を修理したりメンテナンスしていく うちにMIXされた他機種からの流用パーツがでんこ盛りになったヘリと、EPPの入門用高翼機たちです。',
            imageCaption2: 'INFERNO MP9 TKI3をベースにボディの塗装を変えて懐かしい色合いにした状態です。',
            imageCaption3: 'RC-Factory Super Extra Lの組み立て前真で、組み立て動画はYouTubeにあがっています。',
            galleryButtonText: '活動ギャラリーをもっとみる',
            statsTitle: '数字で見る分かりやすい活動記録',
            stat1Number: '18年', stat1Label: 'RC活動歴',
            stat2Number: '100+', stat2Label: '修理依頼により<br>直ったラジコンの数',
            stat3Number: '20社+', stat3Label: '対応メーカー',
            stat4Number: '2年間', stat4Label: 'サポート活動',
            monthlyTitle: '📅 今月の活動',
            monthlyUpdated: '2025年10月29日更新',
            monthlyRepairsTitle: '修理・改善されたラジコン',
            monthlyRepairsCount: '3台',
            monthlySupportedTitle: 'サポートした人数',
            monthlySupportedCount: '3名',
            monthlyNewModelTitle: '新作機体',
            monthlyNewModelDetail: 'RC-Factory Super Extra Lの作成',
            monthlyNewsTitle: '新着その他情報',
            monthlyNewsDetail: 'Heli-Xのシミュレーター調整、RealFlight Evolutionの新機体導入とモデル設定',
            ctaContact: 'ご相談はこちらから'
        }
    },
    en: {
        title: 'Postsoni Workshop',
        subtitle: 'RC Technology & Passion',
        nav: {
            top: 'TOP', news: 'Latest Updates', gallery: 'Gallery',
            roadmap: 'For Beginners', profile: 'Profile', sns: 'SNS',
            activity: 'Blog', goods: 'Goods', support: 'Support',
            testimonials: 'Testimonials', faq: 'FAQ', contact: 'Contact'
        },
        sidebar: {
            searchTitle: 'Site Search',
            searchPlaceholder: 'Search FAQ or blog articles',
            searchButton: 'Search',
            tocTitle: 'Table of Contents'
        },
        newsSection: {
            title: 'Latest Updates',
            comingSoon: 'Coming Soon...',
            workInProgress: 'We are working on translating the website. Please wait a moment.'
        },
        gallerySection: {
            title: 'Activity Gallery',
            caption1: 'Confirmed restart of early Heisei era land OS engine after disassembly, cleaning and maintenance.',
            caption2: 'This gear is worn out',
            caption3: 'Replaced the transmission gear, completed gear timing settings after running check',
            caption4: 'Frame from past video of helicopter crash (My crashed aircraft is JR E8. It\'s becoming quite old now with few parts available.)',
            caption5: 'Mixed with currently available helicopters to make it flight-ready. Details available in YouTube flight videos.',
            caption6: 'Disassembled and cleaned K110S, confirmed mast shaft misalignment at invisible level. Photo during repair.',
            caption7: 'Building next-generation fun fly aircraft. Instructions are not in Japanese, but we can build even with difficult diagrams. (Same process for balsa aircraft.)',
            badgeBefore: 'Before Repair',
            badgeAfter: 'After Repair',
            badgeCompleted: 'Repair Complete',
            badgeCrashed: 'Just Crashed'
        },
        topSection: {
            title: 'Welcome to Postsoni Workshop',
            greetingTitle: 'About Postsoni',
            greeting: [
                'Hello, I am Postsoni. As of 2025, I am a 33-year-old male, and although I am still young, I am actively incorporating AI technology to spread the appeal and techniques of Radio Control (RC).',
                'Despite facing some physical and mental challenges, I do not let them stop me. Instead, I strive to overcome them through the new possibilities that AI offers.',
                'The world of RC is not just a "hobby" but a realm where machines and human senses intersect in reality. In today\'s society, where convenience can sometimes lead to loneliness, RC represents a warm culture where tangible technology and experience coexist.',
                'I want to be someone who passes on the charm of RC to the next generation. I believe that where modern technology and human passion meet, there is value worth preserving for future times.',
                'At "Postsoni Workshop," I share records of my own RC activities and trials. If you are interested, please take a look. There, you will find a mysterious world where nostalgia and the near future coexist.',
                'I will continue to communicate the original joy of RC and the "beauty of the fusion of people and technology" that lies within.'
            ],
            rcCollectionTitle: 'This is part of my RC collection',
            imageCaption1: 'Helicopter with mixed parts from repairs of JR PROPO E8, and EPP entry-level high-wing aircraft.',
            imageCaption2: 'INFERNO MP9 TKI3 base with nostalgic color paint.',
            imageCaption3: 'RC-Factory Super Extra L pre-assembly, video on YouTube.',
            galleryButtonText: 'View More Gallery',
            statsTitle: 'Activity Record at a Glance',
            stat1Number: '18 Years', stat1Label: 'RC Experience',
            stat2Number: '100+', stat2Label: 'RCs Repaired',
            stat3Number: '20+', stat3Label: 'Manufacturers',
            stat4Number: '2 Years', stat4Label: 'Support Activity',
            monthlyTitle: '📅 This Month',
            monthlyUpdated: 'Updated Oct 29, 2025',
            monthlyRepairsTitle: 'RCs Repaired',
            monthlyRepairsCount: '3 units',
            monthlySupportedTitle: 'People Supported',
            monthlySupportedCount: '3 people',
            monthlyNewModelTitle: 'New Model',
            monthlyNewModelDetail: 'RC-Factory Super Extra L build',
            monthlyNewsTitle: 'Latest Updates',
            monthlyNewsDetail: 'Heli-X simulator adjustments, RealFlight Evolution new aircraft introduction and model settings',
            ctaContact: 'Contact for Consultation'
        }
    },
    zh: {
        title: 'Postsoni工作室',
        subtitle: 'RC技术与热情的融合',
        nav: {
            top: '首页', news: '最新活动', gallery: '画廊',
            roadmap: '新手指南', profile: '简介', sns: '社交媒体',
            activity: '博客', goods: '商品', support: '支援',
            testimonials: '评价', faq: '常见问题', contact: '联系我们'
        },
        sidebar: {
            searchTitle: '站内搜索',
            searchPlaceholder: '搜索FAQ或博客文章',
            searchButton: '搜索',
            tocTitle: '目录'
        },
        newsSection: {
            title: '最新活动报告',
            comingSoon: '即将推出...',
            workInProgress: '我们正在翻译网站。请稍候。'
        },
        gallerySection: {
            title: '活动画廊',
            caption1: '确认了平成初期陆地OS发动机经过拆解清洁维护后可重新启动。',
            caption2: '这个变速齿轮已磨损',
            caption3: '更换变速齿轮，行驶检查后完成变速时机设定',
            caption4: '过去视频中直升机坠落瞬间的截图（我坠落的机体是JR的E8。现在看来已经相当老旧，零件也很少。）',
            caption5: '与现在销售的直升机混合使用，使其处于可飞行状态。详情请参阅YouTube的飞行视频。',
            caption6: '对K110S进行拆解清洁维护，确认桅杆轴在不可见程度上偏移。维修中的照片。',
            caption7: '下一代趣味飞行机的制作。制作说明书不是日语，即使是较难的图纸也在制作中。（桐木机也可以同样制作。）',
            badgeBefore: '维修前',
            badgeAfter: '维修后',
            badgeCompleted: '维修完成',
            badgeCrashed: '刚坠落'
        },
        topSection: {
            title: '欢迎来到Postsoni工作室',
            greetingTitle: 'Postsoni 问候',
            greeting: [
                '初次见面。我叫"Postsoni"。截至2025年，我是一名33岁的男性，虽然还很年轻，但我正在积极采用AI技术，希望传播遥控（以下简称RC）的魅力和技术。',
                '我虽然在身心上面临一些限制，但我不会因此停滞不前，而是通过AI这种新的可能性来克服它们。',
                'RC的世界不仅仅是一种"爱好"，而是机械与人的感知交汇的真实领域。在现代社会中，便利性的提升有时会让人感到孤独，而RC则是一种可以触摸到技术与体验共存的温暖文化。',
                '我希望成为将RC的魅力传递给下一代的人。我相信，在现代技术与人类热情交汇的地方，存在着值得留给未来时代的价值。',
                '在"Postsoni工作室"中，我分享了自己的RC活动记录和尝试的轨迹。如果您感兴趣，请务必来看看。那里有一个怀旧与未来共存的奇妙世界。',
                'RC所拥有的原始乐趣以及其中蕴含的"人与技术融合的美"，我将继续传播下去。'
            ],
            rcCollectionTitle: '这是我个人拥有的部分RC收藏',
            imageCaption1: '在修理JR PROPO E8过程中混合使用其他型号零件的直升机，以及EPP入门级高翼机。',
            imageCaption2: '以INFERNO MP9 TKI3为基础，改变车身涂装为怀旧色彩。',
            imageCaption3: 'RC-Factory Super Extra L的组装前照片，视频可在YouTube观看。',
            galleryButtonText: '查看更多画廊',
            statsTitle: '一目了然的活动记录',
            stat1Number: '18年', stat1Label: 'RC经验',
            stat2Number: '100+', stat2Label: '修好的RC',
            stat3Number: '20社+', stat3Label: '支持的制造商',
            stat4Number: '2年', stat4Label: '支持活动',
            monthlyTitle: '📅 本月活动',
            monthlyUpdated: '2025年10月29日更新',
            monthlyRepairsTitle: '维修的RC',
            monthlyRepairsCount: '3台',
            monthlySupportedTitle: '支持的人数',
            monthlySupportedCount: '3名',
            monthlyNewModelTitle: '新机型',
            monthlyNewModelDetail: 'RC-Factory Super Extra L的制作',
            monthlyNewsTitle: '最新更新',
            monthlyNewsDetail: 'Heli-X模拟器调整、RealFlight Evolution新机体导入和模型设定',
            ctaContact: '点击此处咨询'
        }
    }
};

// ===== 多言語切り替え機能 =====
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'ja';
    setLanguage(currentLang);
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) btn.classList.add('active');
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
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
            const icon = navItem.textContent.split(' ')[0];
            navItem.textContent = icon + ' ' + trans.nav[key];
        }
    });
    
    // サイドバー - サイト内検索
    const searchTitle = document.querySelector('.search-title');
    const searchInput = document.getElementById('siteSearchInput');
    const searchBtn = document.getElementById('siteSearchBtn');
    if (searchTitle) searchTitle.textContent = '🔍 ' + trans.sidebar.searchTitle;
    if (searchInput) searchInput.placeholder = trans.sidebar.searchPlaceholder;
    if (searchBtn) searchBtn.textContent = trans.sidebar.searchButton;
    
    // サイドバー - 目次タイトル
    const tocTitle = document.querySelector('.nav-title');
    if (tocTitle) tocTitle.textContent = '📌 ' + trans.sidebar.tocTitle;
    
    // 最新の活動報告セクション
    const newsTitle = document.querySelector('#news .section-title');
    const newsComingSoon = document.querySelector('#news .coming-soon-title');
    const newsText = document.querySelector('#news .coming-soon-text');
    if (newsTitle) newsTitle.textContent = '📰 ' + trans.newsSection.title;
    if (newsComingSoon) newsComingSoon.textContent = trans.newsSection.comingSoon;
    if (newsText) newsText.textContent = trans.newsSection.workInProgress;
    
    // 活動ギャラリーセクション
    const galleryTitle = document.querySelector('#gallery .section-title');
    if (galleryTitle) galleryTitle.textContent = '📸 ' + trans.gallerySection.title;
    
    // 活動ギャラリー - 画像キャプション
    const galleryCaptions = document.querySelectorAll('#gallery .gallery-caption');
    if (galleryCaptions[0]) galleryCaptions[0].textContent = trans.gallerySection.caption1;
    if (galleryCaptions[1]) galleryCaptions[1].textContent = trans.gallerySection.caption2;
    if (galleryCaptions[2]) galleryCaptions[2].textContent = trans.gallerySection.caption3;
    if (galleryCaptions[3]) galleryCaptions[3].textContent = trans.gallerySection.caption4;
    if (galleryCaptions[4]) galleryCaptions[4].textContent = trans.gallerySection.caption5;
    if (galleryCaptions[5]) galleryCaptions[5].textContent = trans.gallerySection.caption6;
    if (galleryCaptions[6]) galleryCaptions[6].textContent = trans.gallerySection.caption7;
    
    // 活動ギャラリー - バッジ
    const galleryBadges = document.querySelectorAll('#gallery .related-badge');
    galleryBadges.forEach(badge => {
        const text = badge.textContent.trim();
        if (text === '修理前') badge.textContent = trans.gallerySection.badgeBefore;
        else if (text === '修理後' || text === 'After Repair' || text === '维修后') badge.textContent = trans.gallerySection.badgeAfter;
        else if (text === '修理完了' || text === 'Repair Complete' || text === '维修完成') badge.textContent = trans.gallerySection.badgeCompleted;
        else if (text === '墜落直後' || text === 'Just Crashed' || text === '刚坠落') badge.textContent = trans.gallerySection.badgeCrashed;
    });
    
    // TOPセクション - タイトル
    const topTitle = document.querySelector('#top .section-title');
    if (topTitle) topTitle.textContent = '🏠 ' + trans.topSection.title;
    
    // TOPセクション - 挨拶タイトル
    const greetingTitle = document.querySelector('.greeting-title');
    if (greetingTitle) greetingTitle.textContent = trans.topSection.greetingTitle;
    
    // TOPセクション - 挨拶文（6段落）
    const greetingPs = document.querySelectorAll('.greeting-content p');
    if (trans.topSection.greeting && greetingPs.length >= 6) {
        trans.topSection.greeting.forEach((text, index) => {
            if (greetingPs[index]) greetingPs[index].textContent = text;
        });
    }
    
    // 最終段落（closing）
    const greetingClosing = document.querySelector('.greeting-closing');
    if (greetingClosing && trans.topSection.greeting[5]) {
        greetingClosing.textContent = trans.topSection.greeting[5];
    }
    
    // TOPセクション - RCコレクションタイトル
    const visualIntro = document.querySelector('.visual-intro');
    if (visualIntro) visualIntro.textContent = trans.topSection.rcCollectionTitle;
    
    // TOPセクション - 画像キャプション
    const visualCaptions = document.querySelectorAll('.visual-caption');
    if (visualCaptions[0]) visualCaptions[0].textContent = trans.topSection.imageCaption1;
    if (visualCaptions[1]) visualCaptions[1].textContent = trans.topSection.imageCaption2;
    if (visualCaptions[2]) visualCaptions[2].textContent = trans.topSection.imageCaption3;
    
    // TOPセクション - ギャラリーボタン
    const galleryBtn = document.querySelector('.gallery-link-button');
    if (galleryBtn) galleryBtn.textContent = trans.topSection.galleryButtonText + ' →';
    
    // TOPセクション - 統計タイトル
    const statsTitle = document.querySelector('.stats-title');
    if (statsTitle) statsTitle.textContent = trans.topSection.statsTitle;
    
    // TOPセクション - 統計数値とラベル
    const statNumbers = document.querySelectorAll('.stat-number');
    const statLabels = document.querySelectorAll('.stat-label');
    if (statNumbers[0]) statNumbers[0].textContent = trans.topSection.stat1Number;
    if (statLabels[0]) statLabels[0].innerHTML = trans.topSection.stat1Label;
    if (statNumbers[1]) statNumbers[1].textContent = trans.topSection.stat2Number;
    if (statLabels[1]) statLabels[1].innerHTML = trans.topSection.stat2Label;
    if (statNumbers[2]) statNumbers[2].textContent = trans.topSection.stat3Number;
    if (statLabels[2]) statLabels[2].innerHTML = trans.topSection.stat3Label;
    if (statNumbers[3]) statNumbers[3].textContent = trans.topSection.stat4Number;
    if (statLabels[3]) statLabels[3].innerHTML = trans.topSection.stat4Label;
    
    // TOPセクション - 今月の活動
    const reportTitle = document.querySelector('.report-title');
    const reportDate = document.querySelector('.report-date');
    if (reportTitle) reportTitle.textContent = trans.topSection.monthlyTitle;
    if (reportDate) reportDate.textContent = trans.topSection.monthlyUpdated;
    
    // TOPセクション - 今月の活動項目
    const reportTitles = document.querySelectorAll('.report-content h4');
    if (reportTitles[0]) reportTitles[0].textContent = trans.topSection.monthlyRepairsTitle;
    if (reportTitles[1]) reportTitles[1].textContent = trans.topSection.monthlySupportedTitle;
    if (reportTitles[2]) reportTitles[2].textContent = trans.topSection.monthlyNewModelTitle;
    if (reportTitles[3]) reportTitles[3].textContent = trans.topSection.monthlyNewsTitle;
    
    // TOPセクション - 今月の活動数値と詳細
    const reportNumbers = document.querySelectorAll('.report-number');
    const reportDetails = document.querySelectorAll('.report-detail');
    if (reportNumbers[0]) reportNumbers[0].textContent = trans.topSection.monthlyRepairsCount;
    if (reportNumbers[1]) reportNumbers[1].textContent = trans.topSection.monthlySupportedCount;
    if (reportDetails[0]) reportDetails[0].textContent = trans.topSection.monthlyNewModelDetail;
    if (reportDetails[1]) reportDetails[1].textContent = trans.topSection.monthlyNewsDetail;
    
    // TOPセクション - CTAボタン
    const ctaBtn = document.querySelector('.cta-primary');
    if (ctaBtn) ctaBtn.textContent = '👉 ' + trans.topSection.ctaContact;
}

function initPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker登録成功'))
            .catch(err => console.log('Service Worker登録失敗:', err));
    }
}

// ===== お問い合わせフォームを開く関数 =====
function openContactForm() {
    // contact.htmlを新しいタブで開く
    window.open('contact.html', '_blank');
}

// グローバルに公開
window.openContactForm = openContactForm;

// ===== ページ読み込み時の初期化 =====
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFAQ();
    initVisitorCounter();
    initBackToTop();
    initLoadingScreen();
    initDarkMode();
    initScrollAnimations();
    initVisitorStats();
    initSiteSearch();
    initLanguageSwitcher();
    initPWA();
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            updateBreadcrumbEnhanced(targetTab);
        });
    });
});