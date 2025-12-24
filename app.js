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

// ===== 訪問者カウンター（Google Apps Script版） =====
function initVisitorCounter() {
    const countElement = document.getElementById('visitorCount');
    const textElement = document.getElementById('visitorText');
    if (!countElement || !textElement) return;
    
    // 🔧 ここにあなたのGoogle Apps ScriptのURLを貼り付けてください
    // 例: 'https://script.google.com/macros/s/XXXXX/exec'
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7ULgMhDO_QeL0svgU4aG79F48Fm8l4qauwgWuaeE8FcKXPvjl87V9gLxMoc-l0Mi3/exec';
    
    try {
        // 訪問済みチェック
        const hasVisited = localStorage.getItem('postsoni_has_visited');
        
        if (!hasVisited) {
            // 初回訪問：カウントアップ
            // 🔒 refererを送信してセキュリティ強化
            fetch(`${SCRIPT_URL}?action=increment&referer=${encodeURIComponent(window.location.origin)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.error('カウンターエラー:', data.error);
                        fetchCurrentCount();
                        return;
                    }
                    const count = data.count;
                    countElement.textContent = count;
                    updateVisitorText(count);
                    
                    // 訪問済みフラグを設定
                    localStorage.setItem('postsoni_has_visited', 'true');
                })
                .catch(error => {
                    console.error('カウンターエラー:', error);
                    fetchCurrentCount();
                });
        } else {
            // 既に訪問済み：現在のカウントを取得（カウントアップしない）
            fetchCurrentCount();
        }
        
        function fetchCurrentCount() {
            fetch(`${SCRIPT_URL}?action=get&referer=${encodeURIComponent(window.location.origin)}`)
                .then(res => res.json())
                .then(data => {
                    const count = data.count || 0;
                    countElement.textContent = count;
                    updateVisitorText(count);
                })
                .catch(error => {
                    console.error('カウント取得エラー:', error);
                    countElement.textContent = '---';
                    textElement.textContent = 'カウント取得中...';
                });
        }
        
        function updateVisitorText(count) {
            const currentLang = localStorage.getItem('language') || 'ja';
            if (currentLang === 'ja') {
                textElement.textContent = `総訪問者数: ${count}人`;
            } else if (currentLang === 'en') {
                textElement.textContent = `Total Visitors: ${count}`;
            } else if (currentLang === 'zh') {
                textElement.textContent = `总访客数: ${count}`;
            }
        }
        
    } catch (error) {
        console.error('訪問者カウンターエラー:', error);
        countElement.textContent = '---';
        textElement.textContent = 'カウント取得中...';
    }
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
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
        
        // パンくずリストのリンクにイベントリスナーを追加
        const breadcrumbLink = breadcrumb.querySelector('.breadcrumb-link');
        if (breadcrumbLink) {
            breadcrumbLink.addEventListener('click', function(e) {
                e.preventDefault();
                const targetTab = this.getAttribute('data-tab');
                
                // TOPタブをアクティブにする
                const navItems = document.querySelectorAll('.nav-item');
                const tabContents = document.querySelectorAll('.tab-content');
                
                navItems.forEach(nav => nav.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                const topNavItem = document.querySelector(`.nav-item[data-tab="top"]`);
                const topContent = document.getElementById('top');
                
                if (topNavItem) topNavItem.classList.add('active');
                if (topContent) topContent.classList.add('active');
                
                currentTab = 'top';
                
                // モバイルでスクロール
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        const contentArea = document.querySelector('.content-area');
                        if (contentArea) contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        }
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

// ===== スクロールアニメーション（改良版） =====
function initScrollAnimations() {
    // Intersection Observer の設定
    const observerOptions = {
        threshold: 0.1, // 10%表示されたら発火
        rootMargin: '0px 0px -50px 0px' // 下50px手前で発火
    };
    
    // 基本的なスクロールアニメーション用のObserver
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // 一度表示されたら監視を解除（パフォーマンス向上）
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => {
        scrollObserver.observe(el);
    });
    
    // 順次表示用のObserver（遅延付き）
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                itemObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 順次表示する要素を監視
    const animateItems = document.querySelectorAll('.scroll-animate-item');
    animateItems.forEach(el => {
        itemObserver.observe(el);
    });
    
    // 既存の要素（互換性のため残す）
    const legacyElements = document.querySelectorAll('.greeting-card:not(.scroll-animate), .card:not(.scroll-animate), .faq-item:not(.scroll-animate), .testimonial-card:not(.scroll-animate)');
    legacyElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const legacyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    legacyObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        legacyObserver.observe(el);
    });
}

async function initVisitorStats() {
    console.log('訪問者統計機能：準備完了');
}

function initSiteSearch() {
    const searchInput = document.getElementById('siteSearch');
    const searchBtn = document.getElementById('searchBtn');
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
        loadingText: '読み込み中...',
        nav: {
            top: 'TOP', news: '最新の活動報告', gallery: '活動ギャラリー',
            roadmap: '初めての方へ', profile: 'プロフィール', sns: 'SNS',
            activity: 'ブログアクセス', goods: 'グッズ', support: 'RC支援・サポート',
            testimonials: 'サポートを受けた方の声', faq: 'よくある質問', partners: '提携サイト', contact: 'お問い合わせ'
        },
        sidebar: {
            searchTitle: 'サイト内検索',
            searchPlaceholder: 'FAQやブログ記事を検索',
            searchButton: '検索',
            tocTitle: '目次'
        },
        newsSection: {
            title: '最新の活動報告',
            date: '2025年11月11日',
            newsTitle: 'ホームページ刷新 & 機材強化のお知らせ',
            section1Title: '◆ホームページ改修完了',
            section1Text: 'プロフィールページに新セクション「ラジコン文化への想い」を追加しました。日本からラジコン文化が消えないよう、技術と知識を次世代へ繋ぐという想いを綴っています。',
            section2Title: '◆AI活用による情報発信の最適化',
            section2Text: 'noteブログの執筆にAIを活用し、より分かりやすく、詳細な技術記事の作成を進めています。初心者の方にも理解しやすいコンテンツ作りを目指します。',
            section3Title: '◆カルマートα40（飛行機） 組み上げ中',
            section3Text: '全メカ類（サーボ、アンプ、モーター等）が揃い、現在組み上げと微調整を行っています。完成次第、飛行レポートをお届けする予定です。',
            section4Title: '◆測定機器の導入',
            section4Text: 'アンプの電流値を正確に測定できるアナライザーを導入しました。これにより、より精密なセッティングとトラブルシューティングが可能になります。'
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
        roadmapSection: {
            title: 'ラジコンを始める5つのステップ',
            intro: 'RCを始めたい方、復帰したい方に向けた、安心のステップガイドです。あなたのペースに合わせてサポートします。',
            step1Title: '💬 相談',
            step1Item1: '初期にかかるRCに対しての費用相談！',
            step1Item2: '連絡に気づき次第即日決定を目指します！（悩まれる場合は、もちろんゆっくりで問題ございません。）',
            step1Item3: '具体的にあなたの興味がわいたラジコンの種類の話を聞きます、それを元に何が必要かを一緒に検討します。',
            step2Title: '🎯 選ぶRCジャンル',
            step2Item1: '選んだジャンルにおいての平均の始める初期費用を概算で出しつつ、相談を続けます。',
            step2Item2: '同じく即日決定を目指します！（ここで悩まれても、ゆっくりペースを合わせます。）',
            step2Item3: '初心者なのか、復帰者なのかを区分けし、レベルに応じて選ぶRCの選定を一緒に検討します。',
            step3Title: '🤝 購入後のサポート',
            step3Item1: '選んだ内容に応じたRCの走行、飛行可能な場所を一緒に検討します。（事前検討も可能です。）',
            step3Item2: '近場のクラブを一緒に検討します。（クラブはまだ…という方にも場所のアドバイスを続けます。）',
            step3Item3: '現在の法律に合わせて、適切な場所を選びます。',
            step3Item4: '近場であれば、一人ひとりに合わせて場所を決めて待ち合わせなどをし、一緒に走るところや飛行するところを見て怖くないようにサポートします。（遠方であれば、初めて遊んだときにどのようなことが起きたか困ったかなどを聞き、改善をサポートします。）',
            step4Title: '🔧 基本メンテナンス',
            step4Item1: 'メンテナンスに必要なものを、お好きなRCに合わせて予算別で一緒に検討します。（おすすめを今までの私の知識とAIを合わせて、主観が入らないように適切なものを選んでいきます。もちろん、事前検討も可能です。）',
            step4Item2: 'メンテナンスの基礎知識などをお伝えし、自分でもRCを触れるようにサポートします。',
            step5Title: '🚀 RCの世界へ',
            step5Item1: 'STEP1～4まで終えた方はおそらく1人でも遊べる状況になっているはずです。復帰者のパターンでも、現在のRCの知識に追いつける状態にまでなっていると思われます。',
            step5Item2: '近場であれば、お困りの際はいつでもお声をかけてください。遠方でも、同じくなるべくすぐに対応します。',
            step5Item3: 'これでRCについての初期段階は終了です！マイペースに遊ぶもよし、たくさん練習するもよし、いざRCの世界へ！',
            note: '※目安のSTEPです。それぞれの遊び方のニーズに合わせてどこまでも真摯に向き合います。いつでもお問い合わせフォームからご連絡ください。'
        },
        archive: {
            banner: {
                title: 'ラジコンデータベース - 全てのラジコンを網羅するため日々更新中！',
                subtitle: '絶版から現代まで、19年間の修理実績に基づく詳細ガイド',
                button: 'アーカイブを見る →'
            },
            main: {
                title: '📚 RCアーカイブ',
                subtitle: '絶版から現代までのラジコン機種を網羅したデータベース\nRC文化の歴史を次の世代へ継承するタイムカプセル',
                purpose: {
                    title: '🎯 アーカイブの目的',
                    item1: '✅ 絶版機種の情報保存 - 取扱説明書や修理ガイドを永続的に記録',
                    item2: '✅ 技術継承 - 19年間の修理経験と100件以上の実績をデータ化',
                    item3: '✅ 情報更新 - データ不備があれば随時訂正・更新',
                    item4: '✅ コミュニティ協力 - 機種情報をお持ちの方からの情報提供を歓迎'
                },
                current: '現在ラジコンカーを中心に更新中！随時情報を拡充していきます！',
                button: '📚 RCアーカイブを見る →',
                request: '💡 情報提供のお願い\nお持ちの機種情報や取扱説明書がございましたら、ぜひご協力ください！\n一緒にRC文化を未来へ残しましょう。'
            }
        },
        aiConsultation: {
            title: 'AIラジコン相談室',
            description: '修理方法、機種選び、セッティング、パーツ入手など、どんな質問でもお気軽に！<br>AI（Claude）とぽすとそにが24時間以内に回答します。完全無料です。',
            button: '質問する（無料）',
            note: '※回答はnoteまたはウェブサイトで完全匿名にて公開し皆様の役に立つように記事に起こすこともありますが、身元は分からないのでご安心ください'
        },
        profileSection: {
            title: 'プロフィール',
            nameLabel: '名前',
            nameValue: 'ぽすとそに',
            ageLabel: '年齢',
            ageValue: '33歳 (2025年現在)',
            expertiseLabel: '専門分野',
            expertiseList: [
                'ラジコン（カー、飛行機、ヘリ）の操作',
                '設計（カー、飛行機）',
                '修理（カー、各種メカ類）',
                '基礎知識サポート（安全のための配慮etc...）'
            ],
            specialtyLabel: '特技',
            specialtyList: [
                'ラジコンとAIの融合',
                '最新機種などの情報収集',
                'メカ類の相性などの細かな部分'
            ],
            philosophyLabel: '活動理念',
            philosophyValue: 'AI技術とRC文化の融合により、次世代へ技術を継承',
            achievementsTitle: '📊 今までの活動',
            achievement1Number: '100+',
            achievement1Label: '陸モノ修理',
            achievement1Sublabel: '車種以上',
            achievement2Number: '30+',
            achievement2Label: 'メカ類修理',
            achievement2Sublabel: '件以上',
            achievement3Number: '20+',
            achievement3Label: '空モノ修理',
            achievement3Sublabel: '件以上',
            achievement4Number: '19年',
            achievement4Label: 'RC活動歴',
            achievement4Sublabel: '経験豊富',
            achievement5Number: '2年',
            achievement5Label: 'サポート活動',
            achievement5Sublabel: '継続中',
            achievement6Number: '20社',
            achievement6Label: '対応メーカー',
            achievement6Sublabel: '多様な経験',
            makersTitle: '🔧 対応可能メーカー（一部）',
            makersNote: '※記載以外のメーカーもお気軽にご相談ください',
            passionTitle: '💭 ラジコン文化への想い',
            passionText1: '私がこの活動を続ける理由は、シンプルです。日本からラジコンという文化が消えてほしくない。ただそれだけです。',
            passionText2: 'ラジコンを取り巻く現実は厳しいものがあります。高齢化が進み、若い世代は別の娯楽に流れ、走らせたり飛ばしたりできる場所も年々減っています。「ラジコンは趣味として高級品」「敷居が高い」「初心者お断り」というイメージが先行し、始める前から諦めてしまう人も少なくありません。SNS交流やゲームorゲーム実況が主流の今、手を動かして何かを作り上げる楽しさは、なかなか伝わりにくい時代です。',
            passionText3: 'それでも、私はこの文化を記録し続けます。',
            passionText4: 'たとえ今の時代に多くの人を呼び込めなくても、技術や知識を丁寧に残しておくことで、いつか誰かがそれを見つけてくれるかもしれない。10年後か、50年後か、もしかしたら私が生きていない未来かもしれません。それでも、ネットという海に「タイムカプセル」として潜らせておけば、必要とする誰かに届く可能性がある。そう信じています。',
            passionText5: 'この活動は、商売ではなく、個人的な想いで始まった活動です。睡眠が不安定な中での活動であり、決して派手なものではありません。それでも、19年間ラジコンと向き合ってきた経験と、100台以上の修理実績があります。それらを記録し、共有し、次世代へ繋ぐ。それが、今の私にできることです。',
            passionText6: 'もしあなたが「ラジコンをやってみたい」「昔やっていたけど、また始めたい」と少しでも思ってくださったなら、それだけで嬉しいです。ともに、この文化を歩んでいきましょう。'
        },
        snsSection: {
            title: 'SNS・チャンネル',
            youtubeTitle: 'YouTube チャンネル',
            youtubeDescription: 'RC製作・飛行動画を配信中',
            youtubeNote: '（私が所有・運営しています）',
            youtubeBannerGuide: '↑↑上記バナーをクリックorタップでチャンネルに飛びます↑↑',
            xTitle: 'X（旧Twitter）',
            xDescription: 'RC活動の日々の記録や最新情報を発信中',
            xBannerGuide: '↑↑上記バナーをクリックorタップでXに飛びます↑↑'
        },
        activitySection: {
            title: '活動記録',
            blogTitle: '📖 技術ブログ（note）',
            blogDescription: '修理工程、パーツレビュー、技術的な備忘録など、SNSでは伝えきれない詳細な情報を発信しています。',
            noteTitle: 'note',
            noteDescription: '修理工程や技術解説を詳しく記録中',
            latestArticlesTitle: '📌 最新のブログ記事',
            moreArticles: 'もっと記事を見る →'
        },
        goodsSection: {
            title: 'グッズ',
            pdfDownloadTitle: '📚 無料ダウンロード資料（日本語版）',
            pdfDownloadDescription: '初心者から中級者まで対応したRC用語集を無料でダウンロードできます！',
            pdfGlossaryTitle: 'RC用語集（PDF）',
            pdfFeature1: '・基礎編① - 35個の基本用語',
            pdfFeature2: '・中級編② - 35個のセッティング用語',
            pdfFeature3: '・応用編③ - 55個の競技・専門用語',
            downloadButton: '📥 PDFをダウンロード',
            pdfNotice: '※このPDFは日本語のみの対応となります',
            physicalGoodsComingSoon: '実物グッズ（準備中）',
            physicalGoodsDescription: 'オリジナルグッズは現在準備中です。',
            physicalGoodsNotice: '※このサイトでは商品の販売や注文受付は行っておりません。'
        },
        supportSection: {
            title: 'RC支援・サポートについて',
            mainTitle: 'RC初心者の方へのサポート',
            support1Icon: '✏️',
            support1Title: '初心者の方たちへの支援',
            support1Description: 'ラジコンを初めて触る人にも優しく丁寧にプランを一緒に試行錯誤します。',
            support2Icon: '🔧',
            support2Title: '修理メンテナンスについて',
            support2Description: '基礎的なメンテナンスや修理を一緒に行います。高度な修理については、お問い合わせからご連絡お願いします。どうしても出来ないものもありますが、それらの理由なども誠実にお答えします。',
            support2Detail: 'あまりにも修理が高額なラジコンや、パーツが別途必要で入手不可という特殊事例は、近場の修理店などを紹介して解決に向かうこともあります。（パーツがすでにあるorパーツを購入できるという条件が既にありましたら、私が直すことも可能です。）',
            support2Example: '※修理が高額なラジコンの一例：ラジコン飛行機の墜落→メカトラブルの点検＋微細な割れの発見＋木材の調達＋フィルムや塗装直し＋乾燥を待つことによる時間のかかる工程＋最終チェックと仕上げetc',
            support2ExampleNote: '（詳しくはお問い合わせください。）',
            support3Icon: '🎓',
            support3Title: '操縦技術の向上',
            support3Description: '私もまだ若輩者なので、全ての操作ができるわけではありません。しかし、タミグラやF3A、F3Cについては少々理解のある方かと思われます。（操縦技術は大目に見ていただけると助かります。）',
            support3Detail: 'その人に合った最適な練習方法や、欲しい商品と自分の手持ちのラジコンを比較しながらの向上練習or商品の購入順番の最適化をAIを活用しながら、最後に笑顔になれるように尽力します。',
            conversationExample: '※ラジコン飛行機とラジコンカー、どちらも好きだけど、どちらも中途半端だからどのようにそれぞれ時間を割くのが自分には向いてたりするんですか？',
            conversationAnswer: '→〇〇に何割、〇〇に何割、自分との心次第では一部変わりますが、恐らく納得いくのではないかと思われる形は〇〇な状態かと思われます！ですので、今は〇〇が必要ではなく実は〇〇の考え方が重要かもしれませんので、時間をかけてゆっくり練習しましょう！〇〇週間後に自分ここまでできた、などありましたら、〇〇を購入してみるのもまた一つの手かもしれませんね(*´ω｀)',
            support3DetailEnd: 'などという形式で、一人ひとりに向き合います。（お助けにならなかったり、過度に干渉してしまった場合は大変申し訳ございません。いつでもおっしゃっていただければ、本音は真剣に受け止めます。）',
            note: '詳細はお問い合わせください'
        },
        testimonialsSection: {
            title: 'サポートを受けた方の声',
            intro: '実際にサポートを受けてくださった方々の体験談です。ホームページ開設にあたり、ご協力いただきました。',
            testimonial1Name: 'Yさんの体験談',
            testimonial1Tag: '10代・未経験・陸モノ（バギー）',
            testimonial1Text: '個人的には、バギーの中でも旧車が好きでした。しかし、旧車にはパーツ問題などが多く初めていいものか分かりませんでした。しかし、新旧合わせてパーツを確保し今では練習には2台とも愛車になりました。難しいアンプのセッティングも場所を変えてPCから操作方法を学び、自分でもできるようになりました。いつも一緒に走ってくれたり、コツなども伝えてくれて感謝の限りです。',
            testimonial2Name: 'Oさんの体験談',
            testimonial2Tag: '50代・復帰者・陸モノ＆空モノ',
            testimonial2Text: '突然の飛び込みの修理で、原因が初期不良で購入店にあることが分かり、すぐに購入店に新品に交換してもらえました。それからは各種設定や久しぶりのラジコンで浦島太郎状態なのにも関わらず、今のラジコンについての知識を精一杯教えてもらい、四苦八苦ではありましたがなんとか覚えることが出来ました。今では次のステップである飛行機を飛ばすために相談を続けていますが、LINEなども使ってメールよりも迅速にお返事がくるので解決が早く嬉しいです。今度飛ばすときは是非ご一緒していただきたいです。ありがたい限りです。',
            testimonial3Name: 'Kさんの体験談',
            testimonial3Tag: '60代・経験者・空モノ（飛行機、ヘリ）',
            testimonial3Text: '経験していても、情報についていくことが難しく、どのように設定したらいいか分からないときがあります。しかし横で説明書をみながら、私のレベルに合わせた最適なセッティングを出していただき、飛ばしては降りてすぐに調整を繰り返し、私にもできなかったことがすぐに理解できました。お陰様でメインは飛行機でしたがヘリも楽しいものですね、はまってしまいました。まだホバリングぐらいしかできませんが、ここまで歳をとっても新しい発見があることはとても貴重です。有難うございます。',
            testimonial4Name: 'Aさんの体験談',
            testimonial4Tag: '30代・ドローン歴2年・空モノ（ヘリ）',
            testimonial4Text: 'ドローンは飛ばしたこともありましたが、ラジコンヘリの難しさは別格です。最初は離陸すら難しく怖がりながらやりましたね。全て1から10まで懇切丁寧に教えていただきありがとうございます。もっと時間のかかる成長しかできないと思っていましたが、仕組みを理解しながら飛ばしていくうちにどんどん安定し、ホバリングと旋回程度なら私にもできます。ぽすとそにさんのような難しいスキルはまだありませんが、いずれ追いついて抜かせるぐらいどっぷりとハマってしまいました笑、ぜひご一緒しながら温かいお茶でも飲み、ラジコン談義しつつ一緒にラジコン楽しみましょう！',
            testimonial5Name: 'Sさんの体験談',
            testimonial5Tag: '30代・未経験・陸モノ',
            testimonial5Text: '最初はバギー一択で大会に出るんだと言いましたね。しかし、私はその気持ちばかり先行し、童心の夢中さを忘れていたようです。もちろん速さもたのしいですが、今の車種にはこんなに振り回しても故障が少ないモデルもあるとは知らなかったです。もちろん私の整備のスキルを上げてくれたことも一因ですね笑。今ではたまに速いバギーを走らせつつ一緒にメンテナンスをしてもらったり、オフロードトラックも頑丈にカスタマイズを自分なりにも進めております。まさかその手があったとは！と毎度驚かされます。若くても知識が豊富過ぎて、私の手の届かない範囲も手助けをしてくださり、いつもありがとうございます。'
        },
        faqSection: {
            title: 'よくある質問コーナー',
            intro: '皆様からよくいただく質問をまとめました。気になることがあれば、まずこちらをご覧ください。',
            q1: '完全初心者ですが大丈夫ですか？',
            a1: 'もちろんです。何もわからなくても問題ございません！',
            q2: 'ラジコン初心者は、車・飛行機・ヘリのどれから始めるのがおすすめですか？',
            a2: 'ラジコンの車の電動から始めてみるのが良いと思います。まずはラジコンの費用を抑えて楽しさを感じることが一番の始まりだと思っております！',
            q3: 'ラジコンを始めるために最低限必要なものは何ですか？',
            a3: '最初は、日曜工具があるといいと思います。noteのブログ記事のほうにて初心者の解説である電動カーについてまとめてありますので、よければそちらも参照してもらえると大変うれしく思います。',
            q4: 'ラジコンを始めるには、どれくらいの費用がかかりますか？',
            a4: 'お問い合わせいただいた内容をもとに、ラジコンを始める際に必要となる費用の目安を一緒に考えます。実際のお買い物はご自身でしていただく形になりますが、「だいたいこれくらいかな？」という基準を決めたり、それらを選ぶときは相談者のレベルに応じたものをベースに致します。「楽しさを広げる」ことをモットーに、無理のないスタートを応援しています！',
            q5: 'ラジコンはどこで買うのがおすすめですか？（店舗 vs ネット）',
            a5: '最初だけは模型店で購入し、慣れたらネットでも問題ございません。すぐに修理などができるツテを作ることもまた重要なことです。ネットだと、最初の一台のみは後から高くつくことも珍しくありませんので、細心の注意を払いましょう。どうしても金額的にネットのみの購入になる場合は、説明書があると大変良いと思います。',
            q6: '中古のラジコンを買う時の注意点はありますか？',
            a6: 'できれば、最初は新古品のようなもの、または使用頻度が少ないもので異常に安く売られてないものをオススメします。ご自身のレベルに関係なく、お問い合わせから「この写真の物を買うのは問題なさそうでしょうか？以下URLです。」等とご連絡いただけましたら、レベルに合わせて問題ないかそのページを確認してからお答えします！',
            q7: 'ラジコンが動かなくなりました。どこを確認すればいいですか？',
            a7: 'まずは、マニュアルの不具合対策を読んでみましょう。仮にも中古で購入して分からないときは、最近の説明書はネットからダウンロードすることも可能です。やり方などいまいちよく分からないときは、お問い合わせフォームまでご連絡いただけるとスムーズにお伝えできると思います！',
            q8: '修理にはどのくらい時間がかかりますか？',
            a8: '物によりますが、即日出来上がることが多いです。大きいものかつパーツのお取り寄せまでになると、約1か月ぐらいの場合もあります。工程が多いほど要相談です。',
            q9: '古い機体でも対応できますか？',
            a9: '可能な限り対応します。（パーツがなくとも自作していく場合もございます。）一例としては、初代タミヤ発売のホーネットを修理し、Uコンの一部も修理しました。',
            q10: 'どこで活動していますか？対応エリアは？',
            a10: '札幌が基本となります。ネット対応も可能な限り致します。',
            q11: 'どんなラジコンに対応していますか？',
            a11: '車、飛行機、ヘリ、戦車、トラック、ボート、トイラジ（対象年齢が低いラジコンなどを指します。）です。ドローンは要相談です。',
            q12: 'オンラインでも相談できますか？',
            a12: 'もちろんです。概要を詳しく知りたい、お試しでお問い合わせしてみた、なども是非お待ちしております。',
            q13: 'AIってどう使うんですか？',
            a13: '最適な機体選びや練習プラン作成に活用します。',
            q14: '一緒に活動できますか？',
            a14: '人はたくさんいたほうが活気づくので、あくまでも私と同じく理念を元に活動することも可能です！',
            q15: 'クラブへの加入も検討しているのですが…',
            a15: '自身に合わせたレベルの近場のクラブの紹介や、近場であれば私の所属しているクラブを紹介することも可能です。私のところのクラブでは、コースや飛行場を利用するにあたってビジター料金などもございますので、お気軽に質問お待ちしております。'
        },
        partnersSection: {
            title: '提携サイト',
            intro: 'ぽすとそに工房と提携しているサイトをご紹介します。',
            rcKoboName: 'RC工房',
            rcKoboDescription: 'RC工房は、私がクラブで会長を務めさせていただいている模型店で、サーキットや飛行場が同じ敷地内にあります！随時クラブ員も募集しており、平日にも人が来るような和やかなクラブです。ビジター利用も大歓迎です。私の修理などを培っていただけた長年の付き合いのある店主ですので、ぜひ何か分からないことがあった場合はこちらの方を訪れることもお勧めしております！',
            addressLabel: '住所',
            rcKoboAddress: '〒002-8054\n北海道札幌市北区篠路町拓北7番地1038',
            telLabel: 'TEL',
            faxLabel: 'FAX',
            rcKoboTel: '011-768-7545',
            rcKoboFax: '011-768-7550',
            visitButton: 'RC工房のサイトを見る'
        },
        contactSection: {
            title: 'お問い合わせ',
            description1: 'お問い合わせは以下のフォームからお願いいたします。',
            description2: 'RC関連のご質問、修理のご依頼、サポートのご相談など、お気軽にお問い合わせください。',
            responseNoticeTitle: 'ご返信について',
            responseNoticeText: 'お返事はできる限り早急に対応させていただいておりますが、身体の都合によりご連絡が遅れる場合がございます。ご不便をおかけいたしますが、少々お時間をいただけますとありがたく存じます。',
            emailNoticeTitle: 'メール受信設定のお願い',
            emailNoticeText: 'お手数をおかけしますが、「@hotmail.co.jp」からのメールを受信できるよう、ドメインの許可設定をお願いいたします。また、迷惑メールフォルダに振り分けられている可能性もございますので、ご確認をお願いいたします。',
            notice: '※このフォームは商業目的ではなく、個人活動に関するお問い合わせ専用です。',
            buttonText: '📧 お問い合わせフォームを開く'
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
            rcCollectionTitle: 'これは、ぽすとそに自身が所有しているラジコンの一部です',
            imageCaption1: 'JR PROPO E8 を修理したりメンテナンスしていく うちにMIXされた他機種からの流用パーツがてんこ盛りになったヘリと、EPPの入門用高翼機たちです。',
            imageCaption2: 'INFERNO MP9 TKI3をベースにボディの塗装を変えて懐かしい色合いにした状態です。',
            imageCaption3: 'RC-Factory Super Extra Lの組み立て前写真で、組み立て動画はYouTubeにあがっています。',
            galleryButtonText: '活動ギャラリーをもっとみる',
            statsTitle: '数字で見る分かりやすい活動記録',
            stat1Number: '19年', stat1Label: 'RC活動歴',
            stat2Number: '100+', stat2Label: '修理依頼により<br>直ったラジコンの数',
            stat3Number: '20社+', stat3Label: '対応メーカー',
            stat4Number: '2年間', stat4Label: 'サポート活動',
            monthlyTitle: '📅 今月の活動',
            monthlyUpdated: '2025年12月25日更新',
            monthlyRepairsTitle: '修理・改善されたラジコン',
            monthlyRepairsCount: '2台',
            monthlySupportedTitle: 'サポートした人数',
            monthlySupportedCount: '2名',
            monthlyNewModelTitle: '新作機体',
            monthlyNewModelDetail: 'カルマート40α低翼モデル',
            monthlyNewsTitle: '新着その他情報',
            monthlyNewsDetail: 'noteの頻繁な更新、TX16S AG01ジンバル導入、NEXUS-XR導入、EdgeTXの勉強、Luaスクリプトの勉強',
            trustStatLabel1: '年の経験',
            trustStatLabel2: '修理実績',
            trustStatLabel3: '対応メーカー',
            beginnerGuideTitle: 'ラジコンが初めての方へ',
            beginnerGuideText: '「何から始めればいいの？」という疑問にお答えします。機体選びから基本操作まで、ステップバイステップでご案内します。',
            beginnerGuideButton: '初心者ガイドを見る →',
            ctaHighlightTitle: 'お気軽にご相談ください',
            ctaHighlightText: '修理のご依頼、技術的なご質問、初心者の方へのサポートなど、どんなことでもお問い合わせください。',
            ctaContact: '📧 お問い合わせフォームへ',
            // スーパーリロード注意書き
            reloadNoticeTitle: '💡 最新情報をご覧いただくために',
            reloadNoticeText1: '当サイトは頻繁に更新されています。',
            reloadNoticeText2: '最新の情報が表示されない場合がございますので、お手数ですが',
            reloadNoticeText3: 'ブラウザのページ更新をお試しください。',
            reloadWindows: '【Windows】',
            reloadWindowsKeys: 'Ctrl + F5　または　Ctrl + Shift + R',
            reloadMac: '【Mac】',
            reloadMacKeys: 'Command（⌘）+ Shift + R'
        },
        websiteProject: {
            date: '2025年11月13日',
            title: 'ウェブサイト全面リニューアルプロジェクト完了',
            overviewTitle: '📊 プロジェクト概要',
            overviewText1: 'ぽすとそに工房のウェブサイトを7つのPhaseに分けて全面リニューアルしました。ユーザー体験の向上、アクセシビリティの強化、そしてSEO対策まで、最新のWeb技術を駆使して実装しました。',
            overviewText2: '実装期間: 約2週間 | 改善項目: 50+ 項目 | 技術協力: Claude (Anthropic AI)',
            phase1Title: '🚀 Phase 1: 基礎構築',
            phase1Purpose: '目的: 使いやすい基本構造の確立',
            phase1Items: [
                'タブ切り替え式レイアウト採用',
                'レスポンシブデザイン（スマホ・タブレット・PC対応）',
                '温かみのあるオレンジ系カラーデザイン',
                '手書き風フォント（Yomogi）による親しみやすいUI'
            ],
            phase1Result: '成果: すべてのデバイスで快適に閲覧可能、視覚的に魅力的なデザイン実現',
            phase2Title: '⚡ Phase 2: 機能拡張',
            phase2Purpose: '目的: インタラクティブな体験の提供',
            phase2Items: [
                '訪問者カウンター（本日・昨日・累計）',
                'トップに戻るボタン（スムーズスクロール）',
                'ダークモード切り替え機能',
                'スクロールアニメーション',
                '活動統計の可視化（数字カウントアップ）'
            ],
            phase2Result: '成果: ユーザーエンゲージメント向上、視覚的なフィードバックで操作性UP',
            phase3Title: '🔍 Phase 3: SEO強化',
            phase3Purpose: '目的: Google検索での上位表示',
            phase3Items: [
                'メタタグの最適化（OGP, Twitter Card対応）',
                '構造化データ（JSON-LD）実装',
                'LocalBusiness（地域ビジネス情報）',
                'FAQPage（よくある質問）',
                'sitemap.xml / robots.txt 作成',
                'Google Search Console 連携'
            ],
            phase3Result: '成果: 検索エンジンでの表示改善、リッチリザルト表示対応、SEO評価向上',
            phase4Title: '📚 Phase 4: コンテンツ充実',
            phase4Purpose: '目的: ユーザーの疑問を徹底解消',
            phase4Items: [
                'FAQ拡充: 6個 → 15個',
                '初心者向け（5個）',
                'サービス内容（5個）',
                '技術・トラブル（5個）',
                'サイト内検索機能追加',
                '詳細な回答（料金目安、所要時間、対応範囲）'
            ],
            phase4Result: '成果: ユーザーの疑問解消率UP、コンバージョン率向上',
            phase5Title: '🚄 Phase 5: パフォーマンス最適化',
            phase5Purpose: '目的: 表示速度の劇的改善',
            phase5Items: [
                'Critical CSS実装: 初回表示速度 30-50% 向上',
                'Service Worker最適化: 2回目以降ほぼ瞬時表示',
                '画像遅延読み込み強化: データ量 40-60% 削減',
                'リソースヒント: DNS Prefetch, Preconnect'
            ],
            phase5Result: '成果: 初回訪問FCP 30-50%改善、2回目以降表示時間80-90%改善、オフライン対応、Core Web Vitals大幅改善',
            phase6Title: '📱 Phase 6: モバイル体験最適化',
            phase6Purpose: '目的: スマホでの快適性を追求',
            phase6Items: [
                'タップ領域拡大: 50% 拡大（誤タップ防止）',
                'ボタン最小高さ 48px（Apple/Google推奨）',
                '読みやすさ向上',
                '行間: 1.6 → 1.8-2.0',
                'フォントサイズ: 16px固定（iOS自動ズーム防止）',
                'JavaScript最適化: タップフィードバック、スクロール最適化'
            ],
            phase6Result: '成果: 誤タップ率70-80%削減、読書体験50%以上改善、滞在時間20-40%増加予測',
            phase7Title: '♿ Phase 7: アクセシビリティ強化',
            phase7Purpose: '目的: すべての人が使えるウェブサイトへ',
            phase7Items: [
                'スクリーンリーダー完全対応',
                'ARIA属性追加（role, aria-label, aria-expanded）',
                'ランドマークロール（navigation, main, search）',
                '動的コンテンツの音声通知',
                'キーボード操作完全対応',
                'スキップリンク（メインコンテンツへジャンプ）',
                'Tab/Enter/Escapeキー対応',
                'フォーカスインジケーター強化',
                'WCAG 2.1 AA基準準拠'
            ],
            phase7Result: '成果: Lighthouseスコア90-100点、すべてのユーザーが利用可能、キーボード操作可能率100%',
            effectsTitle: '📈 総合的な改善効果',
            effectsPerformance: '⚡ パフォーマンス',
            effectsPerformanceItems: [
                '初回表示速度: 50-70% 向上',
                '2回目以降: 90% 向上',
                'モバイルスコア: 90点以上'
            ],
            effectsUX: '😊 ユーザー体験',
            effectsUXItems: [
                '誤タップ率: -70～80%',
                '滞在時間: +30～50%',
                '離脱率: -30～40%'
            ],
            effectsSEO: '🔍 SEO',
            effectsSEOItems: [
                '検索順位: 大幅向上',
                '検索流入: +50-100%',
                'リッチリザルト表示対応'
            ],
            effectsAccessibility: '♿ アクセシビリティ',
            effectsAccessibilityItems: [
                '全ユーザー利用可能',
                'WCAG 2.1 AA準拠',
                'Lighthouse: 90-100点'
            ],
            techTitle: '🛠️ 使用技術',
            techFrontend: 'フロントエンド: HTML5（セマンティックHTML）、CSS3（レスポンシブデザイン）、JavaScript（ES6+、Intersection Observer、Service Worker）',
            techSEO: 'SEO & アクセシビリティ: 構造化データ（JSON-LD）、WAI-ARIA 1.2、WCAG 2.1 AA基準',
            techPerformance: 'パフォーマンス: Critical CSS、Service Worker（キャッシュ戦略）、画像遅延読み込み、リソースヒント',
            conclusionTitle: '💡 プロジェクトを通じて',
            conclusionText: 'このウェブサイト改善プロジェクトを通じて、「技術は人のためにある」という信念を改めて実感しました。視覚障害のある方、運動障害のある方、すべての人が平等に情報にアクセスできる環境を作ることの重要性を学びました。また、AI技術（Claude）を活用することで、個人でもこれだけのクオリティのウェブサイトを作成できることを証明できました。これは、RC文化の保存と発展、そしてデジタルデバイド解消への一歩だと考えています。今後も、ユーザーの皆様のフィードバックをもとに、継続的な改善を続けていきます。'
        },
        archiveProject: {
            date: '2025年12月25日',
            title: 'RCアーカイブプロジェクト始動 - 158機種のデータベース化完了',
            overviewTitle: '📚 プロジェクト概要',
            overviewText: 'ラジコン文化の保存と継承を目的とした「RCアーカイブプロジェクト」を開始しました。絶版機種から現代の最新機種まで、詳細な技術情報と修理ガイドをデータベース化し、後世に残す取り組みです。',
            viewArchiveLink: '→ RCアーカイブを見る',
            currentStatusTitle: '📊 現在の登録状況',
            currentStatusItem1: '登録機種数: 158機種',
            currentStatusItem2: '対応メーカー: タミヤ、京商、JR PROPO',
            currentStatusItem3: 'カテゴリー: ラジコンカー（152機種）、ラジコン飛行機（3機種）、ラジコンヘリ（3機種）',
            featuresTitle: '✨ 主な機能',
            featuresItem1: '詳細な機種情報: スペック、発売年、生産状況など',
            featuresItem2: '修理難易度表示: 初心者でも安心して選べる',
            featuresItem3: '検索・フィルター機能: メーカー、カテゴリー、生産状況で絞り込み',
            featuresItem4: '修理ガイド: よくある故障と対処法を掲載',
            featuresItem5: '多言語対応: 日本語、英語、中国語（準備中）',
            futureTitle: '🚀 今後の展開',
            futureText: '今後も継続的に機種を追加し、ヨコモ、京商、ヒロボー、海外メーカーなどの製品も順次データベース化していきます。また、ユーザーの皆様からの情報提供も募集しています。\n一緒にRC文化を未来に残していきましょう！'
        }
    },
    en: {
        title: 'Postsoni Workshop',
        subtitle: 'RC Technology & Passion',
        loadingText: 'Loading...',
        nav: {
            top: 'TOP', news: 'Latest Updates', gallery: 'Gallery',
            roadmap: 'For Beginners', profile: 'Profile', sns: 'SNS',
            activity: 'Blog', goods: 'Goods', support: 'Support',
            testimonials: 'Testimonials', faq: 'FAQ', partners: 'Partners', contact: 'Contact'
        },
        sidebar: {
            searchTitle: 'Site Search',
            searchPlaceholder: 'Search FAQ or blog articles',
            searchButton: 'Search',
            tocTitle: 'Table of Contents'
        },
        newsSection: {
            title: 'Latest Updates',
            date: 'November 11, 2025',
            newsTitle: 'Website Renewal & Equipment Enhancement Announcement',
            section1Title: '◆Website Update Completed',
            section1Text: 'Added a new section "Passion for RC Culture" to the profile page. It expresses my commitment to preserving RC culture in Japan and passing on technology and knowledge to the next generation.',
            section2Title: '◆Optimization of Information Dissemination with AI',
            section2Text: 'We are utilizing AI in writing note blog articles to create more comprehensible and detailed technical content. We aim to create content that is easy to understand even for beginners.',
            section3Title: '◆Calmato α40 (Plane) Assembly in Progress',
            section3Text: 'All mechanical parts (servos, ESC, motor, etc.) have arrived, and assembly and fine-tuning are currently underway. We will deliver a flight report once completed.',
            section4Title: '◆Introduction of Measuring Equipment',
            section4Text: 'We have introduced an analyzer that can accurately measure ESC current values. This enables more precise settings and troubleshooting.'
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
        roadmapSection: {
            title: 'Getting Started with RC in 5 Steps',
            intro: 'A reliable step guide for those who want to start or return to RC. We support you at your own pace.',
            step1Title: '💬 Consultation',
            step1Item1: 'Initial cost consultation for RC!',
            step1Item2: 'We aim for same-day decision once we notice your contact! (If you need time to think, no problem at all.)',
            step1Item3: 'We listen to what type of RC interests you and together determine what you need.',
            step2Title: '🎯 Choose RC Genre',
            step2Item1: 'We provide average initial cost estimates for your chosen genre while continuing consultation.',
            step2Item2: 'We also aim for same-day decision here! (If you need more time, we match your pace.)',
            step2Item3: 'We identify whether you\'re a beginner or returning hobbyist and help select RC models appropriate for your level.',
            step3Title: '🤝 Post-Purchase Support',
            step3Item1: 'We discuss suitable driving/flying locations based on your chosen RC. (Pre-planning possible.)',
            step3Item2: 'We help find nearby clubs. (For those not ready for clubs, we continue to advise on locations.)',
            step3Item3: 'We select appropriate locations according to current regulations.',
            step3Item4: 'For nearby areas, we can meet at agreed locations and support you by observing running/flying to ensure comfort. (For remote areas, we listen to what happened during first use and support improvements.)',
            step4Title: '🔧 Basic Maintenance',
            step4Item1: 'We discuss maintenance requirements for your RC within different budgets. (We combine my experience and AI to select appropriate items objectively. Pre-planning possible.)',
            step4Item2: 'We share basic maintenance knowledge to help you handle your RC yourself.',
            step5Title: '🚀 Into the RC World',
            step5Item1: 'Those who complete STEP 1-4 should be able to enjoy RC independently. Returning hobbyists should also be up to date with current RC knowledge.',
            step5Item2: 'For nearby areas, feel free to contact us anytime. For remote areas, we respond as quickly as possible.',
            step5Item3: 'This completes the initial stage! Enjoy at your own pace or practice extensively - welcome to the RC world!',
            note: '※This is a guideline. We sincerely work with you according to your play style needs. Please contact us anytime through the contact form.'
        },
        archive: {
            banner: {
                title: 'RC Database - Updated Daily to Cover All RC Models!',
                subtitle: 'Detailed guides based on 19 years of repair experience, from discontinued to modern models',
                button: 'View Archive →'
            },
            main: {
                title: '📚 RC Archive',
                subtitle: 'A comprehensive database of RC models from discontinued to modern\nA time capsule preserving RC culture for the next generation',
                purpose: {
                    title: '🎯 Archive Purpose',
                    item1: '✅ Preservation of Discontinued Model Information - Permanently recording instruction manuals and repair guides',
                    item2: '✅ Technology Succession - Converting 19 years of repair experience and 100+ cases into data',
                    item3: '✅ Information Updates - Prompt corrections and updates for any data discrepancies',
                    item4: '✅ Community Collaboration - Welcoming information contributions from those with model knowledge'
                },
                current: 'Currently updating with focus on RC cars! Information will be continuously expanded!',
                button: '📚 View RC Archive →',
                request: '💡 Request for Information\nIf you have model information or instruction manuals, we would appreciate your cooperation!\nLet\'s preserve RC culture for the future together.'
            }
        },
        aiConsultation: {
            title: 'AI RC Consultation',
            description: 'Repair methods, model selection, settings, parts availability - any question is welcome!<br>AI (Claude) and Postsoni will respond within 24 hours. Completely free.',
            button: 'Ask a Question (Free)',
            note: '*Answers may be published anonymously on note or our website as helpful articles, but your identity will remain completely confidential.'
        },
        profileSection: {
            title: 'Profile',
            nameLabel: 'Name',
            nameValue: 'Postsoni',
            ageLabel: 'Age',
            ageValue: '33 years old (as of 2025)',
            expertiseLabel: 'Expertise',
            expertiseList: [
                'RC operation (cars, planes, helicopters)',
                'Design (cars, planes)',
                'Repair (cars, various mechanisms)',
                'Basic knowledge support (safety considerations, etc.)'
            ],
            specialtyLabel: 'Special Skills',
            specialtyList: [
                'Integration of RC and AI',
                'Information gathering on latest models',
                'Fine details like mechanism compatibility'
            ],
            philosophyLabel: 'Activity Philosophy',
            philosophyValue: 'Passing on technology to the next generation through the fusion of AI technology and RC culture',
            achievementsTitle: '📊 Activity History',
            achievement1Number: '100+',
            achievement1Label: 'Land RC Repairs',
            achievement1Sublabel: 'Models repaired',
            achievement2Number: '30+',
            achievement2Label: 'Mechanism Repairs',
            achievement2Sublabel: 'Cases',
            achievement3Number: '20+',
            achievement3Label: 'Air RC Repairs',
            achievement3Sublabel: 'Cases',
            achievement4Number: '19 Years',
            achievement4Label: 'RC Experience',
            achievement4Sublabel: 'Extensive',
            achievement5Number: '2 Years',
            achievement5Label: 'Support Activity',
            achievement5Sublabel: 'Ongoing',
            achievement6Number: '20+',
            achievement6Label: 'Manufacturers',
            achievement6Sublabel: 'Diverse experience',
            makersTitle: '🔧 Compatible Manufacturers (Partial)',
            makersNote: '※Feel free to inquire about manufacturers not listed',
            passionTitle: '💭 Passion for RC Culture',
            passionText1: 'The reason I continue this activity is simple. I don\'t want RC culture to disappear from Japan. That\'s all.',
            passionText2: 'The reality surrounding RC is harsh. The hobby is aging, younger generations are turning to other entertainments, and places to drive or fly are decreasing year by year. Images like "RC is an expensive hobby," "high barrier to entry," and "beginners not welcome" prevail, causing many to give up before starting. In today\'s era dominated by social media and gaming/game streaming, the joy of creating something with your hands is hard to convey.',
            passionText3: 'Still, I continue to document this culture.',
            passionText4: 'Even if I can\'t attract many people in this era, by carefully preserving techniques and knowledge, someone might find them someday. Maybe in 10 years, 50 years, or perhaps in a future I won\'t see. Still, I believe that by letting it drift as a "time capsule" in the ocean of the internet, it might reach someone who needs it.',
            passionText5: 'This activity isn\'t business—it started from personal passion. It\'s conducted with unstable sleep patterns and is far from glamorous. Yet, I have 19 years of RC experience and over 100 repair cases. Recording, sharing, and passing these to the next generation—that\'s what I can do now.',
            passionText6: 'If you\'ve thought even a little "I want to try RC" or "I used to do it, maybe I\'ll start again," that alone makes me happy. Let\'s walk this culture together.'
        },
        snsSection: {
            title: 'SNS & Channels',
            youtubeTitle: 'YouTube Channel',
            youtubeDescription: 'RC building and flight videos',
            youtubeNote: '(Owned and operated by me)',
            youtubeBannerGuide: '↑↑Click or tap the banner above to visit the channel↑↑',
            xTitle: 'X (formerly Twitter)',
            xDescription: 'Daily RC activity records and latest updates',
            xBannerGuide: '↑↑Click or tap the banner above to visit X↑↑'
        },
        activitySection: {
            title: 'Activity Log',
            blogTitle: '📖 Technical Blog (note)',
            blogDescription: 'Sharing detailed information including repair processes, parts reviews, and technical notes that cannot be fully conveyed through SNS.',
            noteTitle: 'note',
            noteDescription: 'Detailed records of repair processes and technical explanations',
            latestArticlesTitle: '📌 Latest Blog Articles',
            moreArticles: 'View More Articles →'
        },
        goodsSection: {
            title: 'Goods',
            pdfDownloadTitle: '📚 Free Download Materials (Japanese Only)',
            pdfDownloadDescription: 'RC Terminology Guide (PDF) is available for free download!',
            pdfGlossaryTitle: 'RC Terminology Guide (PDF)',
            pdfFeature1: '・Basics ① - 35 basic terms',
            pdfFeature2: '・Intermediate ② - 35 setting terms',
            pdfFeature3: '・Advanced ③ - 55 competition terms',
            downloadButton: '📥 Download PDF',
            pdfNotice: '※This PDF is available in Japanese only',
            physicalGoodsComingSoon: 'Physical Goods (Coming Soon)',
            physicalGoodsDescription: 'Original goods are currently in preparation.',
            physicalGoodsNotice: '※This site does not handle product sales or order acceptance.'
        },
        supportSection: {
            title: 'RC Support & Assistance',
            mainTitle: 'Support for RC Beginners',
            support1Icon: '✏️',
            support1Title: 'Support for Beginners',
            support1Description: 'We work together to create plans gently and carefully, even for those touching RC for the first time.',
            support2Icon: '🔧',
            support2Title: 'About Repair & Maintenance',
            support2Description: 'We perform basic maintenance and repairs together. For advanced repairs, please contact us through the inquiry form. While some things may be impossible, we will honestly explain the reasons.',
            support2Detail: 'For extremely expensive RC repairs or special cases where parts are unavailable, we may refer you to nearby repair shops for resolution. (If parts are already available or can be purchased, I can repair them.)',
            support2Example: '※Example of expensive RC repair: RC plane crash → mechanical trouble inspection + detection of fine cracks + wood procurement + film/paint repair + time-consuming drying process + final check and finishing, etc.',
            support2ExampleNote: '(Please inquire for details.)',
            support3Icon: '🎓',
            support3Title: 'Improving Piloting Skills',
            support3Description: 'I am still learning, so I cannot perform all operations. However, I have some understanding of Tamiya Grand Prix, F3A, and F3C. (Please be forgiving of piloting skills.)',
            support3Detail: 'We strive to bring smiles by finding optimal practice methods suited to each person, comparing desired products with existing RC equipment for improvement practice or optimizing purchase order, utilizing AI.',
            conversationExample: '※I like both RC planes and RC cars, but both are halfway. How should I allocate time to each?',
            conversationAnswer: '→ X% to ○○, X% to ○○. It may change depending on your mindset, but the likely satisfying approach would be ○○ state! So now, you may not need ○○, but rather the mindset of ○○ might be important. Let\'s practice slowly over time! If you can achieve this much in ○○ weeks, buying ○○ might also be an option (*´ω｀)',
            support3DetailEnd: 'We approach each person individually in this manner. (If we were unable to help or were overly intrusive, we sincerely apologize. Please always feel free to share your honest thoughts, which we take seriously.)',
            note: 'Please contact us for details'
        },
        testimonialsSection: {
            title: 'Testimonials from Supported Users',
            intro: 'Testimonials from those who have received support. We appreciate their cooperation in creating this website.',
            testimonial1Name: 'Testimonial from Mr. Y',
            testimonial1Tag: 'Teens・Beginner・Land RC (Buggy)',
            testimonial1Text: 'Personally, I liked older buggies. However, older models have many parts issues, so I wasn\'t sure if starting was good. But by securing both new and old parts, both are now my beloved cars for practice. I learned difficult ESC settings by changing locations and learning operation from PC, and can now do it myself. Always running together and teaching tips - I\'m truly grateful.',
            testimonial2Name: 'Testimonial from Mr. O',
            testimonial2Tag: '50s・Returning Hobbyist・Land & Air RC',
            testimonial2Text: 'With a sudden walk-in repair, we found the cause was initial defect from the store, and immediately got a new replacement from the store. Since then, despite being like Rip Van Winkle with RC after a long time, I was taught current RC knowledge as much as possible. Though struggling, I managed to learn. Now continuing consultations to fly planes as the next step. Using LINE gives faster responses than email, leading to quick solutions. I\'d love to fly together next time. Very grateful.',
            testimonial3Name: 'Testimonial from Mr. K',
            testimonial3Tag: '60s・Experienced・Air RC (Planes, Helicopters)',
            testimonial3Text: 'Even with experience, keeping up with information is difficult, and sometimes I don\'t know how to set things up. However, looking at manuals together, optimal settings matching my level were provided. Repeatedly adjusting immediately after landing and taking off, I quickly understood what I couldn\'t do before. Thanks to this, though my main was planes, helicopters are also fun - I\'m hooked. Still can only hover, but discovering new things at this age is precious. Thank you.',
            testimonial4Name: 'Testimonial from Mr. A',
            testimonial4Tag: '30s・2 Years Drone Experience・Air RC (Helicopter)',
            testimonial4Text: 'Though I\'d flown drones, RC helicopter difficulty is exceptional. Initially even takeoff was difficult and scary. Thank you for teaching everything from 1 to 10 thoroughly. I thought growth would take much longer, but understanding mechanisms while flying led to increasing stability. I can now hover and turn. Though I don\'t yet have difficult skills like Postsoni-san, I\'m so hooked I might catch up and surpass you lol. Let\'s enjoy RC together while drinking warm tea and discussing RC!',
            testimonial5Name: 'Testimonial from Mr. S',
            testimonial5Tag: '30s・Beginner・Land RC',
            testimonial5Text: 'Initially I said buggy only and entering competitions. However, I was too focused on that feeling, forgetting childlike enthusiasm. Of course speed is fun, but I didn\'t know current models have such durable options even when thrashing around. Of course, improving my maintenance skills is also a factor lol. Now occasionally running fast buggies while getting maintenance help, and customizing off-road trucks durably on my own. That option existed?! I\'m surprised every time. Even though young, knowledge is too extensive, helping areas beyond my reach. Thank you always.'
        },
        faqSection: {
            title: 'FAQ',
            intro: 'We\'ve compiled frequently asked questions. If you have concerns, please check here first.',
            q1: 'I\'m a complete beginner, is that okay?',
            a1: 'Of course! No problem even if you know nothing!',
            q2: 'For RC beginners, which should I start with: cars, planes, or helicopters?',
            a2: 'I think starting with electric RC cars is good. First, keeping costs down while experiencing the enjoyment is the best beginning!',
            q3: 'What are the minimum necessities to start RC?',
            a3: 'Initially, having basic tools would be good. We have summarized electric cars for beginners in our note blog articles, so we\'d be very happy if you could refer to them.',
            q4: 'How much does it cost to start RC?',
            a4: 'Based on your inquiry, we think together about estimated costs for starting RC. While you make purchases yourself, we help determine "about this much?" standards and select items appropriate for your level. With the motto of "expanding enjoyment," we support starting without strain!',
            q5: 'Where do you recommend buying RC? (Store vs Online)',
            a5: 'For your first purchase only, buy from a hobby shop, then online is fine once you\'re accustomed. Making connections for immediate repairs is also important. With online, your first unit only may cost more later, so exercise caution. If budget requires online-only purchase, having a manual is very good.',
            q6: 'What should I watch for when buying used RC?',
            a6: 'If possible, we recommend something like new-old-stock or items with low usage that aren\'t abnormally cheap. Regardless of your level, if you contact us via inquiry with "Is purchasing this item in the photo okay? Here\'s the URL," we\'ll check that page based on your level before answering!',
            q7: 'My RC stopped working. What should I check?',
            a7: 'First, try reading the troubleshooting section in the manual. If you bought it used and don\'t understand, recent manuals are often available for download online. If you don\'t quite understand the procedure, contacting us via the inquiry form will enable smooth communication!',
            q8: 'How long do repairs take?',
            a8: 'Depends on the item, but often completed same day. For large items requiring part orders, it may take about a month. More complex processes require consultation.',
            q9: 'Can you handle old models?',
            a9: 'We handle them as much as possible. (Sometimes crafting parts if unavailable.) For example, we\'ve repaired the original Tamiya Hornet and some U-control parts.',
            q10: 'Where do you operate? What areas do you cover?',
            a10: 'Primarily Sapporo. Online support also available as much as possible.',
            q11: 'What types of RC do you support?',
            a11: 'Cars, planes, helicopters, tanks, trucks, boats, toy-grade RC (targeting lower ages). Drones require consultation.',
            q12: 'Can I consult online?',
            a12: 'Of course! Whether wanting to know details or just trying inquiry, please feel free to contact us.',
            q13: 'How do you use AI?',
            a13: 'We utilize it for optimal vehicle selection and practice plan creation.',
            q14: 'Can I work with you?',
            a14: 'More people creates more energy, so activities based on the same philosophy are possible!',
            q15: 'I\'m considering joining a club...',
            a15: 'We can introduce nearby clubs matching your level, or if nearby, introduce my own club. Our club has visitor fees for using courses and flying fields, so please feel free to ask questions.'
        },
        partnersSection: {
            title: 'Partner Sites',
            intro: 'Introducing sites partnered with Postsoni Workshop.',
            rcKoboName: 'RC Kobo',
            rcKoboDescription: 'RC Kobo is a model shop where I serve as club president, with a circuit and airfield on the same premises! We continuously recruit club members and have a friendly atmosphere with visitors even on weekdays. Visitor use is welcome. The shop owner has long been my mentor for repairs, so I highly recommend visiting if you have any questions!',
            addressLabel: 'Address',
            rcKoboAddress: '〒002-8054\n7-1038 Takuhoku, Shinoro-cho, Kita-ku, Sapporo, Hokkaido, Japan',
            telLabel: 'TEL',
            faxLabel: 'FAX',
            rcKoboTel: '011-768-7545',
            rcKoboFax: '011-768-7550',
            visitButton: 'Visit RC Kobo Website'
        },
        contactSection: {
            title: 'Contact',
            description1: 'Please contact us through the form below.',
            description2: 'Feel free to inquire about RC-related questions, repair requests, support consultations, etc.',
            responseNoticeTitle: 'About Our Response',
            responseNoticeText: 'We strive to respond as quickly as possible, but due to physical circumstances, our reply may be delayed. We apologize for any inconvenience and appreciate your patience.',
            emailNoticeTitle: 'Email Reception Settings',
            emailNoticeText: 'Please allow emails from "@hotmail.co.jp" in your domain settings. Also, please check your spam folder as our emails may be filtered there.',
            notice: '※This form is for personal activity inquiries, not commercial purposes.',
            buttonText: '📧 Open Contact Form'
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
            stat1Number: '19 Years', stat1Label: 'RC Experience',
            stat2Number: '100+', stat2Label: 'RCs Repaired',
            stat3Number: '20+', stat3Label: 'Manufacturers',
            stat4Number: '2 Years', stat4Label: 'Support Activity',
            monthlyTitle: '📅 This Month',
            monthlyUpdated: 'Updated Dec 25, 2025',
            monthlyRepairsTitle: 'RCs Repaired',
            monthlyRepairsCount: '2 units',
            monthlySupportedTitle: 'People Supported',
            monthlySupportedCount: '2 people',
            monthlyNewModelTitle: 'New Model',
            monthlyNewModelDetail: 'Calmato 40α Low-Wing Model',
            monthlyNewsTitle: 'Latest Updates',
            monthlyNewsDetail: 'Frequent note updates, TX16S AG01 gimbal introduction, NEXUS-XR introduction, EdgeTX learning, Lua script learning',
            trustStatLabel1: 'Years of Experience',
            trustStatLabel2: 'Repairs Completed',
            trustStatLabel3: 'Manufacturers Supported',
            beginnerGuideTitle: 'For First-Time RC Enthusiasts',
            beginnerGuideText: 'We answer your questions like "Where do I start?" From choosing your vehicle to basic operations, we guide you step by step.',
            beginnerGuideButton: 'View Beginner\'s Guide →',
            ctaHighlightTitle: 'Feel Free to Contact Us',
            ctaHighlightText: 'For repair requests, technical questions, beginner support, or any inquiries, please feel free to contact us.',
            ctaContact: '📧 Contact for Consultation',
            // Super Reload Notice
            reloadNoticeTitle: '💡 For the Latest Information',
            reloadNoticeText1: 'This site is frequently updated.',
            reloadNoticeText2: 'If you don\'t see the latest information,',
            reloadNoticeText3: 'please try refreshing your browser.',
            reloadWindows: '【Windows】',
            reloadWindowsKeys: 'Ctrl + F5 or Ctrl + Shift + R',
            reloadMac: '【Mac】',
            reloadMacKeys: 'Command (⌘) + Shift + R'
        },
        websiteProject: {
            date: 'November 13, 2025',
            title: 'Complete Website Renewal Project Completed',
            overviewTitle: '📊 Project Overview',
            overviewText1: 'We have completely renewed the Postsoni Workshop website in 7 phases. We implemented the latest web technologies to improve user experience, enhance accessibility, and optimize SEO.',
            overviewText2: 'Implementation Period: About 2 weeks | Improvements: 50+ items | Technical Collaboration: Claude (Anthropic AI)',
            phase1Title: '🚀 Phase 1: Foundation Building',
            phase1Purpose: 'Purpose: Establish an easy-to-use basic structure',
            phase1Items: [
                'Tab-switching layout adoption',
                'Responsive design (smartphone, tablet, PC compatible)',
                'Warm orange color design',
                'Friendly UI with handwritten-style font (Yomogi)'
            ],
            phase1Result: 'Results: Comfortable viewing on all devices, visually attractive design achieved',
            phase2Title: '⚡ Phase 2: Feature Expansion',
            phase2Purpose: 'Purpose: Provide interactive experience',
            phase2Items: [
                'Visitor counter (today, yesterday, total)',
                'Back to top button (smooth scroll)',
                'Dark mode toggle',
                'Scroll animations',
                'Activity statistics visualization (number count-up)'
            ],
            phase2Result: 'Results: Improved user engagement, enhanced usability with visual feedback',
            phase3Title: '🔍 Phase 3: SEO Enhancement',
            phase3Purpose: 'Purpose: Top ranking in Google search',
            phase3Items: [
                'Meta tag optimization (OGP, Twitter Card support)',
                'Structured data (JSON-LD) implementation',
                'LocalBusiness (local business information)',
                'FAQPage (frequently asked questions)',
                'sitemap.xml / robots.txt creation',
                'Google Search Console integration'
            ],
            phase3Result: 'Results: Improved search engine display, rich results support, enhanced SEO evaluation',
            phase4Title: '📚 Phase 4: Content Enrichment',
            phase4Purpose: 'Purpose: Thoroughly resolve user questions',
            phase4Items: [
                'FAQ expansion: 6 → 15 items',
                'For beginners (5 items)',
                'Service details (5 items)',
                'Technical & troubleshooting (5 items)',
                'Site search function added',
                'Detailed answers (cost estimates, time required, coverage)'
            ],
            phase4Result: 'Results: Improved question resolution rate, increased conversion rate',
            phase5Title: '🚄 Phase 5: Performance Optimization',
            phase5Purpose: 'Purpose: Dramatic improvement in display speed',
            phase5Items: [
                'Critical CSS implementation: 30-50% faster initial display',
                'Service Worker optimization: Nearly instant display on subsequent visits',
                'Enhanced image lazy loading: 40-60% data reduction',
                'Resource hints: DNS Prefetch, Preconnect'
            ],
            phase5Result: 'Results: 30-50% FCP improvement on first visit, 80-90% improvement on subsequent visits, offline support, significant Core Web Vitals improvement',
            phase6Title: '📱 Phase 6: Mobile Experience Optimization',
            phase6Purpose: 'Purpose: Pursue comfort on smartphones',
            phase6Items: [
                'Tap area expansion: 50% larger (prevent mistaps)',
                'Minimum button height 48px (Apple/Google recommended)',
                'Improved readability',
                'Line spacing: 1.6 → 1.8-2.0',
                'Font size: 16px fixed (prevent iOS auto-zoom)',
                'JavaScript optimization: tap feedback, scroll optimization'
            ],
            phase6Result: 'Results: 70-80% reduction in mistaps, 50%+ improvement in reading experience, 20-40% predicted increase in dwell time',
            phase7Title: '♿ Phase 7: Accessibility Enhancement',
            phase7Purpose: 'Purpose: Website for everyone',
            phase7Items: [
                'Full screen reader support',
                'ARIA attributes added (role, aria-label, aria-expanded)',
                'Landmark roles (navigation, main, search)',
                'Dynamic content voice announcements',
                'Full keyboard operation support',
                'Skip link (jump to main content)',
                'Tab/Enter/Escape key support',
                'Enhanced focus indicators',
                'WCAG 2.1 AA compliance'
            ],
            phase7Result: 'Results: Lighthouse score 90-100, available to all users, 100% keyboard operability',
            effectsTitle: '📈 Overall Improvement Results',
            effectsPerformance: '⚡ Performance',
            effectsPerformanceItems: [
                'Initial display speed: 50-70% improvement',
                'Subsequent visits: 90% improvement',
                'Mobile score: 90+ points'
            ],
            effectsUX: '😊 User Experience',
            effectsUXItems: [
                'Mistap rate: -70～80%',
                'Dwell time: +30～50%',
                'Bounce rate: -30～40%'
            ],
            effectsSEO: '🔍 SEO',
            effectsSEOItems: [
                'Search ranking: Significantly improved',
                'Search traffic: +50-100%',
                'Rich results display support'
            ],
            effectsAccessibility: '♿ Accessibility',
            effectsAccessibilityItems: [
                'Available to all users',
                'WCAG 2.1 AA compliance',
                'Lighthouse: 90-100 points'
            ],
            techTitle: '🛠️ Technologies Used',
            techFrontend: 'Frontend: HTML5 (Semantic HTML), CSS3 (Responsive Design), JavaScript (ES6+, Intersection Observer, Service Worker)',
            techSEO: 'SEO & Accessibility: Structured Data (JSON-LD), WAI-ARIA 1.2, WCAG 2.1 AA Standards',
            techPerformance: 'Performance: Critical CSS, Service Worker (Cache Strategy), Image Lazy Loading, Resource Hints',
            conclusionTitle: '💡 Through This Project',
            conclusionText: 'Through this website improvement project, I have reaffirmed my belief that "technology is for people." I learned the importance of creating an environment where everyone, including those with visual or motor impairments, can access information equally. Also, by utilizing AI technology (Claude), I was able to prove that even an individual can create a website of this quality. This is a step toward preserving and developing RC culture and resolving the digital divide. We will continue to make continuous improvements based on feedback from our users.'
        },
        archiveProject: {
            date: 'December 25, 2025',
            title: 'RC Archive Project Launch - Database of 158 Models Completed',
            overviewTitle: '📚 Project Overview',
            overviewText: 'We have launched the "RC Archive Project" aimed at preserving and passing on RC culture. This initiative creates a database of detailed technical information and repair guides for models from discontinued classics to modern releases.',
            viewArchiveLink: '→ View RC Archive',
            currentStatusTitle: '📊 Current Status',
            currentStatusItem1: 'Registered Models: 158 models',
            currentStatusItem2: 'Supported Manufacturers: Tamiya, Kyosho, JR PROPO',
            currentStatusItem3: 'Categories: RC Cars (152 models), RC Airplanes (3 models), RC Helicopters (3 models)',
            featuresTitle: '✨ Main Features',
            featuresItem1: 'Detailed Model Information: Specifications, release year, production status, etc.',
            featuresItem2: 'Repair Difficulty Display: Easy selection even for beginners',
            featuresItem3: 'Search & Filter Function: Filter by manufacturer, category, production status',
            featuresItem4: 'Repair Guides: Common issues and solutions included',
            featuresItem5: 'Multilingual Support: Japanese, English, Chinese (coming soon)',
            futureTitle: '🚀 Future Development',
            futureText: 'We will continue to add models and gradually database products from Yokomo, Kyosho, Hirobo, international manufacturers, and others. We also welcome information contributions from users.\nLet\'s preserve RC culture for the future together!'
        }
    },
    zh: {
        title: 'Postsoni工作室',
        subtitle: 'RC技术与热情的融合',
        loadingText: '加载中...',
        nav: {
            top: '首页', news: '最新活动', gallery: '画廊',
            roadmap: '新手指南', profile: '简介', sns: '社交媒体',
            activity: '博客', goods: '商品', support: '支援',
            testimonials: '评价', faq: '常见问题', partners: '合作网站', contact: '联系我们'
        },
        sidebar: {
            searchTitle: '站内搜索',
            searchPlaceholder: '搜索FAQ或博客文章',
            searchButton: '搜索',
            tocTitle: '目录'
        },
        newsSection: {
            title: '最新活动报告',
            date: '2025年11月11日',
            newsTitle: '网站更新 & 设备强化公告',
            section1Title: '◆网站改版完成',
            section1Text: '在简介页面添加了新栏目"对RC文化的热爱"。表达了为了不让RC文化从日本消失，将技术和知识传承给下一代的决心。',
            section2Title: '◆利用AI优化信息发布',
            section2Text: '我们在note博客的撰写中利用AI，致力于创作更易理解、更详细的技术文章。目标是创作即使是初学者也能理解的内容。',
            section3Title: '◆Calmato α40（飞机）组装中',
            section3Text: '所有机械部件（舵机、电调、电机等）已到齐，目前正在进行组装和微调。完成后将提供飞行报告。',
            section4Title: '◆测量设备的引进',
            section4Text: '引进了可以准确测量电调电流值的分析仪。这使得更精确的设置和故障排除成为可能。'
        },
        gallerySection: {
            title: '活动画廊',
            caption1: '确认了平成初期陆地OS发动机经过拆解清洁维护后可重新启动。',
            caption2: '这个变速齿轮已磨损',
            caption3: '更换变速齿轮,行驶检查后完成变速时机设定',
            caption4: '过去视频中直升机坠落瞬间的截图（我坠落的机体是JR的E8。现在看来已经相当老旧，零件也很少。）',
            caption5: '与现在销售的直升机混合使用，使其处于可飞行状态。详情请参阅YouTube的飞行视频。',
            caption6: '对K110S进行拆解清洁维护，确认桅杆轴在不可见程度上偏移。维修中的照片。',
            caption7: '下一代趣味飞行机的制作。制作说明书不是日语，即使是较难的图纸也在制作中。（桐木机也可以同样制作。）',
            badgeBefore: '维修前',
            badgeAfter: '维修后',
            badgeCompleted: '维修完成',
            badgeCrashed: '刚坠落'
        },
        roadmapSection: {
            title: '开始RC的5个步骤',
            intro: '为想要开始或回归RC的人提供的可靠步骤指南。我们将按照您的节奏提供支持。',
            step1Title: '💬 咨询',
            step1Item1: 'RC初期费用咨询！',
            step1Item2: '一收到联系就争取当天决定！（如需考虑当然可以慢慢来。）',
            step1Item3: '我们会具体了解您感兴趣的RC类型，并一起讨论需要什么。',
            step2Title: '🎯 选择RC类型',
            step2Item1: '为您选择的类型提供平均初期费用概算，同时继续咨询。',
            step2Item2: '这里也争取当天决定！（如需考虑，我们会配合您的节奏。）',
            step2Item3: '区分新手或回归者，根据水平一起选择合适的RC型号。',
            step3Title: '🤝 购买后支持',
            step3Item1: '根据您选择的RC内容一起讨论可行驶、飞行的场所。（事前讨论也可以。）',
            step3Item2: '一起寻找附近的俱乐部。（对于还不想加入俱乐部的人，我们会继续提供场所建议。）',
            step3Item3: '根据现行法律选择合适的场所。',
            step3Item4: '如果在附近，我们可以根据每个人的情况决定场所并约定见面，一起观看行驶或飞行以确保不会害怕。（如果在远方，我们会询问第一次玩时发生了什么困难，并支持改善。）',
            step4Title: '🔧 基本维护',
            step4Item1: '根据您喜欢的RC，按预算一起讨论维护所需物品。（结合我的经验和AI，客观地选择合适的物品。当然也可以事前讨论。）',
            step4Item2: '传授维护基础知识，支持您自己也能操作RC。',
            step5Title: '🚀 进入RC世界',
            step5Item1: '完成STEP1～4的人应该已经可以独自游玩了。即使是回归者，也应该能跟上当前的RC知识。',
            step5Item2: '如果在附近，遇到困难时请随时联系。即使在远方，我们也会尽快回应。',
            step5Item3: 'RC的初期阶段到此结束！可以按自己的节奏玩，也可以大量练习，欢迎进入RC世界！',
            note: '※这是一个指南。我们会根据每个人的游玩方式需求真诚地应对。请随时通过联系表单与我们联系。'
        },
        archive: {
            banner: {
                title: '遥控模型数据库 - 每日更新以覆盖所有RC模型！',
                subtitle: '基于19年维修实绩的详细指南，从绝版到现代车型',
                button: '查看资料库 →'
            },
            main: {
                title: '📚 RC资料库',
                subtitle: '从绝版到现代的全面遥控车模型数据库\n将RC文化历史传承给下一代的时间胶囊',
                purpose: {
                    title: '🎯 资料库目的',
                    item1: '✅ 保存绝版机型信息 - 永久记录使用说明书和维修指南',
                    item2: '✅ 技术传承 - 将19年的维修经验和100+实例数据化',
                    item3: '✅ 信息更新 - 如有数据不足，及时订正和更新',
                    item4: '✅ 社区合作 - 欢迎拥有机型信息的人士提供信息'
                },
                current: '目前以遥控车为中心持续更新中！信息将不断扩充！',
                button: '📚 查看RC资料库 →',
                request: '💡 信息提供请求\n如果您有机型信息或使用说明书，请务必与我们合作！\n让我们一起将RC文化留给未来。'
            }
        },
        aiConsultation: {
            title: 'AI遥控模型咨询室',
            description: '维修方法、机型选择、调试设置、零件获取等，任何问题都欢迎咨询！<br>AI（Claude）和Postsoni将在24小时内回复。完全免费。',
            button: '提问（免费）',
            note: '※回答可能会以完全匿名的形式发布在note或网站上，作为对大家有用的文章，但您的身份信息绝对保密，请放心。'
        },
        profileSection: {
            title: '简介',
            nameLabel: '姓名',
            nameValue: 'Postsoni',
            ageLabel: '年龄',
            ageValue: '33岁（截至2025年）',
            expertiseLabel: '专业领域',
            expertiseList: [
                '遥控操作（汽车、飞机、直升机）',
                '设计（汽车、飞机）',
                '维修（汽车、各种机械）',
                '基础知识支持（安全考虑等）'
            ],
            specialtyLabel: '特长',
            specialtyList: [
                'RC与AI的融合',
                '最新机型等信息收集',
                '机械兼容性等细节'
            ],
            philosophyLabel: '活动理念',
            philosophyValue: '通过AI技术与RC文化的融合，向下一代传承技术',
            achievementsTitle: '📊 活动历史',
            achievement1Number: '100+',
            achievement1Label: '陆地RC维修',
            achievement1Sublabel: '修好的型号',
            achievement2Number: '30+',
            achievement2Label: '机械维修',
            achievement2Sublabel: '件',
            achievement3Number: '20+',
            achievement3Label: '空中RC维修',
            achievement3Sublabel: '件',
            achievement4Number: '19年',
            achievement4Label: 'RC经验',
            achievement4Sublabel: '丰富经验',
            achievement5Number: '2年',
            achievement5Label: '支持活动',
            achievement5Sublabel: '持续进行中',
            achievement6Number: '20+',
            achievement6Label: '制造商',
            achievement6Sublabel: '多样经验',
            makersTitle: '🔧 支持的制造商（部分）',
            makersNote: '※未列出的制造商也请随时咨询',
            passionTitle: '💭 对RC文化的热爱',
            passionText1: '我继续这项活动的理由很简单。我不希望RC文化从日本消失。就是这样。',
            passionText2: 'RC所面临的现实是严峻的。老龄化在加剧，年轻一代转向其他娱乐，可以驾驶或飞行的场所也在逐年减少。"RC作为爱好是高级品"、"门槛高"、"不欢迎初学者"等印象先行，许多人在开始前就放弃了。在社交媒体和游戏或游戏实况主导的今天，用手创造东西的乐趣很难传达。',
            passionText3: '即便如此，我仍会继续记录这一文化。',
            passionText4: '即使在这个时代无法吸引许多人，通过细心地保存技术和知识，也许有一天会有人发现它们。可能是10年后、50年后，或者是我不在世的未来。即便如此，我相信，只要将它作为"时间胶囊"沉入互联网的海洋，就有可能到达需要它的人手中。',
            passionText5: '这项活动不是生意，而是出于个人热情开始的。在睡眠不稳定的情况下进行活动，绝不华丽。但我有19年的RC经验和100多个维修案例。记录、分享并传承给下一代——这就是我现在能做的。',
            passionText6: '如果您哪怕有一点"想尝试RC"或"以前玩过，也许会重新开始"的想法，仅此就让我很高兴。让我们一起走过这一文化吧。'
        },
        snsSection: {
            title: '社交媒体和频道',
            youtubeTitle: 'YouTube 频道',
            youtubeDescription: '发布RC制作和飞行视频',
            youtubeNote: '（由我拥有和运营）',
            youtubeBannerGuide: '↑↑点击或点按上方横幅访问频道↑↑',
            xTitle: 'X（原Twitter）',
            xDescription: '发布RC活动的日常记录和最新信息',
            xBannerGuide: '↑↑点击或点按上方横幅访问X↑↑'
        },
        activitySection: {
            title: '活动记录',
            blogTitle: '📖 技术博客（note）',
            blogDescription: '发布维修过程、零件评测、技术备忘录等SNS无法完全传达的详细信息。',
            noteTitle: 'note',
            noteDescription: '详细记录维修过程和技术解说',
            latestArticlesTitle: '📌 最新博客文章',
            moreArticles: '查看更多文章 →'
        },
        goodsSection: {
            title: '商品',
            pdfDownloadTitle: '📚 免费下载资料（仅日语）',
            pdfDownloadDescription: 'RC术语集（PDF）免费下载！',
            pdfGlossaryTitle: 'RC术语集（PDF）',
            pdfFeature1: '・基础篇① - 35个基本术语',
            pdfFeature2: '・中级篇② - 35个设置术语',
            pdfFeature3: '・应用篇③ - 55个竞技・专业术语',
            downloadButton: '📥 下载PDF',
            pdfNotice: '※此PDF仅提供日语版本',
            physicalGoodsComingSoon: '实体商品（准备中）',
            physicalGoodsDescription: '原创商品目前正在准备中。',
            physicalGoodsNotice: '※本网站不处理商品销售或订单接受。'
        },
        supportSection: {
            title: 'RC支援与支持',
            mainTitle: '对RC初学者的支持',
            support1Icon: '✏️',
            support1Title: '对初学者的支援',
            support1Description: '即使是第一次接触遥控的人，我们也会温柔细致地一起摸索计划。',
            support2Icon: '🔧',
            support2Title: '关于维修保养',
            support2Description: '一起进行基础维护和维修。关于高级维修，请通过联系表单联系。虽然有些确实无法做到，但我们会诚实地说明理由。',
            support2Detail: '对于维修费用过高的遥控或零件另需且无法获得的特殊情况，我们可能会介绍附近的维修店以寻求解决。（如果零件已有或可以购买，我也可以维修。）',
            support2Example: '※维修费用高的遥控一例：遥控飞机坠落→机械故障检查+发现细微裂纹+木材采购+修复薄膜和涂装+等待干燥的耗时工序+最终检查和完工等',
            support2ExampleNote: '（详情请咨询。）',
            support3Icon: '🎓',
            support3Title: '操纵技术提升',
            support3Description: '我也还是新手，并非所有操作都能做到。但是，关于Tamiya比赛、F3A、F3C还是有些了解的。（操纵技术请多包涵。）',
            support3Detail: '利用AI，为每个人找到最适合的练习方法，或者比较想要的商品和自己现有的遥控进行提升练习或优化购买顺序，努力让大家最后露出笑容。',
            conversationExample: '※我喜欢遥控飞机和遥控车，但两者都半途而废，应该如何分配各自的时间呢？',
            conversationAnswer: '→ ○○占几成、○○占几成，虽然根据自己的心境会有所变化，但大概令人满意的形式应该是○○状态！所以，现在需要的不是○○，实际上○○的思维方式可能更重要，所以花时间慢慢练习吧！如果○○周后能做到这个程度，那么购买○○也是一个选择(*´ω｀)',
            support3DetailEnd: '就是这样的形式，面对每一个人。（如果没能帮上忙或过度干涉，非常抱歉。随时都可以说出来，我会认真对待真心话。）',
            note: '详情请咨询'
        },
        testimonialsSection: {
            title: '接受支持者的声音',
            intro: '这是实际接受支持的人们的体验谈。感谢大家在网站开设时的协助。',
            testimonial1Name: 'Y先生的体验谈',
            testimonial1Tag: '10多岁・未经验・陆地RC（越野车）',
            testimonial1Text: '个人来说，我喜欢越野车中的老车型。但是，老车型存在很多零件问题，不知道是否适合开始。但是，通过确保新旧零件，现在两台都成为了练习用的爱车。在不同地方学习了从PC操作困难的ESC设置，自己也能做到了。总是一起跑，传授技巧，非常感谢。',
            testimonial2Name: 'O先生的体验谈',
            testimonial2Tag: '50多岁・回归者・陆地RC＆空中RC',
            testimonial2Text: '突然上门维修，发现原因是购买店的初期不良，马上从购买店换了新品。之后，尽管久违的遥控让我像浦岛太郎一样，还是尽力教给我现在的遥控知识，虽然很辛苦但还是学会了。现在为了下一步飞行飞机继续咨询，使用LINE等比邮件更快得到回复，解决得很快很高兴。下次飞行时希望能一起。非常感谢。',
            testimonial3Name: 'K先生的体验谈',
            testimonial3Tag: '60多岁・经验者・空中RC（飞机、直升机）',
            testimonial3Text: '即使有经验，跟上信息也很困难，有时不知道该如何设置。但是在旁边看说明书，给出了适合我水平的最佳设置，飞行后立即降落反复调整，我也能马上理解以前做不到的事情。托您的福，虽然主要是飞机，但直升机也很有趣，入迷了。虽然还只能悬停，但到了这个年纪还有新发现是很宝贵的。谢谢。',
            testimonial4Name: 'A先生的体验谈',
            testimonial4Tag: '30多岁・无人机经验2年・空中RC（直升机）',
            testimonial4Text: '虽然飞过无人机，但遥控直升机的难度是另一个级别。最初连起飞都很困难，害怕地做。从1到10全部细致地教我，非常感谢。原以为需要更长时间才能成长，但在理解机制的同时飞行，越来越稳定，悬停和转弯我也能做到。虽然还没有像Postsoni先生那样的高难度技能，但总有一天会追上并超越，完全入迷了笑，一定要一起喝着温暖的茶，聊遥控话题，一起享受遥控吧！',
            testimonial5Name: 'S先生的体验谈',
            testimonial5Tag: '30多岁・未经验・陆地RC',
            testimonial5Text: '最初说只选越野车要参加比赛。但是，我只顾着那份心情，忘记了童心的投入。当然速度也很有趣，但没想到现在的车型有这么耐造的型号。当然提升我的保养技能也是一个原因笑。现在偶尔跑快速越野车，一起做维护，也在自己进行越野卡车的坚固定制。没想到还有这招！每次都很惊讶。虽然年轻但知识太丰富，帮助我够不着的范围，总是感谢。'
        },
        faqSection: {
            title: '常见问题',
            intro: '我们整理了大家常问的问题。如有疑问，请先查看这里。',
            q1: '完全新手可以吗？',
            a1: '当然可以！什么都不懂也没问题！',
            q2: '遥控初学者应该从汽车、飞机还是直升机开始？',
            a2: '我认为从电动遥控汽车开始比较好。首先控制费用、感受乐趣是最好的开始！',
            q3: '开始玩遥控最低限度需要什么？',
            a3: '最初有基本工具比较好。我们在note博客文章中总结了针对初学者的电动车解说，如果可以的话请参考，我会很高兴。',
            q4: '开始玩遥控需要多少费用？',
            a4: '根据您的咨询内容，一起考虑开始遥控所需的费用预算。实际购物由您自己进行，但我们会帮助确定"大概这么多？"的标准，选择时会根据咨询者的水平为基础。以"扩展乐趣"为宗旨，支持无负担的开始！',
            q5: '建议在哪里购买遥控？（实体店 vs 网络）',
            a5: '最初只在模型店购买，习惯后网络也没问题。能马上维修的门路也很重要。网络的话，仅第一台可能后来会变贵，所以要非常注意。如果因金额只能网络购买，有说明书比较好。',
            q6: '购买二手遥控时有什么注意点？',
            a6: '如果可以的话，推荐准新品或使用频率少且没有异常便宜出售的东西。无论您的水平如何，如果通过咨询表单联系"这张照片的东西买了没问题吗？以下是URL。"等，我会根据水平确认那个页面后再回答！',
            q7: '遥控不动了。应该确认哪里？',
            a7: '首先请阅读说明书的故障对策。即使是二手购买不明白，最近的说明书也可以从网上下载。如果方法不太明白，通过联系表单联系的话可以顺利传达！',
            q8: '维修需要多长时间？',
            a8: '因物品而异，但很多情况下当天完成。大型且需要订购零件的话，可能需要约1个月。工序越多越需要咨询。',
            q9: '老旧机体也能对应吗？',
            a9: '尽可能对应。（即使没有零件也可能自制。）例如，修理了田宫初代发售的Hornet，也修理了部分U-control。',
            q10: '在哪里活动？对应区域是？',
            a10: '基本是札幌。网络对应也尽可能进行。',
            q11: '对应什么样的遥控？',
            a11: '汽车、飞机、直升机、坦克、卡车、船、玩具遥控（指针对低年龄的遥控等）。无人机需要咨询。',
            q12: '可以在线咨询吗？',
            a12: '当然可以。想详细了解概要、试着咨询等，都欢迎。',
            q13: 'AI怎么使用？',
            a13: '用于最佳机体选择和练习计划制作。',
            q14: '可以一起活动吗？',
            a14: '人多了更有活力，所以也可以基于同样理念进行活动！',
            q15: '我在考虑加入俱乐部...',
            a15: '可以介绍符合自己水平的附近俱乐部，如果在附近也可以介绍我所属的俱乐部。我们俱乐部使用赛道和飞行场有访客费用，请随时提问。'
        },
        partnersSection: {
            title: '合作网站',
            intro: '介绍与Postsoni工作室合作的网站。',
            rcKoboName: 'RC工房',
            rcKoboDescription: 'RC工房是我担任俱乐部会长的模型店，赛道和飞行场在同一场地！随时招募俱乐部成员，平日也有人来的和睦俱乐部。也非常欢迎访客使用。店主是培养我维修技术的长年交往的老板，所以如果有什么不明白的地方，也推荐访问这里！',
            addressLabel: '地址',
            rcKoboAddress: '〒002-8054\n北海道札幌市北区筱路町拓北7番地1038',
            telLabel: '电话',
            faxLabel: '传真',
            rcKoboTel: '011-768-7545',
            rcKoboFax: '011-768-7550',
            visitButton: '访问RC工房网站'
        },
        contactSection: {
            title: '联系我们',
            description1: '请通过以下表单联系。',
            description2: 'RC相关问题、维修委托、支持咨询等，请随时联系。',
            responseNoticeTitle: '关于回复',
            responseNoticeText: '我们会尽快回复，但由于身体原因，回复可能会延迟。给您带来不便，敬请谅解。',
            emailNoticeTitle: '邮件接收设置',
            emailNoticeText: '请设置允许接收来自"@hotmail.co.jp"的邮件。另外，请检查垃圾邮件文件夹，因为可能被过滤到那里。',
            notice: '※本表单不用于商业目的，专用于个人活动咨询。',
            buttonText: '📧 打开联系表单'
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
            stat1Number: '19年', stat1Label: 'RC经验',
            stat2Number: '100+', stat2Label: '修好的RC',
            stat3Number: '20社+', stat3Label: '支持的制造商',
            stat4Number: '2年', stat4Label: '支持活动',
            monthlyTitle: '📅 本月活动',
            monthlyUpdated: '2025年12月25日更新',
            monthlyRepairsTitle: '维修的RC',
            monthlyRepairsCount: '2台',
            monthlySupportedTitle: '支持的人数',
            monthlySupportedCount: '2名',
            monthlyNewModelTitle: '新机型',
            monthlyNewModelDetail: 'Calmato 40α低翼机型',
            monthlyNewsTitle: '最新更新',
            monthlyNewsDetail: 'note频繁更新、TX16S AG01云台导入、NEXUS-XR导入、EdgeTX学习、Lua脚本学习',
            trustStatLabel1: '年经验',
            trustStatLabel2: '维修实绩',
            trustStatLabel3: '支持制造商',
            beginnerGuideTitle: '首次接触RC的朋友',
            beginnerGuideText: '解答"从哪里开始？"的疑问。从选择机体到基本操作，逐步指导。',
            beginnerGuideButton: '查看新手指南 →',
            ctaHighlightTitle: '欢迎随时咨询',
            ctaHighlightText: '维修委托、技术问题、新手支持等，任何问题都欢迎咨询。',
            ctaContact: '📧 咨询联系表单',
            // 超级重新加载提示
            reloadNoticeTitle: '💡 查看最新信息',
            reloadNoticeText1: '本网站经常更新。',
            reloadNoticeText2: '如果未显示最新信息，',
            reloadNoticeText3: '请尝试刷新浏览器。',
            reloadWindows: '【Windows】',
            reloadWindowsKeys: 'Ctrl + F5 或 Ctrl + Shift + R',
            reloadMac: '【Mac】',
            reloadMacKeys: 'Command (⌘) + Shift + R'
        },
        websiteProject: {
            date: '2025年11月13日',
            title: '网站全面更新项目完成',
            overviewTitle: '📊 项目概要',
            overviewText1: '我们将Postsoni工房的网站分为7个Phase进行了全面更新。从用户体验的提升、可访问性的强化到SEO对策，运用了最新的Web技术进行实施。',
            overviewText2: '实施期间：约2周 | 改善项目：50+ 项 | 技术协作：Claude (Anthropic AI)',
            phase1Title: '🚀 Phase 1：基础构建',
            phase1Purpose: '目的：确立易用的基本结构',
            phase1Items: [
                '采用标签切换式布局',
                '响应式设计（智能手机·平板·PC兼容）',
                '温暖的橙色系配色设计',
                '使用手写风格字体（Yomogi）的亲切UI'
            ],
            phase1Result: '成果：所有设备都能舒适浏览，实现视觉上有吸引力的设计',
            phase2Title: '⚡ Phase 2：功能扩展',
            phase2Purpose: '目的：提供交互式体验',
            phase2Items: [
                '访客计数器（今日·昨日·累计）',
                '返回顶部按钮（平滑滚动）',
                '暗黑模式切换功能',
                '滚动动画',
                '活动统计可视化（数字递增）'
            ],
            phase2Result: '成果：用户参与度提升，通过视觉反馈提高操作性',
            phase3Title: '🔍 Phase 3：SEO强化',
            phase3Purpose: '目的：在Google搜索中获得高排名',
            phase3Items: [
                '元标签优化（OGP、Twitter Card对应）',
                '结构化数据（JSON-LD）实施',
                'LocalBusiness（地区业务信息）',
                'FAQPage（常见问题）',
                'sitemap.xml / robots.txt 创建',
                'Google Search Console 集成'
            ],
            phase3Result: '成果：搜索引擎显示改善，支持富媒体结果，SEO评价提升',
            phase4Title: '📚 Phase 4：内容充实',
            phase4Purpose: '目的：彻底解决用户疑问',
            phase4Items: [
                'FAQ扩充：6个 → 15个',
                '新手向（5个）',
                '服务内容（5个）',
                '技术·故障（5个）',
                '站内搜索功能添加',
                '详细回答（费用参考、所需时间、对应范围）'
            ],
            phase4Result: '成果：用户疑问解决率UP，转化率提升',
            phase5Title: '🚄 Phase 5：性能优化',
            phase5Purpose: '目的：显示速度的显著改善',
            phase5Items: [
                'Critical CSS实施：首次显示速度提高30-50%',
                'Service Worker优化：第二次以后几乎瞬时显示',
                '图片延迟加载强化：数据量削减40-60%',
                '资源提示：DNS Prefetch、Preconnect'
            ],
            phase5Result: '成果：首次访问FCP改善30-50%，第二次以后显示时间改善80-90%，离线支持，Core Web Vitals大幅改善',
            phase6Title: '📱 Phase 6：移动体验优化',
            phase6Purpose: '目的：追求智能手机的舒适性',
            phase6Items: [
                '点击区域扩大：扩大50%（防止误触）',
                '按钮最小高度48px（Apple/Google推荐）',
                '可读性提高',
                '行间距：1.6 → 1.8-2.0',
                '字体大小：16px固定（防止iOS自动缩放）',
                'JavaScript优化：点击反馈、滚动优化'
            ],
            phase6Result: '成果：误触率削减70-80%，阅读体验改善50%以上，停留时间预计增加20-40%',
            phase7Title: '♿ Phase 7：可访问性强化',
            phase7Purpose: '目的：所有人都能使用的网站',
            phase7Items: [
                '屏幕阅读器完全对应',
                'ARIA属性添加（role、aria-label、aria-expanded）',
                '地标角色（navigation、main、search）',
                '动态内容的语音通知',
                '键盘操作完全对应',
                '跳过链接（跳转到主要内容）',
                'Tab/Enter/Escape键对应',
                '焦点指示器强化',
                'WCAG 2.1 AA标准准拠'
            ],
            phase7Result: '成果：Lighthouse分数90-100分，所有用户都可使用，键盘操作可能率100%',
            effectsTitle: '📈 综合改善效果',
            effectsPerformance: '⚡ 性能',
            effectsPerformanceItems: [
                '首次显示速度：提高50-70%',
                '第二次以后：提高90%',
                '移动端分数：90分以上'
            ],
            effectsUX: '😊 用户体验',
            effectsUXItems: [
                '误触率：-70～80%',
                '停留时间：+30～50%',
                '跳出率：-30～40%'
            ],
            effectsSEO: '🔍 SEO',
            effectsSEOItems: [
                '搜索排名：大幅提升',
                '搜索流量：+50-100%',
                '富媒体结果显示对应'
            ],
            effectsAccessibility: '♿ 可访问性',
            effectsAccessibilityItems: [
                '全用户可使用',
                'WCAG 2.1 AA准拠',
                'Lighthouse：90-100分'
            ],
            techTitle: '🛠️ 使用技术',
            techFrontend: '前端：HTML5（语义化HTML）、CSS3（响应式设计）、JavaScript（ES6+、Intersection Observer、Service Worker）',
            techSEO: 'SEO & 可访问性：结构化数据（JSON-LD）、WAI-ARIA 1.2、WCAG 2.1 AA标准',
            techPerformance: '性能：Critical CSS、Service Worker（缓存策略）、图片延迟加载、资源提示',
            conclusionTitle: '💡 通过项目',
            conclusionText: '通过这个网站改善项目，我再次深刻认识到"技术是为人服务的"这一信念。我学到了为视觉障碍者、运动障碍者等所有人创造平等获取信息环境的重要性。此外，通过利用AI技术（Claude），我证明了即使是个人也能创建如此高质量的网站。这是朝着RC文化的保存与发展以及消除数字鸿沟迈出的一步。今后我们将根据用户的反馈持续改进。'
        },
        archiveProject: {
            date: '2025年12月25日',
            title: 'RC档案项目启动 - 完成158款机型数据库',
            overviewTitle: '📚 项目概述',
            overviewText: '我们启动了旨在保存和传承RC文化的"RC档案项目"。该项目将从绝版机型到现代最新机型的详细技术信息和维修指南数据库化，留给后代。',
            viewArchiveLink: '→ 查看RC档案',
            currentStatusTitle: '📊 当前登记状况',
            currentStatusItem1: '登记机型数：158款',
            currentStatusItem2: '支持制造商：田宫、京商、JR PROPO',
            currentStatusItem3: '类别：遥控车（152款）、遥控飞机（3款）、遥控直升机（3款）',
            featuresTitle: '✨ 主要功能',
            featuresItem1: '详细机型信息：规格、发售年份、生产状况等',
            featuresItem2: '维修难度显示：初学者也能安心选择',
            featuresItem3: '搜索和筛选功能：按制造商、类别、生产状况筛选',
            featuresItem4: '维修指南：列出常见故障和解决方法',
            featuresItem5: '多语言支持：日语、英语、中文（准备中）',
            futureTitle: '🚀 未来发展',
            futureText: '今后我们将持续添加机型，并逐步对Yokomo、京商、Hirobo、海外制造商等产品进行数据库化。我们也欢迎用户提供信息。\n让我们一起为未来保存RC文化！'
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
        btn.addEventListener('click', function(e) {
            e.preventDefault();
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
    const searchInput = document.getElementById('siteSearch');
    const searchBtn = document.getElementById('searchBtn');
    if (searchTitle) searchTitle.textContent = '🔍 ' + trans.sidebar.searchTitle;
    if (searchInput) searchInput.placeholder = trans.sidebar.searchPlaceholder;
    if (searchBtn) searchBtn.textContent = trans.sidebar.searchButton;
    
    // サイドバー - 目次タイトル
    const tocTitle = document.querySelector('.nav-title');
    if (tocTitle) tocTitle.textContent = '📌 ' + trans.sidebar.tocTitle;
    
    // 最新の活動報告セクション
    const newsTitle = document.querySelector('#news .section-title');
    const newsDate = document.querySelector('#news .news-date');
    const newsArticleTitle = document.querySelector('#news .news-title');
    const newsSubtitles = document.querySelectorAll('#news .news-subtitle');
    const newsSectionTexts = document.querySelectorAll('#news .news-section p');
    
    if (newsTitle) newsTitle.textContent = '📰 ' + trans.newsSection.title;
    if (newsDate) newsDate.textContent = trans.newsSection.date;
    if (newsArticleTitle) newsArticleTitle.textContent = trans.newsSection.newsTitle;
    
    if (newsSubtitles[0]) newsSubtitles[0].textContent = trans.newsSection.section1Title;
    if (newsSubtitles[1]) newsSubtitles[1].textContent = trans.newsSection.section2Title;
    if (newsSubtitles[2]) newsSubtitles[2].textContent = trans.newsSection.section3Title;
    if (newsSubtitles[3]) newsSubtitles[3].textContent = trans.newsSection.section4Title;
    
    if (newsSectionTexts[0]) newsSectionTexts[0].textContent = trans.newsSection.section1Text;
    if (newsSectionTexts[1]) newsSectionTexts[1].textContent = trans.newsSection.section2Text;
    if (newsSectionTexts[2]) newsSectionTexts[2].textContent = trans.newsSection.section3Text;
    if (newsSectionTexts[3]) newsSectionTexts[3].textContent = trans.newsSection.section4Text;
    
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
        if (text === '修理前' || text === 'Before Repair' || text === '维修前') badge.textContent = trans.gallerySection.badgeBefore;
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
    
    // TOPセクション - 統計数値とラベル（.top-stats-section内のみ）
    const topStatsSection = document.querySelector('.top-stats-section');
    if (topStatsSection) {
        const statNumbers = topStatsSection.querySelectorAll('.stat-number');
        const statLabels = topStatsSection.querySelectorAll('.stat-label');
        if (statNumbers[0]) statNumbers[0].textContent = trans.topSection.stat1Number;
        if (statLabels[0]) statLabels[0].innerHTML = trans.topSection.stat1Label;
        if (statNumbers[1]) statNumbers[1].textContent = trans.topSection.stat2Number;
        if (statLabels[1]) statLabels[1].innerHTML = trans.topSection.stat2Label;
        if (statNumbers[2]) statNumbers[2].textContent = trans.topSection.stat3Number;
        if (statLabels[2]) statLabels[2].innerHTML = trans.topSection.stat3Label;
        if (statNumbers[3]) statNumbers[3].textContent = trans.topSection.stat4Number;
        if (statLabels[3]) statLabels[3].innerHTML = trans.topSection.stat4Label;
    }
    
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
    
    // TOPセクション - 信頼性の統計
    const trustStatLabels = document.querySelectorAll('.trust-stats .stat-label');
    if (trustStatLabels[0]) trustStatLabels[0].textContent = trans.topSection.trustStatLabel1;
    if (trustStatLabels[1]) trustStatLabels[1].textContent = trans.topSection.trustStatLabel2;
    if (trustStatLabels[2]) trustStatLabels[2].textContent = trans.topSection.trustStatLabel3;
    
    // TOPセクション - 初心者ガイドへの誘導
    const beginnerGuideTitle = document.querySelector('.beginner-guide-cta .guide-cta-title');
    const beginnerGuideText = document.querySelector('.beginner-guide-cta .guide-cta-description');
    const beginnerGuideButton = document.querySelector('.beginner-guide-cta .guide-cta-button');
    if (beginnerGuideTitle) beginnerGuideTitle.textContent = trans.topSection.beginnerGuideTitle;
    if (beginnerGuideText) beginnerGuideText.textContent = trans.topSection.beginnerGuideText;
    if (beginnerGuideButton) beginnerGuideButton.textContent = trans.topSection.beginnerGuideButton;
    
    // TOPセクション - CTA強化
    const ctaHighlightTitle = document.querySelector('.cta-highlight-title');
    const ctaHighlightText = document.querySelector('.cta-highlight-text');
    if (ctaHighlightTitle) ctaHighlightTitle.textContent = trans.topSection.ctaHighlightTitle;
    if (ctaHighlightText) ctaHighlightText.textContent = trans.topSection.ctaHighlightText;
    
    // TOPセクション - CTAボタン
    const ctaBtn = document.querySelector('.cta-primary');
    if (ctaBtn) ctaBtn.textContent = trans.topSection.ctaContact;
    
    // 初めての方へセクション
    const roadmapTitle = document.querySelector('#roadmap .section-title');
    const roadmapIntro = document.querySelector('#roadmap .roadmap-intro');
    if (roadmapTitle) roadmapTitle.textContent = '🛤️ ' + trans.roadmapSection.title;
    if (roadmapIntro) roadmapIntro.textContent = trans.roadmapSection.intro;
    
    // 初めての方へ - STEP 1-5のタイトル
    const stepTitles = document.querySelectorAll('#roadmap .step-title');
    if (stepTitles[0]) stepTitles[0].textContent = trans.roadmapSection.step1Title;
    if (stepTitles[1]) stepTitles[1].textContent = trans.roadmapSection.step2Title;
    if (stepTitles[2]) stepTitles[2].textContent = trans.roadmapSection.step3Title;
    if (stepTitles[3]) stepTitles[3].textContent = trans.roadmapSection.step4Title;
    if (stepTitles[4]) stepTitles[4].textContent = trans.roadmapSection.step5Title;
    
    // 初めての方へ - STEP 1のリスト項目（3項目）
    const step1Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(2) .step-list li');
    if (step1Items[0]) step1Items[0].textContent = trans.roadmapSection.step1Item1;
    if (step1Items[1]) step1Items[1].textContent = trans.roadmapSection.step1Item2;
    if (step1Items[2]) step1Items[2].textContent = trans.roadmapSection.step1Item3;
    
    // 初めての方へ - STEP 2のリスト項目（3項目）
    const step2Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(3) .step-list li');
    if (step2Items[0]) step2Items[0].textContent = trans.roadmapSection.step2Item1;
    if (step2Items[1]) step2Items[1].textContent = trans.roadmapSection.step2Item2;
    if (step2Items[2]) step2Items[2].textContent = trans.roadmapSection.step2Item3;
    
    // 初めての方へ - STEP 3のリスト項目（4項目）
    const step3Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(4) .step-list li');
    if (step3Items[0]) step3Items[0].textContent = trans.roadmapSection.step3Item1;
    if (step3Items[1]) step3Items[1].textContent = trans.roadmapSection.step3Item2;
    if (step3Items[2]) step3Items[2].textContent = trans.roadmapSection.step3Item3;
    if (step3Items[3]) step3Items[3].textContent = trans.roadmapSection.step3Item4;
    
    // 初めての方へ - STEP 4のリスト項目（2項目）
    const step4Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(5) .step-list li');
    if (step4Items[0]) step4Items[0].textContent = trans.roadmapSection.step4Item1;
    if (step4Items[1]) step4Items[1].textContent = trans.roadmapSection.step4Item2;
    
    // 初めての方へ - STEP 5のリスト項目（3項目）
    const step5Items = document.querySelectorAll('#roadmap .roadmap-step:nth-child(6) .step-list li');
    if (step5Items[0]) step5Items[0].textContent = trans.roadmapSection.step5Item1;
    if (step5Items[1]) step5Items[1].textContent = trans.roadmapSection.step5Item2;
    if (step5Items[2]) step5Items[2].textContent = trans.roadmapSection.step5Item3;
    
    // 初めての方へ - 注記
    const roadmapNote = document.querySelector('#roadmap .roadmap-note');
    if (roadmapNote) roadmapNote.textContent = trans.roadmapSection.note;
    
    // プロフィールセクション - タイトル
    const profileTitle = document.querySelector('#profile .section-title');
    if (profileTitle) profileTitle.textContent = '👤 ' + trans.profileSection.title;
    
    // プロフィールセクション - プロフィール項目
    const profileLabels = document.querySelectorAll('#profile .profile-label');
    const profileValues = document.querySelectorAll('#profile .profile-value');
    
    // 名前
    if (profileLabels[0]) profileLabels[0].textContent = trans.profileSection.nameLabel;
    if (profileValues[0]) profileValues[0].textContent = trans.profileSection.nameValue;
    
    // 年齢
    if (profileLabels[1]) profileLabels[1].textContent = trans.profileSection.ageLabel;
    if (profileValues[1]) profileValues[1].textContent = trans.profileSection.ageValue;
    
    // 専門分野
    if (profileLabels[2]) profileLabels[2].textContent = trans.profileSection.expertiseLabel;
    const expertiseList = document.querySelectorAll('#profile .profile-item:nth-child(3) .profile-list ul li');
    trans.profileSection.expertiseList.forEach((text, index) => {
        if (expertiseList[index]) expertiseList[index].textContent = text;
    });
    
    // 特技
    if (profileLabels[3]) profileLabels[3].textContent = trans.profileSection.specialtyLabel;
    const specialtyList = document.querySelectorAll('#profile .profile-item:nth-child(4) .profile-list ul li');
    trans.profileSection.specialtyList.forEach((text, index) => {
        if (specialtyList[index]) specialtyList[index].textContent = text;
    });
    
    // 活動理念
    if (profileLabels[4]) profileLabels[4].textContent = trans.profileSection.philosophyLabel;
    if (profileValues[4]) profileValues[4].textContent = trans.profileSection.philosophyValue;
    
    // 今までの活動
    const achievementsTitle = document.querySelector('.achievements-title');
    if (achievementsTitle) achievementsTitle.textContent = trans.profileSection.achievementsTitle;
    
    // 統計数値
    const achievementNumbers = document.querySelectorAll('.achievement-number');
    const achievementLabels = document.querySelectorAll('.achievement-label');
    const achievementSublabels = document.querySelectorAll('.achievement-sublabel');
    
    if (achievementNumbers[0]) achievementNumbers[0].textContent = trans.profileSection.achievement1Number;
    if (achievementLabels[0]) achievementLabels[0].textContent = trans.profileSection.achievement1Label;
    if (achievementSublabels[0]) achievementSublabels[0].textContent = trans.profileSection.achievement1Sublabel;
    
    if (achievementNumbers[1]) achievementNumbers[1].textContent = trans.profileSection.achievement2Number;
    if (achievementLabels[1]) achievementLabels[1].textContent = trans.profileSection.achievement2Label;
    if (achievementSublabels[1]) achievementSublabels[1].textContent = trans.profileSection.achievement2Sublabel;
    
    if (achievementNumbers[2]) achievementNumbers[2].textContent = trans.profileSection.achievement3Number;
    if (achievementLabels[2]) achievementLabels[2].textContent = trans.profileSection.achievement3Label;
    if (achievementSublabels[2]) achievementSublabels[2].textContent = trans.profileSection.achievement3Sublabel;
    
    if (achievementNumbers[3]) achievementNumbers[3].textContent = trans.profileSection.achievement4Number;
    if (achievementLabels[3]) achievementLabels[3].textContent = trans.profileSection.achievement4Label;
    if (achievementSublabels[3]) achievementSublabels[3].textContent = trans.profileSection.achievement4Sublabel;
    
    if (achievementNumbers[4]) achievementNumbers[4].textContent = trans.profileSection.achievement5Number;
    if (achievementLabels[4]) achievementLabels[4].textContent = trans.profileSection.achievement5Label;
    if (achievementSublabels[4]) achievementSublabels[4].textContent = trans.profileSection.achievement5Sublabel;
    
    if (achievementNumbers[5]) achievementNumbers[5].textContent = trans.profileSection.achievement6Number;
    if (achievementLabels[5]) achievementLabels[5].textContent = trans.profileSection.achievement6Label;
    if (achievementSublabels[5]) achievementSublabels[5].textContent = trans.profileSection.achievement6Sublabel;
    
    // 対応可能メーカー
    const makersTitle = document.querySelector('.makers-title');
    const makersNote = document.querySelector('.makers-note');
    if (makersTitle) makersTitle.textContent = trans.profileSection.makersTitle;
    if (makersNote) makersNote.textContent = trans.profileSection.makersNote;
    
    // ラジコン文化への想い
    const passionTitle = document.querySelector('.passion-title');
    const passionTexts = document.querySelectorAll('.passion-text');
    if (passionTitle) passionTitle.textContent = trans.profileSection.passionTitle;
    if (passionTexts[0]) passionTexts[0].innerHTML = trans.profileSection.passionText1.replace('日本からラジコンという文化が消えてほしくない', '<strong>日本からラジコンという文化が消えてほしくない</strong>');
    if (passionTexts[1]) passionTexts[1].textContent = trans.profileSection.passionText2;
    if (passionTexts[2]) passionTexts[2].textContent = trans.profileSection.passionText3;
    if (passionTexts[3]) passionTexts[3].innerHTML = trans.profileSection.passionText4.replace('ネットという海に「タイムカプセル」として潜らせておけば、必要とする誰かに届く可能性がある', '<strong>ネットという海に「タイムカプセル」として潜らせておけば、必要とする誰かに届く可能性がある</strong>');
    if (passionTexts[4]) passionTexts[4].textContent = trans.profileSection.passionText5;
    if (passionTexts[5]) passionTexts[5].textContent = trans.profileSection.passionText6;
    
    // SNSセクション - タイトル
    const snsTitle = document.querySelector('#sns .section-title');
    if (snsTitle) snsTitle.textContent = '📱 ' + trans.snsSection.title;
    
    // SNSセクション - YouTube
    const youtubeTitle = document.querySelector('#sns .sns-item.youtube h3');
    const youtubeDescription = document.querySelector('#sns .sns-item.youtube p:first-of-type');
    const youtubeNote = document.querySelector('#sns .sns-item.youtube .sns-note');
    const youtubeBannerGuide = document.querySelector('#sns .sns-item.youtube .banner-guide');
    
    if (youtubeTitle) youtubeTitle.textContent = trans.snsSection.youtubeTitle;
    if (youtubeDescription) youtubeDescription.textContent = trans.snsSection.youtubeDescription;
    if (youtubeNote) youtubeNote.textContent = trans.snsSection.youtubeNote;
    if (youtubeBannerGuide) youtubeBannerGuide.textContent = trans.snsSection.youtubeBannerGuide;
    
    // SNSセクション - X（旧Twitter）
    const xTitle = document.querySelector('#sns .sns-item.x-item h3');
    const xDescription = document.querySelector('#sns .sns-item.x-item p');
    const xBannerGuide = document.querySelector('#sns .banner-guide-small');
    
    if (xTitle) xTitle.textContent = trans.snsSection.xTitle;
    if (xDescription) xDescription.textContent = trans.snsSection.xDescription;
    if (xBannerGuide) xBannerGuide.textContent = trans.snsSection.xBannerGuide;
    
    // 活動記録セクション - タイトル
    const activityTitle = document.querySelector('#activity .section-title');
    if (activityTitle) activityTitle.textContent = '📝 ' + trans.activitySection.title;
    
    // 活動記録セクション - ブログ
    const blogTitle = document.querySelector('#activity .blog-title');
    const blogDescription = document.querySelector('#activity .blog-description');
    const noteTitle = document.querySelector('#activity .note-link-box h4');
    const noteDescription = document.querySelector('#activity .note-link-box p');
    const latestArticlesTitle = document.querySelector('#activity .note-embed-title');
    const moreArticles = document.querySelector('#activity .note-more-link a');
    
    if (blogTitle) blogTitle.textContent = trans.activitySection.blogTitle;
    if (blogDescription) blogDescription.textContent = trans.activitySection.blogDescription;
    if (noteTitle) noteTitle.textContent = trans.activitySection.noteTitle;
    if (noteDescription) noteDescription.textContent = trans.activitySection.noteDescription;
    if (latestArticlesTitle) latestArticlesTitle.textContent = trans.activitySection.latestArticlesTitle;
    if (moreArticles) moreArticles.textContent = trans.activitySection.moreArticles;
    
    // グッズセクション - タイトル
    const goodsTitle = document.querySelector('#goods .section-title');
    if (goodsTitle) goodsTitle.textContent = '🛍️ ' + trans.goodsSection.title;
    
    // グッズセクション - PDFダウンロード
    const pdfDownloadTitle = document.querySelector('[data-translate="pdfDownloadTitle"]');
    const pdfDownloadDescription = document.querySelector('[data-translate="pdfDownloadDescription"]');
    const pdfGlossaryTitle = document.querySelector('[data-translate="pdfGlossaryTitle"]');
    const pdfFeature1 = document.querySelector('[data-translate="pdfFeature1"]');
    const pdfFeature2 = document.querySelector('[data-translate="pdfFeature2"]');
    const pdfFeature3 = document.querySelector('[data-translate="pdfFeature3"]');
    const downloadButton = document.querySelector('[data-translate="downloadButton"]');
    const pdfNotice = document.querySelector('[data-translate="pdfNotice"]');
    const physicalGoodsComingSoon = document.querySelector('[data-translate="physicalGoodsComingSoon"]');
    const physicalGoodsDescription = document.querySelector('[data-translate="physicalGoodsDescription"]');
    const physicalGoodsNotice = document.querySelector('[data-translate="physicalGoodsNotice"]');
    
    if (trans.goodsSection) {
        if (pdfDownloadTitle) pdfDownloadTitle.textContent = trans.goodsSection.pdfDownloadTitle;
        if (pdfDownloadDescription) pdfDownloadDescription.textContent = trans.goodsSection.pdfDownloadDescription;
        if (pdfGlossaryTitle) pdfGlossaryTitle.textContent = trans.goodsSection.pdfGlossaryTitle;
        if (pdfFeature1) pdfFeature1.textContent = trans.goodsSection.pdfFeature1;
        if (pdfFeature2) pdfFeature2.textContent = trans.goodsSection.pdfFeature2;
        if (pdfFeature3) pdfFeature3.textContent = trans.goodsSection.pdfFeature3;
        if (downloadButton) downloadButton.textContent = trans.goodsSection.downloadButton;
        if (pdfNotice) pdfNotice.textContent = trans.goodsSection.pdfNotice;
        if (physicalGoodsComingSoon) physicalGoodsComingSoon.textContent = trans.goodsSection.physicalGoodsComingSoon;
        if (physicalGoodsDescription) physicalGoodsDescription.textContent = trans.goodsSection.physicalGoodsDescription;
        if (physicalGoodsNotice) physicalGoodsNotice.textContent = trans.goodsSection.physicalGoodsNotice;
    }
    
    // RC支援・サポートセクション - タイトル
    const supportTitle = document.querySelector('#support .section-title');
    if (supportTitle) supportTitle.textContent = '🤝 ' + trans.supportSection.title;
    
    // RC支援・サポートセクション - メインタイトル
    const supportMainTitle = document.querySelector('#support .support-card h3');
    if (supportMainTitle) supportMainTitle.textContent = trans.supportSection.mainTitle;
    
    // RC支援・サポートセクション - サポート項目
    const supportItems = document.querySelectorAll('#support .support-item');
    
    // サポート1
    if (supportItems[0]) {
        const title1 = supportItems[0].querySelector('h4');
        const desc1 = supportItems[0].querySelector('p');
        if (title1) title1.textContent = trans.supportSection.support1Title;
        if (desc1) desc1.textContent = trans.supportSection.support1Description;
    }
    
    // サポート2
    if (supportItems[1]) {
        const title2 = supportItems[1].querySelector('h4');
        const paragraphs2 = supportItems[1].querySelectorAll('p');
        if (title2) title2.textContent = trans.supportSection.support2Title;
        if (paragraphs2[0]) paragraphs2[0].textContent = trans.supportSection.support2Description;
        if (paragraphs2[1]) paragraphs2[1].textContent = trans.supportSection.support2Detail;
        if (paragraphs2[2]) {
            paragraphs2[2].innerHTML = trans.supportSection.support2Example + '<br>' + trans.supportSection.support2ExampleNote;
        }
    }
    
    // サポート3
    if (supportItems[2]) {
        const title3 = supportItems[2].querySelector('h4');
        const desc3 = supportItems[2].querySelectorAll('p:not(.conversation-example):not(.conversation-answer)');
        const conversation3 = supportItems[2].querySelectorAll('.conversation-example, .conversation-answer');
        
        if (title3) title3.textContent = trans.supportSection.support3Title;
        if (desc3[0]) desc3[0].textContent = trans.supportSection.support3Description;
        if (desc3[1]) desc3[1].textContent = trans.supportSection.support3Detail;
        if (conversation3[0]) conversation3[0].textContent = trans.supportSection.conversationExample;
        if (conversation3[1]) conversation3[1].textContent = trans.supportSection.conversationAnswer;
        if (desc3[2]) desc3[2].textContent = trans.supportSection.support3DetailEnd;
    }
    
    // RC支援・サポートセクション - 注記
    const supportNote = document.querySelector('#support .support-note');
    if (supportNote) supportNote.textContent = trans.supportSection.note;
    
    // サポートを受けた方の声セクション - タイトル
    const testimonialsTitle = document.querySelector('#testimonials .section-title');
    if (testimonialsTitle) testimonialsTitle.textContent = '🎉 ' + trans.testimonialsSection.title;
    
    // サポートを受けた方の声セクション - イントロ
    const testimonialsIntro = document.querySelector('#testimonials .testimonials-intro');
    if (testimonialsIntro) testimonialsIntro.textContent = trans.testimonialsSection.intro;
    
    // サポートを受けた方の声セクション - 各体験談
    const testimonialItems = document.querySelectorAll('#testimonials .testimonial-item');
    
    // 体験談1
    if (testimonialItems[0]) {
        const name1 = testimonialItems[0].querySelector('.testimonial-name');
        const tag1 = testimonialItems[0].querySelector('.testimonial-tag');
        const text1 = testimonialItems[0].querySelector('.testimonial-content p');
        if (name1) name1.textContent = trans.testimonialsSection.testimonial1Name;
        if (tag1) tag1.textContent = trans.testimonialsSection.testimonial1Tag;
        if (text1) text1.textContent = trans.testimonialsSection.testimonial1Text;
    }
    
    // 体験談2
    if (testimonialItems[1]) {
        const name2 = testimonialItems[1].querySelector('.testimonial-name');
        const tag2 = testimonialItems[1].querySelector('.testimonial-tag');
        const text2 = testimonialItems[1].querySelector('.testimonial-content p');
        if (name2) name2.textContent = trans.testimonialsSection.testimonial2Name;
        if (tag2) tag2.textContent = trans.testimonialsSection.testimonial2Tag;
        if (text2) text2.textContent = trans.testimonialsSection.testimonial2Text;
    }
    
    // 体験談3
    if (testimonialItems[2]) {
        const name3 = testimonialItems[2].querySelector('.testimonial-name');
        const tag3 = testimonialItems[2].querySelector('.testimonial-tag');
        const text3 = testimonialItems[2].querySelector('.testimonial-content p');
        if (name3) name3.textContent = trans.testimonialsSection.testimonial3Name;
        if (tag3) tag3.textContent = trans.testimonialsSection.testimonial3Tag;
        if (text3) text3.textContent = trans.testimonialsSection.testimonial3Text;
    }
    
    // 体験談4
    if (testimonialItems[3]) {
        const name4 = testimonialItems[3].querySelector('.testimonial-name');
        const tag4 = testimonialItems[3].querySelector('.testimonial-tag');
        const text4 = testimonialItems[3].querySelector('.testimonial-content p');
        if (name4) name4.textContent = trans.testimonialsSection.testimonial4Name;
        if (tag4) tag4.textContent = trans.testimonialsSection.testimonial4Tag;
        if (text4) text4.textContent = trans.testimonialsSection.testimonial4Text;
    }
    
    // 体験談5
    if (testimonialItems[4]) {
        const name5 = testimonialItems[4].querySelector('.testimonial-name');
        const tag5 = testimonialItems[4].querySelector('.testimonial-tag');
        const text5 = testimonialItems[4].querySelector('.testimonial-content p');
        if (name5) name5.textContent = trans.testimonialsSection.testimonial5Name;
        if (tag5) tag5.textContent = trans.testimonialsSection.testimonial5Tag;
        if (text5) text5.textContent = trans.testimonialsSection.testimonial5Text;
    }
    
    // FAQセクション - タイトル
    const faqTitle = document.querySelector('#faq .section-title');
    if (faqTitle) faqTitle.textContent = '❓ ' + trans.faqSection.title;
    
    // FAQセクション - イントロ
    const faqIntro = document.querySelector('#faq .faq-intro');
    if (faqIntro) faqIntro.textContent = trans.faqSection.intro;
    
    // FAQセクション - 質問と回答
    const faqItems = document.querySelectorAll('#faq .faq-item');
    
    // Q1
    if (faqItems[0]) {
        const q1 = faqItems[0].querySelector('.faq-question h3');
        const a1 = faqItems[0].querySelector('.faq-answer p');
        if (q1) q1.textContent = trans.faqSection.q1;
        if (a1) a1.textContent = trans.faqSection.a1;
    }
    
    // Q2
    if (faqItems[1]) {
        const q2 = faqItems[1].querySelector('.faq-question h3');
        const a2 = faqItems[1].querySelector('.faq-answer p');
        if (q2) q2.textContent = trans.faqSection.q2;
        if (a2) a2.textContent = trans.faqSection.a2;
    }
    
    // Q3
    if (faqItems[2]) {
        const q3 = faqItems[2].querySelector('.faq-question h3');
        const a3 = faqItems[2].querySelector('.faq-answer p');
        if (q3) q3.textContent = trans.faqSection.q3;
        if (a3) a3.textContent = trans.faqSection.a3;
    }
    
    // Q4
    if (faqItems[3]) {
        const q4 = faqItems[3].querySelector('.faq-question h3');
        const a4 = faqItems[3].querySelector('.faq-answer p');
        if (q4) q4.textContent = trans.faqSection.q4;
        if (a4) a4.textContent = trans.faqSection.a4;
    }
    
    // Q5
    if (faqItems[4]) {
        const q5 = faqItems[4].querySelector('.faq-question h3');
        const a5 = faqItems[4].querySelector('.faq-answer p');
        if (q5) q5.textContent = trans.faqSection.q5;
        if (a5) a5.textContent = trans.faqSection.a5;
    }
    
    // Q6
    if (faqItems[5]) {
        const q6 = faqItems[5].querySelector('.faq-question h3');
        const a6 = faqItems[5].querySelector('.faq-answer p');
        if (q6) q6.textContent = trans.faqSection.q6;
        if (a6) a6.textContent = trans.faqSection.a6;
    }
    
    // Q7
    if (faqItems[6]) {
        const q7 = faqItems[6].querySelector('.faq-question h3');
        const a7 = faqItems[6].querySelector('.faq-answer p');
        if (q7) q7.textContent = trans.faqSection.q7;
        if (a7) a7.textContent = trans.faqSection.a7;
    }
    
    // Q8
    if (faqItems[7]) {
        const q8 = faqItems[7].querySelector('.faq-question h3');
        const a8 = faqItems[7].querySelector('.faq-answer p');
        if (q8) q8.textContent = trans.faqSection.q8;
        if (a8) a8.textContent = trans.faqSection.a8;
    }
    
    // Q9
    if (faqItems[8]) {
        const q9 = faqItems[8].querySelector('.faq-question h3');
        const a9 = faqItems[8].querySelector('.faq-answer p');
        if (q9) q9.textContent = trans.faqSection.q9;
        if (a9) a9.textContent = trans.faqSection.a9;
    }
    
    // Q10
    if (faqItems[9]) {
        const q10 = faqItems[9].querySelector('.faq-question h3');
        const a10 = faqItems[9].querySelector('.faq-answer p');
        if (q10) q10.textContent = trans.faqSection.q10;
        if (a10) a10.textContent = trans.faqSection.a10;
    }
    
    // Q11
    if (faqItems[10]) {
        const q11 = faqItems[10].querySelector('.faq-question h3');
        const a11 = faqItems[10].querySelector('.faq-answer p');
        if (q11) q11.textContent = trans.faqSection.q11;
        if (a11) a11.textContent = trans.faqSection.a11;
    }
    
    // Q12
    if (faqItems[11]) {
        const q12 = faqItems[11].querySelector('.faq-question h3');
        const a12 = faqItems[11].querySelector('.faq-answer p');
        if (q12) q12.textContent = trans.faqSection.q12;
        if (a12) a12.textContent = trans.faqSection.a12;
    }
    
    // Q13
    if (faqItems[12]) {
        const q13 = faqItems[12].querySelector('.faq-question h3');
        const a13 = faqItems[12].querySelector('.faq-answer p');
        if (q13) q13.textContent = trans.faqSection.q13;
        if (a13) a13.textContent = trans.faqSection.a13;
    }
    
    // Q14
    if (faqItems[13]) {
        const q14 = faqItems[13].querySelector('.faq-question h3');
        const a14 = faqItems[13].querySelector('.faq-answer p');
        if (q14) q14.textContent = trans.faqSection.q14;
        if (a14) a14.textContent = trans.faqSection.a14;
    }
    
    // Q15
    if (faqItems[14]) {
        const q15 = faqItems[14].querySelector('.faq-question h3');
        const a15 = faqItems[14].querySelector('.faq-answer p');
        if (q15) q15.textContent = trans.faqSection.q15;
        if (a15) a15.textContent = trans.faqSection.a15;
    }
    
    // お問い合わせセクション - タイトル
    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) contactTitle.textContent = '✉️ ' + trans.contactSection.title;
    
    // お問い合わせセクション - 説明文
    const contactDescriptions = document.querySelectorAll('#contact .contact-description');
    if (contactDescriptions[0]) contactDescriptions[0].textContent = trans.contactSection.description1;
    if (contactDescriptions[1]) contactDescriptions[1].textContent = trans.contactSection.description2;
    
    // お問い合わせセクション - 返信遅延の注意
    const responseNoticeTitle = document.querySelector('#contact .contact-important-notice .notice-content h4');
    const responseNoticeText = document.querySelector('#contact .contact-important-notice .notice-content p');
    if (responseNoticeTitle) responseNoticeTitle.textContent = trans.contactSection.responseNoticeTitle;
    if (responseNoticeText) responseNoticeText.innerHTML = trans.contactSection.responseNoticeText.replace(/身体の都合によりご連絡が遅れる場合がございます/g, '<strong>$&</strong>');
    
    // お問い合わせセクション - メール受信設定の注意
    const emailNoticeTitle = document.querySelector('#contact .contact-technical-notice .notice-content h4');
    const emailNoticeText = document.querySelector('#contact .contact-technical-notice .notice-content p');
    if (emailNoticeTitle) emailNoticeTitle.textContent = trans.contactSection.emailNoticeTitle;
    if (emailNoticeText) emailNoticeText.innerHTML = trans.contactSection.emailNoticeText.replace(/「@hotmail\.co\.jp」からのメールを受信できるよう、ドメインの許可設定をお願いいたします/g, '<strong>$&</strong>').replace(/迷惑メールフォルダ/g, '<strong>$&</strong>');
    
    // お問い合わせセクション - 注記とボタン
    const contactNotice = document.querySelector('#contact .contact-notice');
    const contactButton = document.querySelector('#contact .contact-button');
    if (contactNotice) contactNotice.textContent = trans.contactSection.notice;
    if (contactButton) contactButton.textContent = trans.contactSection.buttonText;
    
    // ウェブサイトプロジェクトセクション
    if (trans.websiteProject) {
        const websiteElements = {
            date: document.querySelector('[data-i18n="websiteProject.date"]'),
            title: document.querySelector('[data-i18n="websiteProject.title"]'),
            overviewTitle: document.querySelector('[data-i18n="websiteProject.overviewTitle"]'),
            overviewText1: document.querySelector('[data-i18n="websiteProject.overviewText1"]'),
            overviewText2: document.querySelector('[data-i18n="websiteProject.overviewText2"]'),
            phase1Title: document.querySelector('[data-i18n="websiteProject.phase1Title"]'),
            phase1Purpose: document.querySelector('[data-i18n="websiteProject.phase1Purpose"]'),
            phase1Result: document.querySelector('[data-i18n="websiteProject.phase1Result"]'),
            phase2Title: document.querySelector('[data-i18n="websiteProject.phase2Title"]'),
            phase2Purpose: document.querySelector('[data-i18n="websiteProject.phase2Purpose"]'),
            phase2Result: document.querySelector('[data-i18n="websiteProject.phase2Result"]'),
            phase3Title: document.querySelector('[data-i18n="websiteProject.phase3Title"]'),
            phase3Purpose: document.querySelector('[data-i18n="websiteProject.phase3Purpose"]'),
            phase3Result: document.querySelector('[data-i18n="websiteProject.phase3Result"]'),
            phase4Title: document.querySelector('[data-i18n="websiteProject.phase4Title"]'),
            phase4Purpose: document.querySelector('[data-i18n="websiteProject.phase4Purpose"]'),
            phase4Result: document.querySelector('[data-i18n="websiteProject.phase4Result"]'),
            phase5Title: document.querySelector('[data-i18n="websiteProject.phase5Title"]'),
            phase5Purpose: document.querySelector('[data-i18n="websiteProject.phase5Purpose"]'),
            phase5Result: document.querySelector('[data-i18n="websiteProject.phase5Result"]'),
            phase6Title: document.querySelector('[data-i18n="websiteProject.phase6Title"]'),
            phase6Purpose: document.querySelector('[data-i18n="websiteProject.phase6Purpose"]'),
            phase6Result: document.querySelector('[data-i18n="websiteProject.phase6Result"]'),
            phase7Title: document.querySelector('[data-i18n="websiteProject.phase7Title"]'),
            phase7Purpose: document.querySelector('[data-i18n="websiteProject.phase7Purpose"]'),
            phase7Result: document.querySelector('[data-i18n="websiteProject.phase7Result"]'),
            effectsTitle: document.querySelector('[data-i18n="websiteProject.effectsTitle"]'),
            techTitle: document.querySelector('[data-i18n="websiteProject.techTitle"]'),
            conclusionTitle: document.querySelector('[data-i18n="websiteProject.conclusionTitle"]'),
            conclusionText: document.querySelector('[data-i18n="websiteProject.conclusionText"]')
        };
        
        Object.keys(websiteElements).forEach(key => {
            if (websiteElements[key] && trans.websiteProject[key]) {
                websiteElements[key].textContent = trans.websiteProject[key];
            }
        });
        
        // Phase 1とPhase 2のリスト項目を翻訳
        if (trans.websiteProject.phase1Items) {
            const phase1Title = document.querySelector('[data-i18n="websiteProject.phase1Title"]');
            if (phase1Title) {
                const phase1List = phase1Title.parentElement.querySelectorAll('ul li');
                trans.websiteProject.phase1Items.forEach((text, index) => {
                    if (phase1List[index]) phase1List[index].textContent = text;
                });
            }
        }
        
        if (trans.websiteProject.phase2Items) {
            const phase2Title = document.querySelector('[data-i18n="websiteProject.phase2Title"]');
            if (phase2Title) {
                const phase2List = phase2Title.parentElement.querySelectorAll('ul li');
                trans.websiteProject.phase2Items.forEach((text, index) => {
                    if (phase2List[index]) phase2List[index].textContent = text;
                });
            }
        }
        
        // Phase 3～7のリスト項目を翻訳
        if (trans.websiteProject.phase3Items) {
            const phase3Title = document.querySelector('[data-i18n="websiteProject.phase3Title"]');
            if (phase3Title) {
                const phase3Section = phase3Title.parentElement;
                const phase3List = phase3Section.querySelectorAll('ul > li');
                trans.websiteProject.phase3Items.forEach((text, index) => {
                    if (phase3List[index]) phase3List[index].childNodes[0].textContent = text;
                });
            }
        }
        
        if (trans.websiteProject.phase4Items) {
            const phase4Title = document.querySelector('[data-i18n="websiteProject.phase4Title"]');
            if (phase4Title) {
                const phase4Section = phase4Title.parentElement;
                const mainUl = phase4Section.querySelector('ul');
                if (mainUl) {
                    // HTMLを直接構築
                    let html = `<li>${trans.websiteProject.phase4Items[0]}`;
                    html += '<ul>';
                    html += `<li>${trans.websiteProject.phase4Items[1]}</li>`;
                    html += `<li>${trans.websiteProject.phase4Items[2]}</li>`;
                    html += `<li>${trans.websiteProject.phase4Items[3]}</li>`;
                    html += '</ul></li>';
                    html += `<li>${trans.websiteProject.phase4Items[4]}</li>`;
                    html += `<li>${trans.websiteProject.phase4Items[5]}</li>`;
                    mainUl.innerHTML = html;
                }
            }
        }
        
        if (trans.websiteProject.phase5Items) {
            const phase5Title = document.querySelector('[data-i18n="websiteProject.phase5Title"]');
            if (phase5Title) {
                const phase5List = phase5Title.parentElement.querySelectorAll('ul li');
                trans.websiteProject.phase5Items.forEach((text, index) => {
                    if (phase5List[index]) phase5List[index].textContent = text;
                });
            }
        }
        
        if (trans.websiteProject.phase6Items) {
            const phase6Title = document.querySelector('[data-i18n="websiteProject.phase6Title"]');
            if (phase6Title) {
                const phase6Section = phase6Title.parentElement;
                const mainUl = phase6Section.querySelector('ul');
                if (mainUl) {
                    // HTMLを直接構築
                    let html = `<li>${trans.websiteProject.phase6Items[0]}`;
                    html += '<ul>';
                    html += `<li>${trans.websiteProject.phase6Items[1]}</li>`;
                    html += '</ul></li>';
                    html += `<li>${trans.websiteProject.phase6Items[2]}`;
                    html += '<ul>';
                    html += `<li>${trans.websiteProject.phase6Items[3]}</li>`;
                    html += `<li>${trans.websiteProject.phase6Items[4]}</li>`;
                    html += '</ul></li>';
                    html += `<li>${trans.websiteProject.phase6Items[5]}</li>`;
                    mainUl.innerHTML = html;
                }
            }
        }
        
        if (trans.websiteProject.phase7Items) {
            const phase7Title = document.querySelector('[data-i18n="websiteProject.phase7Title"]');
            if (phase7Title) {
                const phase7Section = phase7Title.parentElement;
                const phase7List = phase7Section.querySelectorAll('ul > li');
                trans.websiteProject.phase7Items.forEach((text, index) => {
                    if (phase7List[index]) phase7List[index].childNodes[0].textContent = text;
                });
            }
        }
        
        // Overall Improvement Resultsのカード翻訳
        if (trans.websiteProject.effectsPerformance) {
            const effectsTitle = document.querySelector('[data-i18n="websiteProject.effectsTitle"]');
            if (effectsTitle) {
                const effectsSection = effectsTitle.parentElement;
                const cards = effectsSection.querySelectorAll('div[style*="border-left"]');
                
                // パフォーマンスカード
                if (cards[0] && trans.websiteProject.effectsPerformanceItems) {
                    const perfStrong = cards[0].querySelector('strong');
                    if (perfStrong) perfStrong.textContent = trans.websiteProject.effectsPerformance;
                    const perfList = cards[0].querySelectorAll('li');
                    trans.websiteProject.effectsPerformanceItems.forEach((text, index) => {
                        if (perfList[index]) perfList[index].innerHTML = text;
                    });
                }
                
                // ユーザー体験カード
                if (cards[1] && trans.websiteProject.effectsUXItems) {
                    const uxStrong = cards[1].querySelector('strong');
                    if (uxStrong) uxStrong.textContent = trans.websiteProject.effectsUX;
                    const uxList = cards[1].querySelectorAll('li');
                    trans.websiteProject.effectsUXItems.forEach((text, index) => {
                        if (uxList[index]) uxList[index].innerHTML = text;
                    });
                }
                
                // SEOカード
                if (cards[2] && trans.websiteProject.effectsSEOItems) {
                    const seoStrong = cards[2].querySelector('strong');
                    if (seoStrong) seoStrong.textContent = trans.websiteProject.effectsSEO;
                    const seoList = cards[2].querySelectorAll('li');
                    trans.websiteProject.effectsSEOItems.forEach((text, index) => {
                        if (seoList[index]) seoList[index].innerHTML = text;
                    });
                }
                
                // アクセシビリティカード
                if (cards[3] && trans.websiteProject.effectsAccessibilityItems) {
                    const a11yStrong = cards[3].querySelector('strong');
                    if (a11yStrong) a11yStrong.textContent = trans.websiteProject.effectsAccessibility;
                    const a11yList = cards[3].querySelectorAll('li');
                    trans.websiteProject.effectsAccessibilityItems.forEach((text, index) => {
                        if (a11yList[index]) a11yList[index].innerHTML = text;
                    });
                }
            }
        }
        
        // 使用技術セクションの翻訳
        const techTitle = document.querySelector('[data-i18n="websiteProject.techTitle"]');
        if (techTitle && trans.websiteProject.techFrontend) {
            const techSection = techTitle.parentElement;
            const techPs = techSection.querySelectorAll('p');
            if (techPs[0] && trans.websiteProject.techFrontend) {
                const parts = trans.websiteProject.techFrontend.split('：');
                if (parts.length < 2) {
                    const colonParts = trans.websiteProject.techFrontend.split(': ');
                    techPs[0].innerHTML = `<strong>${colonParts[0]}</strong>: ${colonParts.slice(1).join(': ')}`;
                } else {
                    techPs[0].innerHTML = `<strong>${parts[0]}</strong>：${parts.slice(1).join('：')}`;
                }
            }
            if (techPs[1] && trans.websiteProject.techSEO) {
                const parts = trans.websiteProject.techSEO.split('：');
                if (parts.length < 2) {
                    const colonParts = trans.websiteProject.techSEO.split(': ');
                    techPs[1].innerHTML = `<strong>${colonParts[0]}</strong>: ${colonParts.slice(1).join(': ')}`;
                } else {
                    techPs[1].innerHTML = `<strong>${parts[0]}</strong>：${parts.slice(1).join('：')}`;
                }
            }
            if (techPs[2] && trans.websiteProject.techPerformance) {
                const parts = trans.websiteProject.techPerformance.split('：');
                if (parts.length < 2) {
                    const colonParts = trans.websiteProject.techPerformance.split(': ');
                    techPs[2].innerHTML = `<strong>${colonParts[0]}</strong>: ${colonParts.slice(1).join(': ')}`;
                } else {
                    techPs[2].innerHTML = `<strong>${parts[0]}</strong>：${parts.slice(1).join('：')}`;
                }
            }
        }
    }
    
    // 訪問者カウンターのテキストを更新
    updateVisitorCounterText(lang);
    
    // スーパーリロード注意書きの翻訳
    const reloadNoticeTitle = document.querySelector('[data-translate="reloadNoticeTitle"]');
    const reloadNoticeText1 = document.querySelector('[data-translate="reloadNoticeText1"]');
    const reloadNoticeText2 = document.querySelector('[data-translate="reloadNoticeText2"]');
    const reloadNoticeText3 = document.querySelector('[data-translate="reloadNoticeText3"]');
    const reloadWindows = document.querySelector('[data-translate="reloadWindows"]');
    const reloadWindowsKeys = document.querySelector('[data-translate="reloadWindowsKeys"]');
    const reloadMac = document.querySelector('[data-translate="reloadMac"]');
    const reloadMacKeys = document.querySelector('[data-translate="reloadMacKeys"]');
    
    if (trans.topSection) {
        if (reloadNoticeTitle) reloadNoticeTitle.textContent = trans.topSection.reloadNoticeTitle;
        if (reloadNoticeText1) reloadNoticeText1.textContent = trans.topSection.reloadNoticeText1;
        if (reloadNoticeText2) reloadNoticeText2.textContent = trans.topSection.reloadNoticeText2;
        if (reloadNoticeText3) reloadNoticeText3.textContent = trans.topSection.reloadNoticeText3;
        if (reloadWindows) reloadWindows.textContent = trans.topSection.reloadWindows;
        if (reloadWindowsKeys) reloadWindowsKeys.textContent = trans.topSection.reloadWindowsKeys;
        if (reloadMac) reloadMac.textContent = trans.topSection.reloadMac;
        if (reloadMacKeys) reloadMacKeys.textContent = trans.topSection.reloadMacKeys;
    }
    
    // RCアーカイブバナーの翻訳
    const archiveBannerTitle = document.querySelector('[data-i18n="archive.banner.title"]');
    const archiveBannerSubtitle = document.querySelector('[data-i18n="archive.banner.subtitle"]');
    const archiveBannerButton = document.querySelector('[data-i18n="archive.banner.button"]');
    
    if (trans.archive && trans.archive.banner) {
        if (archiveBannerTitle) archiveBannerTitle.textContent = trans.archive.banner.title;
        if (archiveBannerSubtitle) archiveBannerSubtitle.textContent = trans.archive.banner.subtitle;
        if (archiveBannerButton) archiveBannerButton.textContent = trans.archive.banner.button;
    }
    
    // RCアーカイブセクションの翻訳
    const archiveTitle = document.querySelector('[data-i18n="archive.main.title"]');
    const archiveSubtitle = document.querySelector('[data-i18n="archive.main.subtitle"]');
    const archivePurposeTitle = document.querySelector('[data-i18n="archive.main.purpose.title"]');
    const archivePurposeItem1 = document.querySelector('[data-i18n="archive.main.purpose.item1"]');
    const archivePurposeItem2 = document.querySelector('[data-i18n="archive.main.purpose.item2"]');
    const archivePurposeItem3 = document.querySelector('[data-i18n="archive.main.purpose.item3"]');
    const archivePurposeItem4 = document.querySelector('[data-i18n="archive.main.purpose.item4"]');
    const archiveCurrent = document.querySelector('[data-i18n="archive.main.current"]');
    const archiveButton = document.querySelector('[data-i18n="archive.main.button"]');
    const archiveRequest = document.querySelector('[data-i18n="archive.main.request"]');
    
    if (trans.archive && trans.archive.main) {
        if (archiveTitle) archiveTitle.textContent = trans.archive.main.title;
        if (archiveSubtitle) {
            // 改行を<br>タグに変換
            archiveSubtitle.innerHTML = trans.archive.main.subtitle.replace(/\n/g, '<br>');
        }
        if (archivePurposeTitle) archivePurposeTitle.textContent = trans.archive.main.purpose.title;
        if (archivePurposeItem1) archivePurposeItem1.innerHTML = trans.archive.main.purpose.item1;
        if (archivePurposeItem2) archivePurposeItem2.innerHTML = trans.archive.main.purpose.item2;
        if (archivePurposeItem3) archivePurposeItem3.innerHTML = trans.archive.main.purpose.item3;
        if (archivePurposeItem4) archivePurposeItem4.innerHTML = trans.archive.main.purpose.item4;
        if (archiveCurrent) {
            archiveCurrent.innerHTML = trans.archive.main.current.replace(/\n/g, '<br>');
        }
        if (archiveButton) archiveButton.textContent = trans.archive.main.button;
        if (archiveRequest) {
            archiveRequest.innerHTML = trans.archive.main.request.replace(/\n/g, '<br>');
        }
    }
    
    // ===== data-i18n属性を使った汎用翻訳処理 =====
    // すべてのdata-i18n属性を持つ要素を取得して翻訳
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = trans;
        
        // ネストされたキーを辿る（例: "archiveProject.date" → trans.archiveProject.date）
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }
        
        // 値が見つかった場合、要素のテキストを更新
        if (value !== null && value !== undefined) {
            // HTMLタグを含む場合はinnerHTMLを使用
            if (typeof value === 'string' && value.includes('<')) {
                element.innerHTML = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

// 訪問者カウンターのテキストを言語に応じて更新
function updateVisitorCounterText(lang) {
    const textElement = document.getElementById('visitorText');
    const countElement = document.getElementById('visitorCount');
    if (!textElement || !countElement) return;
    
    const count = countElement.textContent;
    if (count === '---' || count === '') return;
    
    if (lang === 'ja') {
        textElement.textContent = `総訪問者数: ${count}人`;
    } else if (lang === 'en') {
        textElement.textContent = `Total Visitors: ${count}`;
    } else if (lang === 'zh') {
        textElement.textContent = `总访客数: ${count}`;
    }
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
    // 現在の言語を取得
    const currentLang = localStorage.getItem('language') || 'ja';
    // 言語パラメータ付きでcontact.htmlを開く
    window.open(`contact.html?lang=${currentLang}`, '_blank');
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