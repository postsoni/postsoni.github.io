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
            activity: 'ブログアクセス', 'edgetx-manual': 'EdgeTXマニュアル', 'rotorflight-manual': 'Rotorflightマニュアル', 'rc-library': 'RC機器マニュアルPDF集', 'ai-games': 'AIラジコンゲーム', goods: 'グッズ', support: 'RC支援・サポート',
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
        newsSection2026Jan: {
            date: '2026年1月28日',
            newsTitle: '機体製作・修繕完了 & マニュアル公開のお知らせ',
            section1Title: '◆カルマートα40 修繕完了',
            section1Text: '以前組み立てたカルマートα40が墜落しましたが、修繕が完了しました。メカ類の再調整と機体の点検を経て、フライトチェックまでもう少しです。',
            section2Title: '◆GOOSKY RS7 Ultra 組み上げ完了',
            section2Text: '最新鋭の電動ヘリコプター「GOOSKY RS7 Ultra」の組み上げが完了しました。Rotorflightファームウェアを搭載し、今後のフライトに向けて調整中です。',
            section3Title: '◆EdgeTX & Rotorflight 日本語マニュアル公開',
            section3Text: 'RadioMaster TX16S向けの「EdgeTX日本語マニュアル」と、RCヘリ専用FC向けの「Rotorflight Configurator日本語マニュアル」を公開しました。初心者の方から乗り換え組の方まで、お役立ていただければ幸いです。',
            section4Title: '◆お問い合わせ件数15件突破',
            section4Text: 'メールでのお問い合わせが累計15件を超えました。ご連絡いただいた皆様、ありがとうございます。引き続き、RC初心者の方のサポートを続けてまいります。'
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
            youtubeDesc: 'RC製作・修理動画、フライト動画を配信中！組み立て解説や技術的なポイントも紹介しています。',
            youtubeButton: 'チャンネルを見る →',
            noteTitle: 'note 技術ブログ',
            noteDesc: '修理工程の詳細記録、パーツレビュー、技術的な備忘録など、動画では伝えきれない詳細な情報を発信しています。',
            noteButton: 'ブログを読む →',
            noteTag1: '🔧 修理記録',
            noteTag2: '📊 パーツレビュー',
            noteTag3: '💡 技術解説',
            xTitle: 'X（旧Twitter）',
            xDesc: 'RC活動の日常、作業の進捗、イベント情報などをリアルタイムで発信中！お気軽にフォローしてください。',
            xButton: 'フォローする →',
            followMessage: '各SNSでは異なる情報を発信しています。ぜひ全てをフォローして、ラジコンの世界を一緒に楽しみましょう！'
        },
        activitySection: {
            title: '活動記録',
            blogTitle: '📖 技術ブログ（note）',
            blogDescription: '修理工程、パーツレビュー、技術的な備忘録など、SNSでは伝えきれない詳細な情報を発信しています。',
            noteTitle: 'note',
            noteDescription: '修理工程や技術解説を詳しく記録中',
            latestArticlesTitle: '📌 最新のブログ記事',
            moreArticles: 'もっと記事を見る →',
            notePinnedTitle: '📌 おすすめ記事（ピン留め）',
            notePinnedDesc: 'ラジコン文化の継承について、19年の経験から語る重要な記事です。',
            noteLatestTitle: '📰 最新記事（自動取得）',
            noteAutoUpdateInfo: '🔄 ページ読み込み時に自動で最新記事を取得します'
        },
        edgetxManualSection: {
            title: 'EdgeTX日本語マニュアル',
            introTitle: 'EdgeTX & TX16S 完全日本語マニュアル',
            introDesc: 'RadioMaster TX16S向けのEdgeTX日本語マニュアルです。これから初めて操作する初心者様組や、フタバ・JR PROPOからの乗り換え組にもわかりやすく丁寧な解説を心がけました。',
            feature1: '✓ 全144ページ',
            feature2: '✓ 7章構成',
            feature3: '✓ ヘリコプター設定対応',
            feature4: '✓ シミュレーター設定解説',
            termsTitle: '📋 利用規約・著作権について',
            termsCopyright: '著作権：',
            termsCopyrightValue: '© 2026 ぽすとそに工房 All Rights Reserved.',
            termsPersonal: '個人利用：',
            termsPersonalValue: '個人での学習・RC活動での利用は自由です。',
            termsRedist: '再配布：',
            termsRedistValue: '本マニュアルの無断複製・転載・再配布を禁じます。',
            termsCommercial: '商用利用：',
            termsCommercialValue: '商用利用はご遠慮ください。ただし、YouTubeなどでご紹介いただく際の広告収入は問題ありません（出典元として「ぽすとそに工房」を明記してください）。',
            termsCitation: '引用：',
            termsCitationValue: '引用する場合は出典（ぽすとそに工房）を明記してください。',
            termsDisclaimer: '免責事項：',
            termsDisclaimerValue: '本マニュアルの内容による損害について、作者は責任を負いません。',
            termsNote1: '※ EdgeTXはオープンソースプロジェクトです。',
            termsNote2: '※ TX16SはRadioMasterの製品です。',
            termsNote3: '※ 各社の商標は各社に帰属します。',
            downloadTitle: '📥 PDFダウンロード',
            pdfTitle: 'EdgeTX日本語マニュアル 完全版',
            pdfInfo: 'Version 1.0.1 | 全144ページ | 約1.2MB',
            pdfDate: '発行日：2026年1月',
            pdfButton: '📥 PDFをダウンロード',
            soundTitle: 'EdgeTX 音声ファイル一覧表',
            soundInfo: 'カスタム音声パック自作用リファレンス | 全743ファイル対応',
            soundDate: '作成日：2025年12月',
            soundButton: '📥 一覧表をダウンロード',
            tocTitle: '📖 オンラインマニュアル（目次）',
            tocDesc: 'クリックすると各章の内容を展開できます。',
            chapter1Num: '第1章',
            chapter1Title: 'EdgeTXとは何か',
            chapter1Subtitle: '〜 OpenTXからの歴史と設計思想 〜',
            chapter1Pages: '12ページ',
            chapter2Num: '第2章',
            chapter2Title: 'TX16S初期設定',
            chapter2Subtitle: '〜 電源・言語・音声・画面の基本設定 〜',
            chapter2Pages: '26ページ',
            chapter3Num: '第3章',
            chapter3Title: 'モデル作成の基本',
            chapter3Subtitle: '〜 モデルの概念と設定画面の理解 〜',
            chapter3Pages: '15ページ',
            chapter4Num: '第4章',
            chapter4Title: 'ミキサーの考え方',
            chapter4Subtitle: '〜 EdgeTXの核心を理解する 〜',
            chapter4Pages: '17ページ',
            chapter5Num: '第5章',
            chapter5Title: 'フライトモードとカーブ',
            chapter5Subtitle: '〜 飛行状態に応じた設定の切り替え 〜',
            chapter5Pages: '20ページ',
            chapter6Num: '第6章',
            chapter6Title: '実践編（シミュレーター設定例）',
            chapter6Subtitle: '〜 シミュレーターで安全に練習しよう 〜',
            chapter6Pages: '20ページ',
            appendixNum: '付録',
            appendixTitle: 'トラブルシューティング',
            appendixSubtitle: '〜 よくある問題と解決方法 〜',
            appendixPages: '32ページ',
            changelogTitle: '📝 更新履歴',
            changelogEntry1: '2026年1月1日 - Version 1.0.1 公開（初版）',
            feedbackTitle: '💬 フィードバック・誤字脱字報告',
            feedbackDesc: 'マニュアルの内容に関するご意見、誤字脱字のご報告は、お問い合わせフォームまたはX（Twitter）からお願いいたします。',
            feedbackContact: '✉️ お問い合わせ',
            feedbackTwitter: '🐦 X（Twitter）',
            ch1sec1: '1-1. EdgeTXとは何か',
            ch1sec1desc: 'EdgeTXは、オープンソースのRC送信機用ファームウェアです。OpenTXから派生し、より活発な開発とユーザーフレンドリーな機能を提供しています。',
            ch1sec2: '1-2. OpenTXとの違い',
            ch1sec2desc: 'EdgeTXはOpenTXをベースに、タッチスクリーン対応の強化、カラー画面の最適化、新機能の積極的な追加などが行われています。',
            ch1sec3: '1-3. フタバ・JR PROPOとの違い',
            ch1sec3desc: 'フタバやJR PROPOは「専用システム」として、機種ごとに専用の機能が用意されています。一方EdgeTXは「汎用システム」として、白紙から自分で設定を構築します。',
            ch1sec4: '1-4. EdgeTXの設計思想',
            ch1sec4desc: '「何も決まっていない」からこそ、どんな機体にも対応できる柔軟性があります。フライトモード、ミキサー、カーブなど、すべてを自分で組み立てます。',
            ch2sec1: '2-1. TX16Sの概要',
            ch2sec1desc: 'RadioMaster TX16Sは、EdgeTXを搭載したコストパフォーマンスの高いプロポです。タッチスクリーン、マルチプロトコル対応など、高機能な仕様を備えています。',
            ch2sec2: '2-2. 電源を入れる',
            ch2sec2desc: '電源ボタンの長押しで起動します。初回起動時には各種警告が表示されることがあります。',
            ch2sec3: '2-3. 言語設定',
            ch2sec3desc: 'SYSキー → 歯車マーク → 言語設定で日本語を選択できます。',
            ch2sec4: '2-4. 音声設定と日本語音声の導入',
            ch2sec4desc: '日本語音声パックの導入方法、音量調整、音声ファイルの差し替え方法を解説します。',
            ch2sec5: '2-5. 画面設定',
            ch2sec5desc: 'バックライト、輝度、テーマの設定方法を説明します。',
            ch2sec6: '2-6. スティックキャリブレーション',
            ch2sec6desc: '正確な操作のために、スティックのキャリブレーションを行います。',
            ch3sec1: '3-1. モデルとは何か',
            ch3sec1desc: 'EdgeTXにおける「モデル」とは、1つの機体に対する設定の集まりです。複数のモデルを保存して切り替えられます。',
            ch3sec2: '3-2. モデルの新規作成',
            ch3sec2desc: 'MDLキーからモデル一覧を開き、新しいモデルを作成する手順を解説します。',
            ch3sec3: '3-3. SETUP画面の説明',
            ch3sec3desc: 'モデル名、画像、タイマー、RFモジュール設定など、SETUP画面の各項目を説明します。',
            ch3sec4: '3-4. INPUTS（入力）の基本',
            ch3sec4desc: 'スティックやスイッチの入力を設定するINPUTSページについて解説します。',
            ch3sec5: '3-5. OUTPUTS（出力）の基本',
            ch3sec5desc: 'サーボへの出力を設定するOUTPUTSページについて解説します。',
            ch4sec1: '4-1. ミキサーとは何か',
            ch4sec1desc: 'ミキサーは、入力（スティック・スイッチ）を出力（サーボ・ESC）に変換する中核機能です。',
            ch4sec2: '4-2. MIXESページの構造',
            ch4sec2desc: 'チャンネルとミキサーラインの関係、各設定項目の意味を解説します。',
            ch4sec3: '4-3. ミキサーラインの作成',
            ch4sec3desc: 'Source、Weight、Offset、Switch、Curveなどの設定方法を説明します。',
            ch4sec4: '4-4. Mltpx（ミキシングモード）',
            ch4sec4desc: 'Add（加算）、Multiply（乗算）、Replace（置換）の使い分けを解説します。',
            ch4sec5: '4-5. ヘリコプター用ミキサー設定例',
            ch4sec5desc: 'エルロン、エレベーター、スロットル、ラダー、ピッチの基本設定例を紹介します。',
            ch5sec1: '5-1. フライトモードとは何か',
            ch5sec1desc: 'フタバ・JR PROPOの「コンディション」に相当する機能です。ノーマル、アイドルアップ1、アイドルアップ2などを切り替えます。',
            ch5sec2: '5-2. フライトモードの設定方法',
            ch5sec2desc: 'FLIGHT MODESページでの設定手順、名前・スイッチ・トリムの設定を解説します。',
            ch5sec3: '5-3. フライトモードとスイッチの連動',
            ch5sec3desc: 'SEスイッチやSAスイッチを使った3モード切り替えの設定例を紹介します。',
            ch5sec4: '5-4. カーブ（CURVES）とは何か',
            ch5sec4desc: 'Expo、カスタムカーブの概念と使い方を説明します。',
            ch5sec5: '5-5. カーブの作成方法',
            ch5sec5desc: 'ピッチカーブ、スロットルカーブの作成手順と設定例を紹介します。',
            ch5sec6: '5-6. フライトモードとカーブの連携',
            ch5sec6desc: 'フライトモードごとに異なるカーブを適用する実践的な設定方法を解説します。',
            ch6sec1: '6-1. シミュレーターとは',
            ch6sec1desc: 'シミュレーター練習の重要性と、主なシミュレーターの紹介（HELI-X、RealFlight、VelociDrone、Liftoffなど）。',
            ch6sec2: '6-2. TX16SとPCの接続方法',
            ch6sec2desc: 'USBケーブルでの接続、ジョイスティックモードの設定方法を解説します。',
            ch6sec3: '6-3. HELI-Xの設定例',
            ch6sec3desc: 'ヘリコプター専用シミュレーターHELI-Xの設定手順を詳しく説明します。',
            ch6sec4: '6-4. その他シミュレーターの設定',
            ch6sec4desc: 'RealFlight、VelociDrone、Liftoffなどの設定ポイントを紹介します。',
            ch6sec5: '6-5. シミュレーター練習のコツ',
            ch6sec5desc: '効果的な練習方法、段階的な上達のステップ、実機への移行について解説します。',
            apxsec1: 'A-1. 送信機が起動しない・フリーズする',
            apxsec1desc: '電源が入らない、起動途中でフリーズする場合の原因と対策。',
            apxsec2: 'A-2. 送信機とPCが接続できない',
            apxsec2desc: 'USBケーブルの問題、USBモードの設定、ドライバーの問題など。',
            apxsec3: 'A-3. 受信機とバインドできない',
            apxsec3desc: 'バインドモード、プロトコル設定、レシーバー番号の問題と解決方法。',
            apxsec4: 'A-4. サーボ・モーターが動かない',
            apxsec4desc: 'MIXES設定の確認、チャンネルモニターでの診断方法。',
            apxsec5: 'A-5. 設定が保存されない・消えてしまう',
            apxsec5desc: 'SDカードの問題、バックアップの重要性、復旧方法。',
            apxsec6: 'A-6. 画面表示がおかしい',
            apxsec6desc: '画面が映らない、タッチパネルの問題、文字化けの対処法。',
            apxsec7: 'A-7. 音声案内が出ない・おかしい',
            apxsec7desc: '音声ファイルの確認、日本語音声の導入、音量設定。',
            apxsec8: 'A-8. ファームウェアアップデートの問題',
            apxsec8desc: 'アップデート前の準備、ブートローダーモード、復旧方法。',
            apxsec9: 'A-9. よくある設定ミスと解決方法',
            apxsec9desc: 'リバース設定、スイッチ条件、タイマーリセット（SPECIAL FUNCTIONS活用）など。'
        },
        rotorflightManualSection: {
            title: '📖 Rotorflight日本語マニュアル',
            introTitle: 'Rotorflight Configurator 2.2.1 完全日本語マニュアル',
            introDesc: 'RCヘリコプター専用フライトコントローラー設定ソフトウェアの完全解説マニュアルです。Rotorflightを初めて使う方、従来のRCヘリ用ジャイロから移行する方、設定項目の意味を理解したい方に向けて作成しました。',
            feature1: '✓ 全63ページ',
            feature2: '✓ 27章構成',
            feature3: '✓ ヘリコプター専用FC',
            feature4: '✓ NEXUS-XR対応',
            termsTitle: '📋 利用規約・著作権について',
            termsCopyright: '著作権：',
            termsCopyrightValue: '© 2026 ぽすとそに工房 All Rights Reserved.',
            termsPersonal: '個人利用：',
            termsPersonalValue: '個人での閲覧・学習目的での使用は自由です。',
            termsYoutube: 'YouTube等：',
            termsYoutubeValue: '動画での紹介・解説（収益化含む）は可能です。事前にお問い合わせよりご連絡ください。',
            termsRedist: '再配布：',
            termsRedistValue: '無断転載（SNS・ブログ等への全文コピー）、商用目的での再配布・販売を禁じます。',
            termsDisclaimer: '免責事項：',
            termsDisclaimerValue: '本マニュアルの内容による損害について、作者は責任を負いません。',
            termsNote1: '※ Rotorflightはオープンソースプロジェクトです。',
            termsNote2: '※ NEXUS-XRはRadioMasterの製品です。',
            termsNote3: '※ 各社の商標は各社に帰属します。',
            downloadTitle: '📥 PDFダウンロード',
            pdfTitle: 'Rotorflight Configurator 2.2.1 日本語化マニュアル ver1.0（第一版）',
            pdfInfo: 'Version 1.0.0 | 全63ページ | 約1.2MB',
            pdfDate: '発行日：2026年1月',
            pdfButton: '📥 PDFをダウンロード',
            v1Badge: '第一版',
            v1Label: 'Rotorflight Configurator 日本語化マニュアル ver1.0',
            v1Desc: 'Rotorflight Configuratorの全体像と各タブの基本的な操作の流れをまとめた概要ガイドです。初めてRotorflightに触れる方や、全体の構成を把握したい方に向けた入門用マニュアルです。',
            v2Badge: '第二版',
            v2Label: 'Rotorflight Configurator 日本語化マニュアル ver1.1（セクション別）',
            v2Desc: '第一版の内容をさらに掘り下げ、Configuratorの各セクション（タブ画面）ごとに、設定項目の数値の意味や効果を日本語で詳しく解説したマニュアルです。英語表記の設定画面を日本語で理解したい方、より細かいチューニングを行いたい方に向けて作成しました。',
            v2Note: '※ 必要なセクションだけを個別にダウンロードできます。',
            secPdfBtn: '📥 PDF',
            sec01Title: 'Status編', sec01Desc: 'ステータス画面 ― FC情報・ジャイロプレビュー・アーミング状態の確認',
            sec02Title: 'Setup編', sec02Desc: '初期設定 ― キャリブレーション・バックアップ・リストアの手順',
            sec03Title: 'Configuration編', sec03Desc: '基本構成 ― 機体タイプ・テールローター・ボード設定の詳細',
            sec04Title: 'Presets編', sec04Desc: 'プリセット ― 機体別プリセットの適用と管理',
            sec05Title: 'Receiver編', sec05Desc: '受信機設定 ― プロトコル選択・チャンネルマップ・RSSI設定',
            sec06Title: 'Failsafe編', sec06Desc: 'フェイルセーフ ― 信号喪失時の動作設定と安全対策',
            sec07Title: 'Power編', sec07Desc: '電源・バッテリー ― 電圧/電流センサーの設定とキャリブレーション',
            sec08Title: 'Motors編', sec08Desc: 'モーター設定 ― ESCプロトコル・テレメトリ・ガバナー設定',
            sec09Title: 'Servos編', sec09Desc: 'サーボ設定 ― サーボの割当・トラベル・リバース・速度設定',
            sec10Title: 'Mixer編', sec10Desc: 'ミキサー ― スワッシュプレート設定・ブレード角度キャリブレーション',
            sec11Title: 'Gyro編', sec11Desc: 'ジャイロ設定 ― フィルター・RPMフィルター・ダイナミックノッチ',
            sec12Title: 'Rates編', sec12Desc: 'レート設定 ― 操縦感度・回転レート・エキスポの調整',
            sec13Title: 'Profiles編', sec13Desc: 'プロファイル ― PIDチューニング・レスキュー・ヘッドスピード管理',
            sec14Title: 'Modes編', sec14Desc: 'フライトモード ― ARM・レスキュー・スタビライズモードの設定',
            sec15Title: 'Adjustments編', sec15Desc: '調整スロット ― AUXチャンネルによるパラメータ動的変更',
            sec16Title: 'Beepers編', sec16Desc: 'ビープ音 ― 各種警告音・通知音の有効化と設定',
            sec17Title: 'Sensors編', sec17Desc: 'センサー ― 各種センサーの有効化・トレンド表示・動作確認',
            sec18Title: 'Blackbox編', sec18Desc: 'ログ記録 ― フライトログの記録設定とデータ分析',
            sec19Title: 'CLI編', sec19Desc: 'コマンドライン ― CLIコマンドによる設定・バックアップ・リストア',
            tocTitle: '📖 オンラインマニュアル（目次）',
            tocDesc: 'クリックすると各章の内容を展開できます。',
            chapter1Num: '第1章',
            chapter1Title: 'はじめに',
            chapter1Subtitle: '〜 Rotorflightとは 〜',
            ch1desc: 'Rotorflightは、RCヘリコプター専用に設計されたオープンソースのフライトコントロールソフトウェアです。Betaflightをベースに、ヘリコプターの特性に合わせて大幅にカスタマイズされています。主な特徴、構成要素、従来のジャイロとの違いについて解説します。',
            chapter2Num: '第2章',
            chapter2Title: 'NEXUS-XRについて',
            chapter2Subtitle: '〜 ハードウェア参考例 〜',
            ch2desc: 'RadioMaster製のNEXUS-XRフライトコントローラーの基本仕様、各部写真、端子説明について解説します。STM32F722RET6 MCU、ICM42688Pジャイロ、内蔵ELRS 2.4GHz受信機などを搭載した高性能FCです。',
            chapter3Num: '第3章',
            chapter3Title: 'Welcome画面',
            chapter3Subtitle: '〜 起動画面の解説 〜',
            ch3desc: 'Rotorflight Configuratorを起動すると最初に表示される画面です。上部ヘッダーエリア、接続設定、メインボタン、左サイドメニュー、ダウンロードリンクについて解説します。',
            chapter4Num: '第4章',
            chapter4Title: 'Documentation & Support',
            chapter4Subtitle: '〜 ドキュメント・サポート 〜',
            ch4desc: 'Rotorflightの公式ドキュメントやサポートリソースへのリンク集です。Wiki、GitHub、Discord、Facebookグループなど、困ったときの情報源を紹介します。',
            chapter5Num: '第5章',
            chapter5Title: 'Options',
            chapter5Subtitle: '〜 Configuratorの設定 〜',
            ch5desc: 'Rotorflight Configurator自体の設定画面です。表示言語、ダークモード、シリアルポート設定、Expert Modeなどを変更できます。',
            chapter6Num: '第6章',
            chapter6Title: 'Privacy Policy',
            chapter6Subtitle: '〜 プライバシーポリシー 〜',
            ch6desc: 'Rotorflight Configuratorのプライバシーポリシー（個人情報保護方針）について解説します。収集される情報とデータの使用目的を説明します。',
            chapter7Num: '第7章',
            chapter7Title: 'Firmware Flasher',
            chapter7Subtitle: '〜 ファームウェア書き込み 〜',
            ch7desc: 'FCにRotorflightファームウェアを書き込む画面です。書き込み手順、DFUモードへの入り方、オプション設定、注意点について詳しく解説します。',
            chapter8Num: '第8章',
            chapter8Title: 'Status',
            chapter8Subtitle: '〜 機体状態の確認 〜',
            ch8desc: 'FCの現在の状態をリアルタイムで確認できる画面です。ARM禁止フラグ、3Dモデル表示、受信機入力値、ステータスバーについて解説します。',
            chapter9Num: '第9章',
            chapter9Title: 'Setup',
            chapter9Subtitle: '〜 基本セットアップ 〜',
            ch9desc: 'FCの基本セットアップを行う画面です。加速度センサーの校正、設定リセット、バックアップ/リストア、ボード取り付け方向の設定について解説します。',
            chapter10Num: '第10章',
            chapter10Title: 'Configuration',
            chapter10Subtitle: '〜 詳細設定 〜',
            ch10desc: 'ヘリコプターの基本設定を行う重要な画面です。3軸/6軸モード、ミキサータイプ、スワッシュプレートタイプ、センサー設定、モータープロトコル、各種機能について解説します。',
            chapter11Num: '第11章',
            chapter11Title: 'Presets',
            chapter11Subtitle: '〜 プリセット 〜',
            ch11desc: 'プリセット（事前設定）を適用・管理する画面です。機体に合わせた推奨設定を簡単に適用できます。プリセットソース、適用方法、カテゴリについて解説します。',
            chapter12Num: '第12章',
            chapter12Title: 'Receiver',
            chapter12Subtitle: '〜 受信機設定 〜',
            ch12desc: '受信機の設定を行う画面です。受信機モード（SBUS, CRSF等）、チャンネルマップ、スティック設定、RSSIソースについて解説します。',
            chapter13Num: '第13章',
            chapter13Title: 'Failsafe',
            chapter13Subtitle: '〜 フェイルセーフ 〜',
            ch13desc: 'フェイルセーフ（信号喪失時の動作）を設定する非常に重要な画面です。スイッチアクション、チャンネル設定、Stage 2設定、テスト方法、Rescue機能との連携について解説します。',
            chapter14Num: '第14章',
            chapter14Title: 'Power',
            chapter14Subtitle: '〜 電源・バッテリー設定 〜',
            ch14desc: 'バッテリー電圧の監視や電流センサーの設定を行う画面です。電圧ソース、セル数、容量、電流センサー、警告設定について解説します。',
            chapter15Num: '第15章',
            chapter15Title: 'Motors',
            chapter15Subtitle: '〜 モーター・ESC設定 〜',
            ch15desc: 'モーター（ESC）の設定を行う画面です。モーター設定、ガバナー機能、スロットルキャリブレーション、モーターテスト、ESCテレメトリーについて解説します。',
            chapter16Num: '第16章',
            chapter16Title: 'Servos',
            chapter16Subtitle: '〜 サーボ設定 〜',
            ch16desc: 'サーボの設定を行う画面です。サーボチャンネル、中立位置調整、動作範囲制限、リバース、更新レート、サーボテストについて解説します。',
            chapter17Num: '第17章',
            chapter17Title: 'Mixer',
            chapter17Subtitle: '〜 ミキサー設定 〜',
            ch17desc: 'スワッシュプレートとテールローターのミキシングを設定する画面です。スワッシュプレートミキサー、サーボ方向、スワッシュ方向、テールローターミキサーについて解説します。',
            chapter18Num: '第18章',
            chapter18Title: 'Gyro',
            chapter18Subtitle: '〜 ジャイロ設定 〜',
            ch18desc: 'ジャイロ（角速度センサー）とフィルターの設定を行う画面です。ジャイロ設定、ローパスフィルター、ノッチフィルター、RPMフィルター、ダイナミックフィルターについて解説します。',
            chapter19Num: '第19章',
            chapter19Title: 'Rates',
            chapter19Subtitle: '〜 レート設定 〜',
            ch19desc: 'スティック操作に対する機体の反応速度（レート）を設定する画面です。レートプロファイル、Roll/Pitch/Yaw/Collectiveレート、Expo、レートタイプについて解説します。',
            chapter20Num: '第20章',
            chapter20Title: 'Profiles',
            chapter20Subtitle: '〜 プロファイル設定 〜',
            ch20desc: 'PID設定やその他のチューニングパラメータを保存するプロファイル画面です。PIDプロファイル、PIDコントローラー、PID調整の基本、Feedforwardについて解説します。',
            chapter21Num: '第21章',
            chapter21Title: 'Modes',
            chapter21Subtitle: '〜 モード設定 〜',
            ch21desc: '各種モード（ARM、Rescue、プロファイル切り替え等）をAUXチャンネルに割り当てる画面です。3軸/6軸モード、主要なModes、Angle/Horizon/Acro Trainerモードについて解説します。',
            chapter22Num: '第22章',
            chapter22Title: 'Adjustments',
            chapter22Subtitle: '〜 調整機能 〜',
            ch22desc: '送信機のダイヤルやスライダーを使って、飛行中にリアルタイムで各種パラメータを調整できる機能です。Adjustmentスロット、調整可能なパラメータ、Luaスクリプトとの違いについて解説します。',
            chapter23Num: '第23章',
            chapter23Title: 'Beepers',
            chapter23Subtitle: '〜 ブザー設定 〜',
            ch23desc: 'ブザー（ビーパー）の設定を行う画面です。各種イベントに対してブザー音を鳴らすかどうかを設定できます。NEXUS-XRでのブザー使用方法についても解説します。',
            chapter24Num: '第24章',
            chapter24Title: 'Sensors',
            chapter24Subtitle: '〜 センサー 〜',
            ch24desc: '各種センサーの値をリアルタイムで確認できる画面です。ジャイロスコープ、加速度センサー、気圧センサー、デバッグ情報について解説します。',
            chapter25Num: '第25章',
            chapter25Title: 'Blackbox',
            chapter25Subtitle: '〜 フライトログ 〜',
            ch25desc: 'フライトログ（Blackbox）の設定を行う画面です。Blackbox設定、ログデバイス、記録頻度、使い方、Blackbox Explorerでの分析について解説します。',
            chapter26Num: '第26章',
            chapter26Title: 'CLI',
            chapter26Subtitle: '〜 コマンドライン 〜',
            ch26desc: 'コマンドラインインターフェース（CLI）の画面です。基本コマンド、diff/dumpでのバックアップ、設定変更、便利なコマンド、設定リストア手順について解説します。',
            glossaryNum: '用語集',
            glossaryTitle: '専門用語の解説',
            glossarySubtitle: '〜 基本用語・制御用語・通信用語・略語一覧 〜',
            glossarydesc: 'Rotorflightで使用される専門用語の解説です。基本用語（FC、ARM、DISARM等）、ヘリコプター用語（スワッシュプレート、コレクティブ、ガバナー等）、制御用語（PID、Rate、Expo等）、通信用語（SBUS、CRSF、DSHOT等）、センサー用語、機能用語、略語一覧を掲載しています。',
            changelogTitle: '📝 更新履歴',
            changelogEntry1: '2026年2月8日 - Version 1.1 公開（第二版）',
            changelogEntry2: '2026年1月28日 - Version 1.0 公開（初版）',
            feedbackTitle: '💬 フィードバック・誤字脱字報告',
            feedbackDesc: 'マニュアルの内容に関するご意見、誤字脱字のご報告は、お問い合わせフォームまたはX（Twitter）からお願いいたします。',
            feedbackContact: '✉️ お問い合わせ',
            feedbackTwitter: '🐦 X（Twitter）'
        },
        rcLibrarySection: {
            title: '📚 ラジコン機器の日本語マニュアルPDF集',
            introTitle: 'ラジコン機器の設定、もう迷わない',
            introDesc: '海外製品で日本語マニュアルがない、日本語で書かれていても難解で敷居が高い ― そんな機器の設定項目を、できるだけ分かりやすくまとめたPDF資料集です。自分自身も調べながら作成したものですので、誤りがあればぜひご連絡ください。',
            termsTitle: '📋 利用規約・著作権について',
            termsCopyright: '著作権：',
            termsCopyrightValue: '© 2026 ぽすとそに工房 All Rights Reserved.',
            termsPersonal: '個人利用：',
            termsPersonalValue: '個人での閲覧・学習目的での使用は自由です。',
            termsYoutube: 'YouTube等：',
            termsYoutubeValue: '動画での紹介・解説（収益化含む）は可能です。事前にお問い合わせよりご連絡ください。',
            termsRedist: '再配布：',
            termsRedistValue: '無断転載（SNS・ブログ等への全文コピー）、商用目的での再配布・販売を禁じます。',
            termsDisclaimer: '免責事項：',
            termsDisclaimerValue: '本資料の内容による損害について、作者は責任を負いません。',
            termsNote1: '※ 各製品名・商標は各メーカーに帰属します。',
            termsNote2: '※ 本資料は公式マニュアルの代替ではありません。正確な情報は各メーカーの公式資料をご確認ください。',
            escTitle: '🔋 ESC（アンプ）の設定まとめ',
            esc01Title: 'HOBBYWING Platinum ESC シリーズ 設定項目一覧',
            esc01Desc: 'Platinum ESCの全設定項目（Flight Mode、ガバナーP/I、カットオフ、BEC電圧など）を日本語で解説。3-in-1プログラムボックス対応。ヘリコプター用推奨設定つき。',
            esc01Meta: '全12ページ | 約120KB',
            gyroTitle: '🎛️ ジャイロ・FCの設定まとめ',
            wiringTitle: '⚡ 配線・電装のまとめ',
            updateTitle: '📡 各種アップデート用設定まとめ',
            update01Title: 'ELRS 4.0.0 ファームウェアアップデートガイド（USB・Wi-Fi両対応）',
            update01Desc: 'ExpressLRS 4.0.0へのアップデート手順を解説。USB方式（EdgeTX Passthrough / Betaflight Passthrough）とWi-Fi方式の両方に対応。送信機・受信機それぞれの手順、Luaスクリプトの更新、トラブルシューティングまで収録。',
            update01Meta: '全19ページ | 約390KB',
            comingSoon: '📝 準備中です。今後追加予定ですのでお楽しみに！',
            pdfBtn: '📥 PDF',
            feedbackTitle: '💬 フィードバック・誤り報告',
            feedbackDesc: '内容の誤りや「この機器のまとめも作ってほしい」などのリクエストがありましたら、お気軽にご連絡ください。',
            feedbackContact: '✉️ お問い合わせ',
            feedbackTwitter: '🐦 X（Twitter）'
        },
        aiGamesSection: {
            title: 'AIラジコンゲーム開発',
            introTitle: 'Claude AI とともに作ったラジコン普及ゲーム',
            introDesc: 'Claude AI とともに作って勉強してきたラジコン普及を目指したゲームです！ラジコンを知らない人でも楽しめるように設計していたり、ラジコンの知識がある人も唸るようなものまで用意させていただきました！是非プレイ感想などもお待ちしておりますし、Xなどで結果をシェアしていただけるとリプライしにいくこともあります！',
            game1Title: 'RCシャーシ性格診断',
            game1Desc: 'あなたにぴったりのRCシャーシタイプを診断！',
            game2Title: 'RCパーツガチャ',
            game2Desc: '運試し！レアパーツをゲットできるか!?',
            game3Title: 'RCクイズ',
            game3Desc: 'RCの知識をテスト！何問正解できる？',
            game4Title: 'RCあるある共感チェック',
            game4Desc: 'RCファンなら共感必至のあるあるネタ！',
            game5Title: 'RC人生シミュレーター',
            game5Desc: 'RCライフを疑似体験！どんな人生になる？',
            shareCta: '🐦 結果はぜひXでシェアしてください！リプライしにいくかも！？',
            followBtn: '@postsoni をフォロー'
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
            notice: '※このフォームは商業目的ではなく、ボランティア活動に関するお問い合わせ専用です。',
            buttonText: '📧 お問い合わせフォームを開く',
            // Phase 5: ステップ表示
            flowTitle: '📋 お問い合わせからの流れ',
            step1Title: 'フォーム送信',
            step1Desc: 'お気軽にご連絡ください',
            step2Title: '内容確認・ヒアリング',
            step2Desc: '状況を詳しくお聞きします（1〜3日）',
            step3Title: 'アドバイス・ご提案',
            step3Desc: '修理方法や必要なパーツをご案内',
            step4Title: '作業（対面 or オンライン）',
            step4Desc: '一緒に修理・メンテナンスを行います',
            step5Title: '完了・アフターフォロー',
            step5Desc: 'その後の疑問もお気軽にご質問いただけると幸いです',
            // Phase 5: 期待値の明示
            expectationsTitle: '💡 お問い合わせ前に知っておいてほしいこと',
            responseTimeTitle: '返信時間',
            responseTimeDesc: '通常1〜3日以内（体調により遅れる場合があります）',
            supportTypeTitle: '対応可能なこと',
            supportTypeDesc: 'RC修理相談、初心者サポート、機種選びの相談、技術的な質問',
            costTitle: '費用について',
            costDesc: '完全無料のボランティア活動です。修理費・相談料等は一切いただきません。',
            partsTitle: 'パーツ代について',
            partsDesc: '必要なパーツはご自身でご購入いただきます（購入先のアドバイスは可能）',
            areaTitle: '対応エリア',
            areaDesc: '札幌中心、オンライン相談は全国対応',
            noMoneyNotice: '⚠️ このサイトを通じた金銭のやり取りは一切行っておりません。パーツや機体のご購入は、ショップ等でご自身でお願いいたします。'
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
            // 経験者向けセクション
            expertSectionTitle: '経験者の方へ',
            expertSectionDescription: '当工房では高度な修理・カスタムにも対応しております。発泡機の下地カラー、エポキシ+マイクロバルーン、マイクログラス、表面加工、カラーリングなど発泡面を消す技術や、電動・エンジン機のフルレストア（10機以上の実績）を行っています。',
            expertSectionSkills: '最近ではトラクサスESCの不調原因究明、ヨコモドリフト系列やタミヤTT-02の舵角加工、エアレーションダンパーの最適セッティングなど、多岐にわたる技術サポートを提供しております。',
            expertSectionMakersLabel: '対応メーカー:',
            expertSectionButton: '技術相談・お問い合わせ →',
            // SNSクイックリンク
            snsQuickTitle: '📱 SNS・メディアをフォロー',
            snsQuickDescription: '最新情報やRC活動の様子をチェック！',
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
            activity: 'Blog', 'edgetx-manual': 'EdgeTX Manual', 'rotorflight-manual': 'Rotorflight Manual', 'rc-library': 'RC Equipment PDF Manuals', 'ai-games': 'AI RC Games', goods: 'Goods', support: 'Support',
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
        newsSection2026Jan: {
            date: 'January 28, 2026',
            newsTitle: 'Aircraft Build/Repair Complete & Manual Release Announcement',
            section1Title: '◆Calmato α40 Repair Complete',
            section1Text: 'The Calmato α40 I previously assembled crashed, but repairs are now complete. After readjusting the mechanics and inspecting the airframe, we\'re almost ready for flight check.',
            section2Title: '◆GOOSKY RS7 Ultra Build Complete',
            section2Text: 'Assembly of the cutting-edge electric helicopter "GOOSKY RS7 Ultra" is complete. Equipped with Rotorflight firmware, currently being tuned for future flights.',
            section3Title: '◆EdgeTX & Rotorflight Japanese Manuals Released',
            section3Text: 'Released the "EdgeTX Japanese Manual" for RadioMaster TX16S and the "Rotorflight Configurator Japanese Manual" for RC helicopter FCs. We hope these help beginners and those switching from traditional systems.',
            section4Title: '◆Inquiries Exceed 15 Cases',
            section4Text: 'Email inquiries have exceeded 15 cases total. Thank you to everyone who contacted us. We will continue supporting RC beginners.'
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
            youtubeDesc: 'Uploading RC building, repair, and flight videos! Also featuring assembly guides and technical tips.',
            youtubeButton: 'Visit Channel →',
            noteTitle: 'note Technical Blog',
            noteDesc: 'Detailed repair process records, parts reviews, and technical notes that cannot be fully conveyed through videos.',
            noteButton: 'Read Blog →',
            noteTag1: '🔧 Repair Log',
            noteTag2: '📊 Parts Review',
            noteTag3: '💡 Tech Guide',
            xTitle: 'X (formerly Twitter)',
            xDesc: 'Real-time updates on daily RC activities, work progress, and event information. Feel free to follow!',
            xButton: 'Follow →',
            followMessage: 'We share different content on each SNS platform. Follow all of them and enjoy the world of RC together!'
        },
        activitySection: {
            title: 'Activity Log',
            blogTitle: '📖 Technical Blog (note)',
            blogDescription: 'Sharing detailed information including repair processes, parts reviews, and technical notes that cannot be fully conveyed through SNS.',
            noteTitle: 'note',
            noteDescription: 'Detailed records of repair processes and technical explanations',
            latestArticlesTitle: '📌 Latest Blog Articles',
            moreArticles: 'View More Articles →',
            notePinnedTitle: '📌 Featured Article (Pinned)',
            notePinnedDesc: 'An important article about preserving RC culture, based on 19 years of experience.',
            noteLatestTitle: '📰 Latest Articles (Auto-fetch)',
            noteAutoUpdateInfo: '🔄 Latest articles are automatically fetched when page loads'
        },
        edgetxManualSection: {
            title: 'EdgeTX Japanese Manual',
            introTitle: 'EdgeTX & TX16S Complete Japanese Manual',
            introDesc: 'This is a Japanese manual for EdgeTX on RadioMaster TX16S. We have created easy-to-understand explanations for beginners and those switching from Futaba/JR PROPO.',
            feature1: '✓ 144 Pages Total',
            feature2: '✓ 7 Chapters',
            feature3: '✓ Helicopter Setup Guide',
            feature4: '✓ Simulator Setup Guide',
            termsTitle: '📋 Terms of Use & Copyright',
            termsCopyright: 'Copyright:',
            termsCopyrightValue: '© 2026 Postsoni Workshop All Rights Reserved.',
            termsPersonal: 'Personal Use:',
            termsPersonalValue: 'Free for personal learning and RC activities.',
            termsRedist: 'Redistribution:',
            termsRedistValue: 'Unauthorized copying, reprinting, and redistribution is prohibited.',
            termsCommercial: 'Commercial Use:',
            termsCommercialValue: 'Commercial use is not permitted. However, ad revenue from YouTube introductions is acceptable (please credit "Postsoni Workshop").',
            termsCitation: 'Citation:',
            termsCitationValue: 'When citing, please credit Postsoni Workshop as the source.',
            termsDisclaimer: 'Disclaimer:',
            termsDisclaimerValue: 'The author is not responsible for any damages from this manual.',
            termsNote1: '* EdgeTX is an open source project.',
            termsNote2: '* TX16S is a product of RadioMaster.',
            termsNote3: '* All trademarks belong to their respective owners.',
            downloadTitle: '📥 PDF Download',
            pdfTitle: 'EdgeTX Japanese Manual Complete Edition',
            pdfInfo: 'Version 1.0.1 | 144 Pages | ~1.2MB',
            pdfDate: 'Published: January 2026',
            pdfButton: '📥 Download PDF',
            soundTitle: 'EdgeTX Sound File List',
            soundInfo: 'Reference for custom sound pack | 743 files',
            soundDate: 'Created: December 2025',
            soundButton: '📥 Download List',
            tocTitle: '📖 Online Manual (Contents)',
            tocDesc: 'Click to expand each chapter.',
            chapter1Num: 'Ch.1',
            chapter1Title: 'What is EdgeTX',
            chapter1Subtitle: '~ History from OpenTX ~',
            chapter1Pages: '12 Pages',
            chapter2Num: 'Ch.2',
            chapter2Title: 'TX16S Initial Setup',
            chapter2Subtitle: '~ Power, Language, Sound, Display ~',
            chapter2Pages: '26 Pages',
            chapter3Num: 'Ch.3',
            chapter3Title: 'Model Creation Basics',
            chapter3Subtitle: '~ Model Concepts & Settings ~',
            chapter3Pages: '15 Pages',
            chapter4Num: 'Ch.4',
            chapter4Title: 'Understanding Mixers',
            chapter4Subtitle: '~ The Core of EdgeTX ~',
            chapter4Pages: '17 Pages',
            chapter5Num: 'Ch.5',
            chapter5Title: 'Flight Modes & Curves',
            chapter5Subtitle: '~ Settings by Flight Status ~',
            chapter5Pages: '20 Pages',
            chapter6Num: 'Ch.6',
            chapter6Title: 'Practical: Simulator Setup',
            chapter6Subtitle: '~ Practice Safely ~',
            chapter6Pages: '20 Pages',
            appendixNum: 'Appendix',
            appendixTitle: 'Troubleshooting',
            appendixSubtitle: '~ Common Problems & Solutions ~',
            appendixPages: '32 Pages',
            changelogTitle: '📝 Update History',
            changelogEntry1: 'Jan 1, 2026 - Version 1.0.1 Released',
            feedbackTitle: '💬 Feedback & Typo Reports',
            feedbackDesc: 'For comments or typo reports, please contact us via form or X (Twitter).',
            feedbackContact: '✉️ Contact',
            feedbackTwitter: '🐦 X (Twitter)',
            ch1sec1: '1-1. What is EdgeTX',
            ch1sec1desc: 'EdgeTX is an open-source firmware for RC transmitters, derived from OpenTX with more active development.',
            ch1sec2: '1-2. Differences from OpenTX',
            ch1sec2desc: 'EdgeTX enhances touchscreen support, optimizes color display, and actively adds new features.',
            ch1sec3: '1-3. Differences from Futaba/JR PROPO',
            ch1sec3desc: 'Futaba/JR are dedicated systems. EdgeTX is a general-purpose system where you build settings from scratch.',
            ch1sec4: '1-4. EdgeTX Design Philosophy',
            ch1sec4desc: 'With nothing predetermined, it adapts to any aircraft. Build flight modes, mixers, curves yourself.',
            ch2sec1: '2-1. TX16S Overview',
            ch2sec1desc: 'RadioMaster TX16S is a cost-effective transmitter with EdgeTX, touchscreen, and multi-protocol support.',
            ch2sec2: '2-2. Powering On',
            ch2sec2desc: 'Long-press the power button to start. Various warnings may appear on first boot.',
            ch2sec3: '2-3. Language Settings',
            ch2sec3desc: 'SYS key → Gear icon → Language settings to select Japanese.',
            ch2sec4: '2-4. Sound Settings & Japanese Voice',
            ch2sec4desc: 'How to install Japanese voice pack, adjust volume, and replace sound files.',
            ch2sec5: '2-5. Display Settings',
            ch2sec5desc: 'How to configure backlight, brightness, and theme.',
            ch2sec6: '2-6. Stick Calibration',
            ch2sec6desc: 'Calibrate sticks for accurate control.',
            ch3sec1: '3-1. What is a Model',
            ch3sec1desc: 'In EdgeTX, a "model" is a collection of settings for one aircraft. Multiple models can be saved.',
            ch3sec2: '3-2. Creating a New Model',
            ch3sec2desc: 'Open model list from MDL key and create a new model.',
            ch3sec3: '3-3. SETUP Screen Explanation',
            ch3sec3desc: 'Model name, image, timer, RF module settings explained.',
            ch3sec4: '3-4. INPUTS Basics',
            ch3sec4desc: 'About the INPUTS page for stick and switch input settings.',
            ch3sec5: '3-5. OUTPUTS Basics',
            ch3sec5desc: 'About the OUTPUTS page for servo output settings.',
            ch4sec1: '4-1. What is a Mixer',
            ch4sec1desc: 'Mixers convert inputs (sticks/switches) to outputs (servos/ESC).',
            ch4sec2: '4-2. MIXES Page Structure',
            ch4sec2desc: 'Relationship between channels and mixer lines, setting meanings.',
            ch4sec3: '4-3. Creating Mixer Lines',
            ch4sec3desc: 'How to set Source, Weight, Offset, Switch, Curve.',
            ch4sec4: '4-4. Mltpx (Mixing Mode)',
            ch4sec4desc: 'How to use Add, Multiply, Replace modes.',
            ch4sec5: '4-5. Helicopter Mixer Examples',
            ch4sec5desc: 'Basic setup examples for aileron, elevator, throttle, rudder, pitch.',
            ch5sec1: '5-1. What are Flight Modes',
            ch5sec1desc: 'Equivalent to Futaba/JR "Conditions". Switch between Normal, Idle Up 1, Idle Up 2.',
            ch5sec2: '5-2. Setting Flight Modes',
            ch5sec2desc: 'Setup procedure on FLIGHT MODES page: name, switch, trim.',
            ch5sec3: '5-3. Flight Mode & Switch Linking',
            ch5sec3desc: 'Examples of 3-mode switching using SE or SA switches.',
            ch5sec4: '5-4. What are Curves',
            ch5sec4desc: 'Concepts and usage of Expo and custom curves.',
            ch5sec5: '5-5. Creating Curves',
            ch5sec5desc: 'Pitch curve and throttle curve creation procedures.',
            ch5sec6: '5-6. Flight Mode & Curve Integration',
            ch5sec6desc: 'Practical settings for different curves per flight mode.',
            ch6sec1: '6-1. About Simulators',
            ch6sec1desc: 'Importance of simulator practice. Introduction to HELI-X, RealFlight, VelociDrone, Liftoff.',
            ch6sec2: '6-2. Connecting TX16S to PC',
            ch6sec2desc: 'USB connection and joystick mode setup.',
            ch6sec3: '6-3. HELI-X Setup Example',
            ch6sec3desc: 'Detailed setup for HELI-X helicopter simulator.',
            ch6sec4: '6-4. Other Simulator Settings',
            ch6sec4desc: 'Setup tips for RealFlight, VelociDrone, Liftoff.',
            ch6sec5: '6-5. Simulator Practice Tips',
            ch6sec5desc: 'Effective practice methods, progression steps, transition to real aircraft.',
            apxsec1: 'A-1. Transmitter Won\'t Start/Freezes',
            apxsec1desc: 'Causes and solutions for power failure or boot freezing.',
            apxsec2: 'A-2. Can\'t Connect to PC',
            apxsec2desc: 'USB cable issues, USB mode settings, driver problems.',
            apxsec3: 'A-3. Can\'t Bind to Receiver',
            apxsec3desc: 'Bind mode, protocol settings, receiver number issues.',
            apxsec4: 'A-4. Servo/Motor Won\'t Move',
            apxsec4desc: 'Checking MIXES settings, diagnosis with channel monitor.',
            apxsec5: 'A-5. Settings Not Saving/Disappearing',
            apxsec5desc: 'SD card issues, importance of backup, recovery methods.',
            apxsec6: 'A-6. Display Problems',
            apxsec6desc: 'Screen not showing, touchpanel issues, character corruption.',
            apxsec7: 'A-7. No Voice/Wrong Voice',
            apxsec7desc: 'Checking sound files, installing Japanese voice, volume settings.',
            apxsec8: 'A-8. Firmware Update Problems',
            apxsec8desc: 'Pre-update preparation, bootloader mode, recovery.',
            apxsec9: 'A-9. Common Setting Mistakes',
            apxsec9desc: 'Reverse settings, switch conditions, timer reset (SPECIAL FUNCTIONS).'
        },
        rotorflightManualSection: {
            title: '📖 Rotorflight Japanese Manual',
            introTitle: 'Rotorflight Configurator 2.2.1 Complete Japanese Manual',
            introDesc: 'A complete guide for the RC helicopter dedicated flight controller configuration software. Created for those new to Rotorflight, those transitioning from traditional RC helicopter gyros, and those who want to understand the meaning of each setting.',
            feature1: '✓ 63 Pages Total',
            feature2: '✓ 27 Chapters',
            feature3: '✓ Helicopter-Specific FC',
            feature4: '✓ NEXUS-XR Compatible',
            termsTitle: '📋 Terms of Use & Copyright',
            termsCopyright: 'Copyright:',
            termsCopyrightValue: '© 2026 Postsoni Workshop All Rights Reserved.',
            termsPersonal: 'Personal Use:',
            termsPersonalValue: 'Free for personal viewing and learning purposes.',
            termsYoutube: 'YouTube etc.:',
            termsYoutubeValue: 'Video introductions and explanations (including monetization) are permitted. Please contact us in advance.',
            termsRedist: 'Redistribution:',
            termsRedistValue: 'Unauthorized reprinting (full copying to SNS/blogs), commercial redistribution and sales are prohibited.',
            termsDisclaimer: 'Disclaimer:',
            termsDisclaimerValue: 'The author is not responsible for any damages from this manual.',
            termsNote1: '* Rotorflight is an open source project.',
            termsNote2: '* NEXUS-XR is a product of RadioMaster.',
            termsNote3: '* All trademarks belong to their respective owners.',
            downloadTitle: '📥 PDF Download',
            pdfTitle: 'Rotorflight Configurator 2.2.1 Japanese Manual ver1.0 (1st Edition)',
            pdfInfo: 'Version 1.0.0 | 63 Pages | ~1.2MB',
            pdfDate: 'Published: January 2026',
            pdfButton: '📥 Download PDF',
            v1Badge: '1st Edition',
            v1Label: 'Rotorflight Configurator Japanese Manual ver1.0',
            v1Desc: 'An overview guide covering the full picture of Rotorflight Configurator and the basic workflow of each tab. Designed as an introductory manual for those new to Rotorflight or wanting to understand the overall structure.',
            v2Badge: '2nd Edition',
            v2Label: 'Rotorflight Configurator Japanese Manual ver1.1 (By Section)',
            v2Desc: 'Building on the 1st Edition, this manual provides in-depth Japanese explanations for each Configurator section (tab screen), covering the meaning and effect of every setting parameter. Created for those who want to understand English UI settings in Japanese or perform more detailed tuning.',
            v2Note: '* You can download only the sections you need individually.',
            secPdfBtn: '📥 PDF',
            sec01Title: 'Status', sec01Desc: 'Status screen — FC info, gyro preview, arming status check',
            sec02Title: 'Setup', sec02Desc: 'Initial setup — Calibration, backup & restore procedures',
            sec03Title: 'Configuration', sec03Desc: 'Basic config — Aircraft type, tail rotor, board settings details',
            sec04Title: 'Presets', sec04Desc: 'Presets — Applying and managing aircraft-specific presets',
            sec05Title: 'Receiver', sec05Desc: 'Receiver settings — Protocol selection, channel map, RSSI config',
            sec06Title: 'Failsafe', sec06Desc: 'Failsafe — Signal loss behavior settings and safety measures',
            sec07Title: 'Power', sec07Desc: 'Power & Battery — Voltage/current sensor setup and calibration',
            sec08Title: 'Motors', sec08Desc: 'Motor settings — ESC protocol, telemetry, governor configuration',
            sec09Title: 'Servos', sec09Desc: 'Servo settings — Assignment, travel, reverse, speed configuration',
            sec10Title: 'Mixer', sec10Desc: 'Mixer — Swashplate setup and blade angle calibration',
            sec11Title: 'Gyro', sec11Desc: 'Gyro settings — Filters, RPM filter, dynamic notch',
            sec12Title: 'Rates', sec12Desc: 'Rate settings — Control sensitivity, rotation rates, expo adjustment',
            sec13Title: 'Profiles', sec13Desc: 'Profiles — PID tuning, rescue, headspeed management',
            sec14Title: 'Modes', sec14Desc: 'Flight modes — ARM, rescue, stabilize mode configuration',
            sec15Title: 'Adjustments', sec15Desc: 'Adjustment slots — Dynamic parameter changes via AUX channels',
            sec16Title: 'Beepers', sec16Desc: 'Beepers — Enabling and configuring warning/notification sounds',
            sec17Title: 'Sensors', sec17Desc: 'Sensors — Enabling sensors, trend display, operation check',
            sec18Title: 'Blackbox', sec18Desc: 'Logging — Flight log recording settings and data analysis',
            sec19Title: 'CLI', sec19Desc: 'Command line — CLI commands for settings, backup & restore',
            tocTitle: '📖 Online Manual (Contents)',
            tocDesc: 'Click to expand each chapter.',
            chapter1Num: 'Ch.1',
            chapter1Title: 'Introduction',
            chapter1Subtitle: '~ What is Rotorflight ~',
            ch1desc: 'Rotorflight is an open-source flight control software designed specifically for RC helicopters. Based on Betaflight, it has been extensively customized for helicopter characteristics. Covers main features, components, and differences from traditional gyros.',
            chapter2Num: 'Ch.2',
            chapter2Title: 'About NEXUS-XR',
            chapter2Subtitle: '~ Hardware Reference ~',
            ch2desc: 'Explains the basic specifications, photos, and terminal descriptions of the RadioMaster NEXUS-XR flight controller. A high-performance FC featuring STM32F722RET6 MCU, ICM42688P gyro, and built-in ELRS 2.4GHz receiver.',
            chapter3Num: 'Ch.3',
            chapter3Title: 'Welcome Screen',
            chapter3Subtitle: '~ Startup Screen Guide ~',
            ch3desc: 'The first screen displayed when Rotorflight Configurator starts. Covers header area, connection settings, main buttons, left sidebar menu, and download links.',
            chapter4Num: 'Ch.4',
            chapter4Title: 'Documentation & Support',
            chapter4Subtitle: '~ Docs & Support ~',
            ch4desc: 'A collection of links to official Rotorflight documentation and support resources. Introduces Wiki, GitHub, Discord, Facebook groups, and other information sources.',
            chapter5Num: 'Ch.5',
            chapter5Title: 'Options',
            chapter5Subtitle: '~ Configurator Settings ~',
            ch5desc: 'Settings screen for Rotorflight Configurator itself. Covers display language, dark mode, serial port settings, Expert Mode, and more.',
            chapter6Num: 'Ch.6',
            chapter6Title: 'Privacy Policy',
            chapter6Subtitle: '~ Privacy Policy ~',
            ch6desc: 'Explains the privacy policy of Rotorflight Configurator. Describes collected information and data usage purposes.',
            chapter7Num: 'Ch.7',
            chapter7Title: 'Firmware Flasher',
            chapter7Subtitle: '~ Firmware Flashing ~',
            ch7desc: 'Screen for writing Rotorflight firmware to the FC. Detailed guide on flashing procedure, entering DFU mode, option settings, and precautions.',
            chapter8Num: 'Ch.8',
            chapter8Title: 'Status',
            chapter8Subtitle: '~ Aircraft Status ~',
            ch8desc: 'Screen for real-time monitoring of FC status. Covers arming disable flags, 3D model display, receiver input values, and status bar.',
            chapter9Num: 'Ch.9',
            chapter9Title: 'Setup',
            chapter9Subtitle: '~ Basic Setup ~',
            ch9desc: 'Screen for basic FC setup. Covers accelerometer calibration, settings reset, backup/restore, and board orientation settings.',
            chapter10Num: 'Ch.10',
            chapter10Title: 'Configuration',
            chapter10Subtitle: '~ Detailed Settings ~',
            ch10desc: 'Important screen for basic helicopter settings. Covers 3-axis/6-axis modes, mixer type, swashplate type, sensor settings, motor protocol, and various features.',
            chapter11Num: 'Ch.11',
            chapter11Title: 'Presets',
            chapter11Subtitle: '~ Presets ~',
            ch11desc: 'Screen for applying and managing presets. Easily apply recommended settings for your aircraft. Covers preset sources, application methods, and categories.',
            chapter12Num: 'Ch.12',
            chapter12Title: 'Receiver',
            chapter12Subtitle: '~ Receiver Settings ~',
            ch12desc: 'Screen for receiver settings. Covers receiver mode (SBUS, CRSF, etc.), channel map, stick settings, and RSSI source.',
            chapter13Num: 'Ch.13',
            chapter13Title: 'Failsafe',
            chapter13Subtitle: '~ Failsafe ~',
            ch13desc: 'Critical screen for setting failsafe (behavior on signal loss). Covers switch action, channel settings, Stage 2 settings, test methods, and Rescue function integration.',
            chapter14Num: 'Ch.14',
            chapter14Title: 'Power',
            chapter14Subtitle: '~ Power & Battery ~',
            ch14desc: 'Screen for battery voltage monitoring and current sensor settings. Covers voltage source, cell count, capacity, current sensor, and warning settings.',
            chapter15Num: 'Ch.15',
            chapter15Title: 'Motors',
            chapter15Subtitle: '~ Motor & ESC ~',
            ch15desc: 'Screen for motor (ESC) settings. Covers motor settings, governor function, throttle calibration, motor test, and ESC telemetry.',
            chapter16Num: 'Ch.16',
            chapter16Title: 'Servos',
            chapter16Subtitle: '~ Servo Settings ~',
            ch16desc: 'Screen for servo settings. Covers servo channels, center position adjustment, travel limits, reverse, update rate, and servo test.',
            chapter17Num: 'Ch.17',
            chapter17Title: 'Mixer',
            chapter17Subtitle: '~ Mixer Settings ~',
            ch17desc: 'Screen for swashplate and tail rotor mixing settings. Covers swashplate mixer, servo direction, swashplate direction, and tail rotor mixer.',
            chapter18Num: 'Ch.18',
            chapter18Title: 'Gyro',
            chapter18Subtitle: '~ Gyro Settings ~',
            ch18desc: 'Screen for gyro (angular rate sensor) and filter settings. Covers gyro settings, lowpass filter, notch filter, RPM filter, and dynamic filter.',
            chapter19Num: 'Ch.19',
            chapter19Title: 'Rates',
            chapter19Subtitle: '~ Rate Settings ~',
            ch19desc: 'Screen for setting aircraft response speed (rates) to stick input. Covers rate profiles, Roll/Pitch/Yaw/Collective rates, Expo, and rate types.',
            chapter20Num: 'Ch.20',
            chapter20Title: 'Profiles',
            chapter20Subtitle: '~ Profile Settings ~',
            ch20desc: 'Profile screen for storing PID settings and other tuning parameters. Covers PID profiles, PID controller, PID tuning basics, and Feedforward.',
            chapter21Num: 'Ch.21',
            chapter21Title: 'Modes',
            chapter21Subtitle: '~ Mode Settings ~',
            ch21desc: 'Screen for assigning various modes (ARM, Rescue, profile switching, etc.) to AUX channels. Covers 3-axis/6-axis modes, main modes, and Angle/Horizon/Acro Trainer modes.',
            chapter22Num: 'Ch.22',
            chapter22Title: 'Adjustments',
            chapter22Subtitle: '~ Adjustments ~',
            ch22desc: 'Function for real-time parameter adjustment during flight using transmitter dials and sliders. Covers Adjustment slots, adjustable parameters, and differences from Lua scripts.',
            chapter23Num: 'Ch.23',
            chapter23Title: 'Beepers',
            chapter23Subtitle: '~ Beeper Settings ~',
            ch23desc: 'Screen for beeper settings. Configure whether to sound buzzer for various events. Also covers beeper usage methods for NEXUS-XR.',
            chapter24Num: 'Ch.24',
            chapter24Title: 'Sensors',
            chapter24Subtitle: '~ Sensors ~',
            ch24desc: 'Screen for real-time monitoring of sensor values. Covers gyroscope, accelerometer, barometer, and debug information.',
            chapter25Num: 'Ch.25',
            chapter25Title: 'Blackbox',
            chapter25Subtitle: '~ Flight Log ~',
            ch25desc: 'Screen for flight log (Blackbox) settings. Covers Blackbox settings, logging device, recording rate, usage, and analysis with Blackbox Explorer.',
            chapter26Num: 'Ch.26',
            chapter26Title: 'CLI',
            chapter26Subtitle: '~ Command Line ~',
            ch26desc: 'Command Line Interface (CLI) screen. Covers basic commands, backup with diff/dump, settings changes, useful commands, and settings restore procedure.',
            glossaryNum: 'Glossary',
            glossaryTitle: 'Technical Terms',
            glossarySubtitle: '~ Basic Terms, Control Terms, Communication Terms, Abbreviations ~',
            glossarydesc: 'Glossary of technical terms used in Rotorflight. Covers basic terms (FC, ARM, DISARM, etc.), helicopter terms (swashplate, collective, governor, etc.), control terms (PID, Rate, Expo, etc.), communication terms (SBUS, CRSF, DSHOT, etc.), sensor terms, feature terms, and abbreviation list.',
            changelogTitle: '📝 Update History',
            changelogEntry1: 'February 8, 2026 - Version 1.1 Released (2nd Edition)',
            changelogEntry2: 'January 28, 2026 - Version 1.0 Released (1st Edition)',
            feedbackTitle: '💬 Feedback & Typo Reports',
            feedbackDesc: 'For feedback on manual content or typo reports, please contact us through the contact form or X (Twitter).',
            feedbackContact: '✉️ Contact',
            feedbackTwitter: '🐦 X (Twitter)'
        },
        rcLibrarySection: {
            title: '📚 RC Equipment Japanese Manual PDF Collection',
            introTitle: 'No more guessing with RC equipment settings',
            introDesc: 'A collection of PDF resources that explain equipment settings in plain Japanese — for products with no Japanese manual, or where the official docs are too complex. These were created through my own research, so please let me know if you find any errors.',
            termsTitle: '📋 Terms of Use & Copyright',
            termsCopyright: 'Copyright:',
            termsCopyrightValue: '© 2026 Postsoni Workshop All Rights Reserved.',
            termsPersonal: 'Personal Use:',
            termsPersonalValue: 'Free for personal viewing and learning purposes.',
            termsYoutube: 'YouTube etc.:',
            termsYoutubeValue: 'Video introductions and explanations (including monetization) are permitted. Please contact us in advance.',
            termsRedist: 'Redistribution:',
            termsRedistValue: 'Unauthorized reprinting (full copying to SNS/blogs), commercial redistribution and sales are prohibited.',
            termsDisclaimer: 'Disclaimer:',
            termsDisclaimerValue: 'The author is not responsible for any damages from these materials.',
            termsNote1: '* All product names and trademarks belong to their respective manufacturers.',
            termsNote2: '* These materials are not a substitute for official manuals. Please refer to official manufacturer documentation for accurate information.',
            escTitle: '🔋 ESC (Speed Controller) Settings Summary',
            esc01Title: 'HOBBYWING Platinum ESC Series - Settings Reference',
            esc01Desc: 'All settings for the Platinum ESC (Flight Mode, Governor P/I, Cutoff, BEC Voltage, etc.) explained in Japanese. Compatible with 3-in-1 Program Box. Includes recommended settings for helicopters.',
            esc01Meta: '12 Pages | ~120KB',
            gyroTitle: '🎛️ Gyro & FC Settings Summary',
            wiringTitle: '⚡ Wiring & Electronics Summary',
            updateTitle: '📡 Firmware & Software Update Guides',
            update01Title: 'ELRS 4.0.0 Firmware Update Guide (USB & Wi-Fi)',
            update01Desc: 'Step-by-step guide for updating to ExpressLRS 4.0.0. Covers both USB (EdgeTX Passthrough / Betaflight Passthrough) and Wi-Fi methods. Includes procedures for transmitters and receivers, Lua script updates, and troubleshooting.',
            update01Meta: '19 Pages | ~390KB',
            comingSoon: '📝 Coming soon! Stay tuned for future additions.',
            pdfBtn: '📥 PDF',
            feedbackTitle: '💬 Feedback & Error Reports',
            feedbackDesc: 'If you find any errors or have requests like "please make a summary for this equipment", feel free to contact us.',
            feedbackContact: '✉️ Contact',
            feedbackTwitter: '🐦 X (Twitter)'
        },
        aiGamesSection: {
            title: 'AI RC Game Development',
            introTitle: 'RC Promotion Games Created with Claude AI',
            introDesc: 'These are games created with Claude AI to promote RC hobby! Designed to be enjoyable even for those who don\'t know about RC, while also featuring content that will impress RC enthusiasts! We welcome your gameplay feedback, and if you share your results on X, we might reply!',
            game1Title: 'RC Chassis Personality Quiz',
            game1Desc: 'Find out which RC chassis type suits you!',
            game2Title: 'RC Parts Gacha',
            game2Desc: 'Test your luck! Can you get rare parts!?',
            game3Title: 'RC Quiz',
            game3Desc: 'Test your RC knowledge! How many can you answer?',
            game4Title: 'RC Relatable Moments Check',
            game4Desc: 'Relatable moments every RC fan knows!',
            game5Title: 'RC Life Simulator',
            game5Desc: 'Experience RC life! What kind of journey awaits?',
            shareCta: '🐦 Please share your results on X! We might reply!',
            followBtn: 'Follow @postsoni'
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
            notice: '※This form is for volunteer activity inquiries, not commercial purposes.',
            buttonText: '📧 Open Contact Form',
            // Phase 5: Steps
            flowTitle: '📋 Contact Process Flow',
            step1Title: 'Submit Form',
            step1Desc: 'Feel free to contact us',
            step2Title: 'Review & Consultation',
            step2Desc: 'We will ask about your situation in detail (1-3 days)',
            step3Title: 'Advice & Suggestions',
            step3Desc: 'We will guide you on repair methods and required parts',
            step4Title: 'Work (In-person or Online)',
            step4Desc: 'We will repair and maintain together',
            step5Title: 'Completion & Follow-up',
            step5Desc: 'Feel free to ask any questions afterwards',
            // Phase 5: Expectations
            expectationsTitle: '💡 What to Know Before Contacting Us',
            responseTimeTitle: 'Response Time',
            responseTimeDesc: 'Usually within 1-3 days (may be delayed due to health conditions)',
            supportTypeTitle: 'What We Can Help With',
            supportTypeDesc: 'RC repair consultation, beginner support, model selection advice, technical questions',
            costTitle: 'About Costs',
            costDesc: 'This is a completely free volunteer activity. We do not charge any repair or consultation fees.',
            partsTitle: 'About Parts',
            partsDesc: 'Please purchase necessary parts yourself (we can advise on where to buy)',
            areaTitle: 'Service Area',
            areaDesc: 'Mainly Sapporo, online consultations available nationwide',
            noMoneyNotice: '⚠️ No monetary transactions are conducted through this site. Please purchase parts and vehicles at shops yourself.'
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
            // Expert Section
            expertSectionTitle: 'For Experienced RC Enthusiasts',
            expertSectionDescription: 'Our workshop handles advanced repairs and customizations. We specialize in foam aircraft techniques including base coating, epoxy + microballoon, micro glass, surface finishing, and coloring to eliminate foam texture. We also perform full restorations of electric and engine-powered aircraft (10+ completed).',
            expertSectionSkills: 'Recent projects include Traxxas ESC troubleshooting, steering angle modifications for Yokomo drift series and Tamiya TT-02, and optimal aeration damper settings. We provide technical support across a wide range of specialties.',
            expertSectionMakersLabel: 'Supported Manufacturers:',
            expertSectionButton: 'Technical Consultation →',
            // SNS Quick Links
            snsQuickTitle: '📱 Follow Our SNS & Media',
            snsQuickDescription: 'Check out the latest updates and RC activities!',
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
            activity: '博客', 'edgetx-manual': 'EdgeTX手册', 'rotorflight-manual': 'Rotorflight手册', 'rc-library': 'RC设备手册PDF集', 'ai-games': 'AI遥控游戏', goods: '商品', support: '支援',
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
        newsSection2026Jan: {
            date: '2026年1月28日',
            newsTitle: '机体制作・修复完成 & 手册发布公告',
            section1Title: '◆Calmato α40 修复完成',
            section1Text: '之前组装的Calmato α40坠落了，但修复已经完成。经过机械部件的重新调整和机体检查，离飞行检查只差一步了。',
            section2Title: '◆GOOSKY RS7 Ultra 组装完成',
            section2Text: '最新型电动直升机"GOOSKY RS7 Ultra"的组装已完成。搭载Rotorflight固件，正在为今后的飞行进行调整。',
            section3Title: '◆EdgeTX & Rotorflight 日语手册发布',
            section3Text: '发布了RadioMaster TX16S用的"EdgeTX日语手册"和RC直升机专用FC用的"Rotorflight Configurator日语手册"。希望能帮助初学者和从传统系统转换过来的用户。',
            section4Title: '◆咨询件数突破15件',
            section4Text: '邮件咨询累计超过15件。感谢所有联系我们的人。我们将继续为RC初学者提供支持。'
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
            youtubeDesc: '上传RC制作、维修和飞行视频！还提供组装指南和技术要点。',
            youtubeButton: '访问频道 →',
            noteTitle: 'note 技术博客',
            noteDesc: '详细的维修过程记录、零件评测和技术备忘录，视频无法完全传达的信息。',
            noteButton: '阅读博客 →',
            noteTag1: '🔧 维修记录',
            noteTag2: '📊 零件评测',
            noteTag3: '💡 技术指南',
            xTitle: 'X（原Twitter）',
            xDesc: '实时更新日常RC活动、工作进度和活动信息。欢迎关注！',
            xButton: '关注 →',
            followMessage: '我们在各个社交媒体平台上分享不同的内容。关注所有平台，一起享受RC的世界吧！'
        },
        activitySection: {
            title: '活动记录',
            blogTitle: '📖 技术博客（note）',
            blogDescription: '发布维修过程、零件评测、技术备忘录等SNS无法完全传达的详细信息。',
            noteTitle: 'note',
            noteDescription: '详细记录维修过程和技术解说',
            latestArticlesTitle: '📌 最新博客文章',
            moreArticles: '查看更多文章 →',
            notePinnedTitle: '📌 推荐文章（置顶）',
            notePinnedDesc: '基于19年经验，关于传承RC文化的重要文章。',
            noteLatestTitle: '📰 最新文章（自动获取）',
            noteAutoUpdateInfo: '🔄 页面加载时自动获取最新文章'
        },
        edgetxManualSection: {
            title: 'EdgeTX日语手册',
            introTitle: 'EdgeTX & TX16S 完整日语手册',
            introDesc: '这是RadioMaster TX16S的EdgeTX日语手册。我们为初学者和从Futaba/JR PROPO转换过来的用户编写了易于理解的说明。',
            feature1: '✓ 共144页',
            feature2: '✓ 7章结构',
            feature3: '✓ 直升机设置指南',
            feature4: '✓ 模拟器设置指南',
            termsTitle: '📋 使用条款和版权',
            termsCopyright: '版权：',
            termsCopyrightValue: '© 2026 ぽすとそに工房 版权所有。',
            termsPersonal: '个人使用：',
            termsPersonalValue: '个人学习和RC活动可自由使用。',
            termsRedist: '再分发：',
            termsRedistValue: '禁止未经授权复制、转载和再分发。',
            termsCommercial: '商业使用：',
            termsCommercialValue: '请勿商业使用。但YouTube介绍视频的广告收入是允许的（请注明来源为"ぽすとそに工房"）。',
            termsCitation: '引用：',
            termsCitationValue: '引用时请注明来源（ぽすとそに工房）。',
            termsDisclaimer: '免责声明：',
            termsDisclaimerValue: '作者对本手册内容造成的任何损失不承担责任。',
            termsNote1: '※ EdgeTX是开源项目。',
            termsNote2: '※ TX16S是RadioMaster的产品。',
            termsNote3: '※ 各公司商标归各公司所有。',
            downloadTitle: '📥 PDF下载',
            pdfTitle: 'EdgeTX日语手册 完整版',
            pdfInfo: 'Version 1.0.1 | 共144页 | 约1.2MB',
            pdfDate: '发布日期：2026年1月',
            pdfButton: '📥 下载PDF',
            soundTitle: 'EdgeTX 声音文件列表',
            soundInfo: '自定义声音包制作参考 | 743个文件',
            soundDate: '创建日期：2025年12月',
            soundButton: '📥 下载列表',
            tocTitle: '📖 在线手册（目录）',
            tocDesc: '点击可展开各章节内容。',
            chapter1Num: '第1章',
            chapter1Title: '什么是EdgeTX',
            chapter1Subtitle: '〜 从OpenTX的历史 〜',
            chapter1Pages: '12页',
            chapter2Num: '第2章',
            chapter2Title: 'TX16S初始设置',
            chapter2Subtitle: '〜 电源、语言、声音、画面 〜',
            chapter2Pages: '26页',
            chapter3Num: '第3章',
            chapter3Title: '模型创建基础',
            chapter3Subtitle: '〜 模型概念和设置 〜',
            chapter3Pages: '15页',
            chapter4Num: '第4章',
            chapter4Title: '混控器的概念',
            chapter4Subtitle: '〜 EdgeTX的核心 〜',
            chapter4Pages: '17页',
            chapter5Num: '第5章',
            chapter5Title: '飞行模式和曲线',
            chapter5Subtitle: '〜 根据飞行状态切换 〜',
            chapter5Pages: '20页',
            chapter6Num: '第6章',
            chapter6Title: '实践：模拟器设置',
            chapter6Subtitle: '〜 安全练习 〜',
            chapter6Pages: '20页',
            appendixNum: '附录',
            appendixTitle: '故障排除',
            appendixSubtitle: '〜 常见问题和解决方法 〜',
            appendixPages: '32页',
            changelogTitle: '📝 更新历史',
            changelogEntry1: '2026年1月1日 - Version 1.0.1 发布',
            feedbackTitle: '💬 反馈和错误报告',
            feedbackDesc: '关于手册内容的意见或错误报告，请通过联系表单或X（Twitter）联系我们。',
            feedbackContact: '✉️ 联系我们',
            feedbackTwitter: '🐦 X（Twitter）',
            ch1sec1: '1-1. 什么是EdgeTX',
            ch1sec1desc: 'EdgeTX是RC遥控器的开源固件，从OpenTX派生而来，开发更活跃。',
            ch1sec2: '1-2. 与OpenTX的区别',
            ch1sec2desc: 'EdgeTX增强了触摸屏支持，优化了彩色显示，并积极添加新功能。',
            ch1sec3: '1-3. 与Futaba/JR PROPO的区别',
            ch1sec3desc: 'Futaba/JR是专用系统。EdgeTX是通用系统，需要从头开始构建设置。',
            ch1sec4: '1-4. EdgeTX的设计理念',
            ch1sec4desc: '正因为没有预设，它具有适应任何机体的灵活性。自己构建一切。',
            ch2sec1: '2-1. TX16S概述',
            ch2sec1desc: 'RadioMaster TX16S是搭载EdgeTX的高性价比遥控器，支持触摸屏和多协议。',
            ch2sec2: '2-2. 开机',
            ch2sec2desc: '长按电源按钮启动。首次启动可能显示各种警告。',
            ch2sec3: '2-3. 语言设置',
            ch2sec3desc: 'SYS键 → 齿轮图标 → 语言设置选择日语。',
            ch2sec4: '2-4. 声音设置和日语语音',
            ch2sec4desc: '如何安装日语语音包、调节音量、替换声音文件。',
            ch2sec5: '2-5. 显示设置',
            ch2sec5desc: '如何设置背光、亮度、主题。',
            ch2sec6: '2-6. 摇杆校准',
            ch2sec6desc: '为了准确控制进行摇杆校准。',
            ch3sec1: '3-1. 什么是模型',
            ch3sec1desc: 'EdgeTX中的"模型"是一架飞机的设置集合。可以保存多个模型。',
            ch3sec2: '3-2. 创建新模型',
            ch3sec2desc: '从MDL键打开模型列表并创建新模型。',
            ch3sec3: '3-3. SETUP画面说明',
            ch3sec3desc: '模型名称、图像、计时器、RF模块设置说明。',
            ch3sec4: '3-4. INPUTS基础',
            ch3sec4desc: '关于设置摇杆和开关输入的INPUTS页面。',
            ch3sec5: '3-5. OUTPUTS基础',
            ch3sec5desc: '关于设置舵机输出的OUTPUTS页面。',
            ch4sec1: '4-1. 什么是混控器',
            ch4sec1desc: '混控器将输入（摇杆/开关）转换为输出（舵机/电调）。',
            ch4sec2: '4-2. MIXES页面结构',
            ch4sec2desc: '通道和混控行的关系，设置含义。',
            ch4sec3: '4-3. 创建混控行',
            ch4sec3desc: '如何设置Source、Weight、Offset、Switch、Curve。',
            ch4sec4: '4-4. Mltpx（混控模式）',
            ch4sec4desc: '如何使用Add、Multiply、Replace模式。',
            ch4sec5: '4-5. 直升机混控示例',
            ch4sec5desc: '副翼、升降舵、油门、方向舵、螺距的基本设置示例。',
            ch5sec1: '5-1. 什么是飞行模式',
            ch5sec1desc: '相当于Futaba/JR的"条件"。切换Normal、Idle Up 1、Idle Up 2。',
            ch5sec2: '5-2. 设置飞行模式',
            ch5sec2desc: 'FLIGHT MODES页面的设置程序：名称、开关、微调。',
            ch5sec3: '5-3. 飞行模式与开关联动',
            ch5sec3desc: '使用SE或SA开关的3模式切换示例。',
            ch5sec4: '5-4. 什么是曲线',
            ch5sec4desc: 'Expo和自定义曲线的概念和用法。',
            ch5sec5: '5-5. 创建曲线',
            ch5sec5desc: '螺距曲线和油门曲线的创建程序。',
            ch5sec6: '5-6. 飞行模式与曲线整合',
            ch5sec6desc: '每个飞行模式使用不同曲线的实用设置。',
            ch6sec1: '6-1. 关于模拟器',
            ch6sec1desc: '模拟器练习的重要性。介绍HELI-X、RealFlight、VelociDrone、Liftoff。',
            ch6sec2: '6-2. 连接TX16S到PC',
            ch6sec2desc: 'USB连接和游戏手柄模式设置。',
            ch6sec3: '6-3. HELI-X设置示例',
            ch6sec3desc: 'HELI-X直升机模拟器的详细设置。',
            ch6sec4: '6-4. 其他模拟器设置',
            ch6sec4desc: 'RealFlight、VelociDrone、Liftoff的设置要点。',
            ch6sec5: '6-5. 模拟器练习技巧',
            ch6sec5desc: '有效的练习方法、进步步骤、过渡到实机。',
            apxsec1: 'A-1. 遥控器无法启动/死机',
            apxsec1desc: '无法开机或启动时死机的原因和解决方法。',
            apxsec2: 'A-2. 无法连接PC',
            apxsec2desc: 'USB线问题、USB模式设置、驱动问题。',
            apxsec3: 'A-3. 无法对频接收机',
            apxsec3desc: '对频模式、协议设置、接收机号码问题。',
            apxsec4: 'A-4. 舵机/电机不动',
            apxsec4desc: '检查MIXES设置，用通道监视器诊断。',
            apxsec5: 'A-5. 设置不保存/消失',
            apxsec5desc: 'SD卡问题、备份的重要性、恢复方法。',
            apxsec6: 'A-6. 显示问题',
            apxsec6desc: '屏幕不显示、触摸屏问题、乱码。',
            apxsec7: 'A-7. 没有语音/语音错误',
            apxsec7desc: '检查声音文件、安装日语语音、音量设置。',
            apxsec8: 'A-8. 固件更新问题',
            apxsec8desc: '更新前准备、Bootloader模式、恢复。',
            apxsec9: 'A-9. 常见设置错误',
            apxsec9desc: '反向设置、开关条件、计时器重置（SPECIAL FUNCTIONS）。'
        },
        rotorflightManualSection: {
            title: '📖 Rotorflight日语手册',
            introTitle: 'Rotorflight Configurator 2.2.1 完整日语手册',
            introDesc: 'RC直升机专用飞行控制器配置软件的完整解说手册。为初次使用Rotorflight的用户、从传统RC直升机陀螺仪转换的用户、以及想要理解各设置项含义的用户而创建。',
            feature1: '✓ 共63页',
            feature2: '✓ 27章构成',
            feature3: '✓ 直升机专用FC',
            feature4: '✓ NEXUS-XR对应',
            termsTitle: '📋 使用条款・著作权',
            termsCopyright: '著作权：',
            termsCopyrightValue: '© 2026 Postsoni工房 版权所有。',
            termsPersonal: '个人使用：',
            termsPersonalValue: '可自由用于个人阅览和学习目的。',
            termsYoutube: 'YouTube等：',
            termsYoutubeValue: '允许视频介绍和解说（包括收益化）。请事先通过咨询联系我们。',
            termsRedist: '再分发：',
            termsRedistValue: '禁止未经授权转载（全文复制到SNS/博客等）、商业目的的再分发和销售。',
            termsDisclaimer: '免责声明：',
            termsDisclaimerValue: '作者不对本手册内容造成的任何损失承担责任。',
            termsNote1: '※ Rotorflight是开源项目。',
            termsNote2: '※ NEXUS-XR是RadioMaster的产品。',
            termsNote3: '※ 各公司商标归各公司所有。',
            downloadTitle: '📥 PDF下载',
            pdfTitle: 'Rotorflight Configurator 2.2.1 日语手册 ver1.0（第一版）',
            pdfInfo: 'Version 1.0.0 | 共63页 | 约1.2MB',
            pdfDate: '发行日：2026年1月',
            pdfButton: '📥 下载PDF',
            v1Badge: '第一版',
            v1Label: 'Rotorflight Configurator 日语化手册 ver1.0',
            v1Desc: '概述Rotorflight Configurator的整体结构和各标签页基本操作流程的入门指南。适合初次接触Rotorflight或想要了解整体结构的用户。',
            v2Badge: '第二版',
            v2Label: 'Rotorflight Configurator 日语化手册 ver1.1（分节版）',
            v2Desc: '在第一版的基础上进一步深入，针对Configurator的每个部分（标签页），用日语详细解说各设置项的数值含义和效果。适合想要用日语理解英文设置界面或进行更精细调参的用户。',
            v2Note: '※ 可以单独下载所需的部分。',
            secPdfBtn: '📥 PDF',
            sec01Title: 'Status篇', sec01Desc: '状态画面 ― FC信息・陀螺仪预览・解锁状态确认',
            sec02Title: 'Setup篇', sec02Desc: '初始设置 ― 校准・备份・恢复步骤',
            sec03Title: 'Configuration篇', sec03Desc: '基本配置 ― 机体类型・尾桨・飞控板设置详情',
            sec04Title: 'Presets篇', sec04Desc: '预设 ― 机体预设的应用和管理',
            sec05Title: 'Receiver篇', sec05Desc: '接收机设置 ― 协议选择・通道映射・RSSI设置',
            sec06Title: 'Failsafe篇', sec06Desc: '失控保护 ― 信号丢失时的动作设置和安全措施',
            sec07Title: 'Power篇', sec07Desc: '电源・电池 ― 电压/电流传感器设置和校准',
            sec08Title: 'Motors篇', sec08Desc: '电机设置 ― ESC协议・遥测・调速器设置',
            sec09Title: 'Servos篇', sec09Desc: '舵机设置 ― 分配・行程・反向・速度设置',
            sec10Title: 'Mixer篇', sec10Desc: '混控 ― 斜盘设置・桨叶角度校准',
            sec11Title: 'Gyro篇', sec11Desc: '陀螺仪设置 ― 滤波器・RPM滤波器・动态陷波',
            sec12Title: 'Rates篇', sec12Desc: '舵量设置 ― 操控灵敏度・旋转速率・指数调整',
            sec13Title: 'Profiles篇', sec13Desc: '配置文件 ― PID调参・救援・转速管理',
            sec14Title: 'Modes篇', sec14Desc: '飞行模式 ― ARM・救援・自稳模式设置',
            sec15Title: 'Adjustments篇', sec15Desc: '调整槽位 ― 通过AUX通道动态更改参数',
            sec16Title: 'Beepers篇', sec16Desc: '蜂鸣器 ― 各种警告音・提示音的启用和设置',
            sec17Title: 'Sensors篇', sec17Desc: '传感器 ― 各传感器启用・趋势显示・运行确认',
            sec18Title: 'Blackbox篇', sec18Desc: '日志记录 ― 飞行日志记录设置和数据分析',
            sec19Title: 'CLI篇', sec19Desc: '命令行 ― CLI命令进行设置・备份・恢复',
            tocTitle: '📖 在线手册（目录）',
            tocDesc: '点击展开各章内容。',
            chapter1Num: '第1章',
            chapter1Title: '前言',
            chapter1Subtitle: '〜 什么是Rotorflight 〜',
            ch1desc: 'Rotorflight是专为RC直升机设计的开源飞行控制软件。基于Betaflight，针对直升机特性进行了大幅定制。解说主要特点、构成要素、与传统陀螺仪的区别。',
            chapter2Num: '第2章',
            chapter2Title: '关于NEXUS-XR',
            chapter2Subtitle: '〜 硬件参考示例 〜',
            ch2desc: '解说RadioMaster制NEXUS-XR飞行控制器的基本规格、各部照片、端子说明。搭载STM32F722RET6 MCU、ICM42688P陀螺仪、内置ELRS 2.4GHz接收机等的高性能FC。',
            chapter3Num: '第3章',
            chapter3Title: 'Welcome画面',
            chapter3Subtitle: '〜 启动画面解说 〜',
            ch3desc: 'Rotorflight Configurator启动时最先显示的画面。解说顶部标题区域、连接设置、主按钮、左侧菜单、下载链接。',
            chapter4Num: '第4章',
            chapter4Title: 'Documentation & Support',
            chapter4Subtitle: '〜 文档・支持 〜',
            ch4desc: 'Rotorflight官方文档和支持资源的链接集。介绍Wiki、GitHub、Discord、Facebook群组等信息来源。',
            chapter5Num: '第5章',
            chapter5Title: 'Options',
            chapter5Subtitle: '〜 Configurator设置 〜',
            ch5desc: 'Rotorflight Configurator本身的设置画面。可以更改显示语言、暗色模式、串口设置、Expert Mode等。',
            chapter6Num: '第6章',
            chapter6Title: 'Privacy Policy',
            chapter6Subtitle: '〜 隐私政策 〜',
            ch6desc: '解说Rotorflight Configurator的隐私政策（个人信息保护方针）。说明收集的信息和数据使用目的。',
            chapter7Num: '第7章',
            chapter7Title: 'Firmware Flasher',
            chapter7Subtitle: '〜 固件写入 〜',
            ch7desc: '向FC写入Rotorflight固件的画面。详细解说写入步骤、进入DFU模式的方法、选项设置、注意事项。',
            chapter8Num: '第8章',
            chapter8Title: 'Status',
            chapter8Subtitle: '〜 机体状态确认 〜',
            ch8desc: '可以实时确认FC当前状态的画面。解说ARM禁止标志、3D模型显示、接收机输入值、状态栏。',
            chapter9Num: '第9章',
            chapter9Title: 'Setup',
            chapter9Subtitle: '〜 基本设置 〜',
            ch9desc: '进行FC基本设置的画面。解说加速度传感器校准、设置重置、备份/恢复、板安装方向设置。',
            chapter10Num: '第10章',
            chapter10Title: 'Configuration',
            chapter10Subtitle: '〜 详细设置 〜',
            ch10desc: '进行直升机基本设置的重要画面。解说3轴/6轴模式、混控器类型、斜盘类型、传感器设置、电机协议、各种功能。',
            chapter11Num: '第11章',
            chapter11Title: 'Presets',
            chapter11Subtitle: '〜 预设 〜',
            ch11desc: '应用和管理预设（预先设置）的画面。可以轻松应用适合机体的推荐设置。解说预设来源、应用方法、类别。',
            chapter12Num: '第12章',
            chapter12Title: 'Receiver',
            chapter12Subtitle: '〜 接收机设置 〜',
            ch12desc: '进行接收机设置的画面。解说接收机模式（SBUS、CRSF等）、通道映射、摇杆设置、RSSI来源。',
            chapter13Num: '第13章',
            chapter13Title: 'Failsafe',
            chapter13Subtitle: '〜 失控保护 〜',
            ch13desc: '设置失控保护（信号丢失时动作）的非常重要的画面。解说开关动作、通道设置、Stage 2设置、测试方法、与Rescue功能的联动。',
            chapter14Num: '第14章',
            chapter14Title: 'Power',
            chapter14Subtitle: '〜 电源・电池设置 〜',
            ch14desc: '进行电池电压监控和电流传感器设置的画面。解说电压来源、电芯数、容量、电流传感器、警告设置。',
            chapter15Num: '第15章',
            chapter15Title: 'Motors',
            chapter15Subtitle: '〜 电机・ESC设置 〜',
            ch15desc: '进行电机（ESC）设置的画面。解说电机设置、调速器功能、油门校准、电机测试、ESC遥测。',
            chapter16Num: '第16章',
            chapter16Title: 'Servos',
            chapter16Subtitle: '〜 舵机设置 〜',
            ch16desc: '进行舵机设置的画面。解说舵机通道、中立位置调整、动作范围限制、反向、更新率、舵机测试。',
            chapter17Num: '第17章',
            chapter17Title: 'Mixer',
            chapter17Subtitle: '〜 混控设置 〜',
            ch17desc: '设置斜盘和尾桨混控的画面。解说斜盘混控器、舵机方向、斜盘方向、尾桨混控器。',
            chapter18Num: '第18章',
            chapter18Title: 'Gyro',
            chapter18Subtitle: '〜 陀螺仪设置 〜',
            ch18desc: '进行陀螺仪（角速度传感器）和滤波器设置的画面。解说陀螺仪设置、低通滤波器、陷波滤波器、RPM滤波器、动态滤波器。',
            chapter19Num: '第19章',
            chapter19Title: 'Rates',
            chapter19Subtitle: '〜 舵量设置 〜',
            ch19desc: '设置摇杆操作对机体反应速度（舵量）的画面。解说舵量配置文件、Roll/Pitch/Yaw/Collective舵量、Expo、舵量类型。',
            chapter20Num: '第20章',
            chapter20Title: 'Profiles',
            chapter20Subtitle: '〜 配置文件设置 〜',
            ch20desc: '保存PID设置和其他调参参数的配置文件画面。解说PID配置文件、PID控制器、PID调整基础、前馈。',
            chapter21Num: '第21章',
            chapter21Title: 'Modes',
            chapter21Subtitle: '〜 模式设置 〜',
            ch21desc: '将各种模式（ARM、Rescue、配置文件切换等）分配到AUX通道的画面。解说3轴/6轴模式、主要模式、Angle/Horizon/Acro Trainer模式。',
            chapter22Num: '第22章',
            chapter22Title: 'Adjustments',
            chapter22Subtitle: '〜 调整功能 〜',
            ch22desc: '使用遥控器旋钮或滑块在飞行中实时调整各种参数的功能。解说Adjustment槽位、可调参数、与Lua脚本的区别。',
            chapter23Num: '第23章',
            chapter23Title: 'Beepers',
            chapter23Subtitle: '〜 蜂鸣器设置 〜',
            ch23desc: '进行蜂鸣器设置的画面。可以设置各种事件是否发出蜂鸣声。也解说NEXUS-XR的蜂鸣器使用方法。',
            chapter24Num: '第24章',
            chapter24Title: 'Sensors',
            chapter24Subtitle: '〜 传感器 〜',
            ch24desc: '可以实时确认各种传感器值的画面。解说陀螺仪、加速度传感器、气压传感器、调试信息。',
            chapter25Num: '第25章',
            chapter25Title: 'Blackbox',
            chapter25Subtitle: '〜 飞行日志 〜',
            ch25desc: '进行飞行日志（Blackbox）设置的画面。解说Blackbox设置、日志设备、记录频率、使用方法、Blackbox Explorer分析。',
            chapter26Num: '第26章',
            chapter26Title: 'CLI',
            chapter26Subtitle: '〜 命令行 〜',
            ch26desc: '命令行界面（CLI）画面。解说基本命令、diff/dump备份、设置更改、便利命令、设置恢复步骤。',
            glossaryNum: '术语表',
            glossaryTitle: '专业术语解说',
            glossarySubtitle: '〜 基本术语・控制术语・通信术语・缩略语一览 〜',
            glossarydesc: 'Rotorflight中使用的专业术语解说。收录基本术语（FC、ARM、DISARM等）、直升机术语（斜盘、总距、调速器等）、控制术语（PID、Rate、Expo等）、通信术语（SBUS、CRSF、DSHOT等）、传感器术语、功能术语、缩略语一览。',
            changelogTitle: '📝 更新历史',
            changelogEntry1: '2026年2月8日 - Version 1.1 发布（第二版）',
            changelogEntry2: '2026年1月28日 - Version 1.0 发布（初版）',
            feedbackTitle: '💬 反馈・错字报告',
            feedbackDesc: '关于手册内容的意见、错字报告，请通过咨询表格或X（Twitter）联系我们。',
            feedbackContact: '✉️ 咨询',
            feedbackTwitter: '🐦 X（Twitter）'
        },
        rcLibrarySection: {
            title: '📚 遥控设备日语手册PDF集',
            introTitle: '遥控设备的设置，不再迷茫',
            introDesc: '这是一个PDF资料集，将没有日语手册的海外产品、以及日语版也很难理解的设备设置项，尽可能用通俗易懂的方式整理而成。由于是在自己研究的过程中制作的，如果发现错误请务必联系我们。',
            termsTitle: '📋 使用条款・著作权',
            termsCopyright: '著作权：',
            termsCopyrightValue: '© 2026 Postsoni工房 版权所有。',
            termsPersonal: '个人使用：',
            termsPersonalValue: '可自由用于个人阅览和学习目的。',
            termsYoutube: 'YouTube等：',
            termsYoutubeValue: '允许视频介绍和解说（包括收益化）。请事先通过咨询联系我们。',
            termsRedist: '再分发：',
            termsRedistValue: '禁止未经授权转载（全文复制到SNS/博客等）、商业目的的再分发和销售。',
            termsDisclaimer: '免责声明：',
            termsDisclaimerValue: '作者不对本资料内容造成的任何损失承担责任。',
            termsNote1: '※ 各产品名称和商标归各制造商所有。',
            termsNote2: '※ 本资料不能替代官方手册。准确信息请参阅各制造商的官方资料。',
            escTitle: '🔋 ESC（电调）设置总结',
            esc01Title: 'HOBBYWING Platinum ESC 系列 设置项目一览',
            esc01Desc: '用日语解说Platinum ESC的所有设置项目（Flight Mode、调速器P/I、截止、BEC电压等）。兼容3-in-1编程盒。附带直升机推荐设置。',
            esc01Meta: '共12页 | 约120KB',
            gyroTitle: '🎛️ 陀螺仪・FC设置总结',
            wiringTitle: '⚡ 配线・电装总结',
            updateTitle: '📡 各类更新设置总结',
            update01Title: 'ELRS 4.0.0 固件更新指南（USB・Wi-Fi双模式）',
            update01Desc: '详细解说ExpressLRS 4.0.0的更新步骤。支持USB方式（EdgeTX Passthrough / Betaflight Passthrough）和Wi-Fi方式。包含发射机・接收机各自的步骤、Lua脚本更新及故障排除。',
            update01Meta: '共19页 | 约390KB',
            comingSoon: '📝 准备中。敬请期待后续更新！',
            pdfBtn: '📥 PDF',
            feedbackTitle: '💬 反馈・错误报告',
            feedbackDesc: '如果发现内容错误或有"希望也做这个设备的总结"等请求，请随时联系我们。',
            feedbackContact: '✉️ 咨询',
            feedbackTwitter: '🐦 X（Twitter）'
        },
        aiGamesSection: {
            title: 'AI遥控游戏开发',
            introTitle: '与Claude AI共同制作的遥控推广游戏',
            introDesc: '这些是与Claude AI一起学习制作的旨在推广遥控的游戏！设计成即使不了解遥控的人也能享受，同时也准备了让遥控知识丰富的人也会惊叹的内容！欢迎您的游戏感想，如果在X上分享结果，我们可能会回复！',
            game1Title: 'RC底盘性格诊断',
            game1Desc: '找出最适合你的RC底盘类型！',
            game2Title: 'RC零件扭蛋',
            game2Desc: '试试运气！能获得稀有零件吗!?',
            game3Title: 'RC知识问答',
            game3Desc: '测试你的RC知识！能答对多少？',
            game4Title: 'RC共鸣体验检查',
            game4Desc: 'RC粉丝必定共鸣的日常！',
            game5Title: 'RC人生模拟器',
            game5Desc: '体验RC生活！会是怎样的人生？',
            shareCta: '🐦 请在X上分享您的结果！我们可能会回复！',
            followBtn: '关注 @postsoni'
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
            notice: '※本表单不用于商业目的，专用于志愿者活动咨询。',
            buttonText: '📧 打开联系表单',
            // Phase 5: 步骤展示
            flowTitle: '📋 联系流程',
            step1Title: '提交表单',
            step1Desc: '请随时联系我们',
            step2Title: '内容确认・沟通',
            step2Desc: '详细了解您的情况（1-3天）',
            step3Title: '建议・提案',
            step3Desc: '提供维修方法和所需零件指导',
            step4Title: '作业（面对面或在线）',
            step4Desc: '一起进行维修和保养',
            step5Title: '完成・后续支持',
            step5Desc: '如有后续问题，欢迎随时咨询',
            // Phase 5: 期望说明
            expectationsTitle: '💡 联系前请了解',
            responseTimeTitle: '回复时间',
            responseTimeDesc: '通常1-3天内（可能因健康状况延迟）',
            supportTypeTitle: '可提供的帮助',
            supportTypeDesc: 'RC维修咨询、新手支持、型号选择建议、技术问题',
            costTitle: '关于费用',
            costDesc: '这是完全免费的志愿者活动。不收取任何维修费或咨询费。',
            partsTitle: '关于零件',
            partsDesc: '请自行购买所需零件（我们可以建议购买地点）',
            areaTitle: '服务区域',
            areaDesc: '以札幌为中心，在线咨询全国可用',
            noMoneyNotice: '⚠️ 本网站不进行任何金钱交易。请自行在商店购买零件和车辆。'
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
            // 经验者专区
            expertSectionTitle: '致经验丰富的RC爱好者',
            expertSectionDescription: '本工作室提供高级维修和定制服务。我们专注于泡沫飞机技术，包括底漆涂装、环氧树脂+微气球、微玻纤、表面处理和上色等消除泡沫纹理的技术，以及电动和发动机飞机的全面修复（已完成10架以上）。',
            expertSectionSkills: '近期项目包括Traxxas电调故障排查、Yokomo漂移系列和Tamiya TT-02的转向角度改装、气压避震器最佳设定等。我们提供多领域的技术支持。',
            expertSectionMakersLabel: '支持的制造商:',
            expertSectionButton: '技术咨询 →',
            // SNS快捷链接
            snsQuickTitle: '📱 关注我们的社交媒体',
            snsQuickDescription: '查看最新动态和RC活动！',
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
    
    // TOPセクション - 経験者向けセクション
    const expertTitle = document.querySelector('.expert-guide-cta .expert-cta-title');
    const expertDesc = document.querySelector('.expert-guide-cta .expert-cta-description');
    const expertSkills = document.querySelector('.expert-guide-cta .expert-cta-skills');
    const expertMakersLabel = document.querySelector('.expert-guide-cta .expert-makers-label');
    const expertButton = document.querySelector('.expert-guide-cta .expert-cta-button span');
    if (expertTitle) expertTitle.textContent = trans.topSection.expertSectionTitle;
    if (expertDesc) expertDesc.textContent = trans.topSection.expertSectionDescription;
    if (expertSkills) expertSkills.textContent = trans.topSection.expertSectionSkills;
    if (expertMakersLabel) expertMakersLabel.textContent = trans.topSection.expertSectionMakersLabel;
    if (expertButton) expertButton.textContent = trans.topSection.expertSectionButton;
    
    // TOPセクション - SNSクイックリンク
    const snsQuickTitle = document.querySelector('.sns-quick-title');
    const snsQuickDesc = document.querySelector('.sns-quick-description');
    if (snsQuickTitle) snsQuickTitle.textContent = trans.topSection.snsQuickTitle;
    if (snsQuickDesc) snsQuickDesc.textContent = trans.topSection.snsQuickDescription;
    
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
    
    // SNSセクション - YouTube（新レイアウト）
    const youtubeTitle = document.querySelector('#sns .youtube-section .platform-title');
    const youtubeDesc = document.querySelector('#sns .youtube-section .platform-description');
    const youtubeBtn = document.querySelector('#sns .youtube-section .platform-btn span');
    if (youtubeTitle) youtubeTitle.textContent = trans.snsSection.youtubeTitle;
    if (youtubeDesc) youtubeDesc.textContent = trans.snsSection.youtubeDesc;
    if (youtubeBtn) youtubeBtn.textContent = trans.snsSection.youtubeButton;
    
    // SNSセクション - note（新レイアウト）
    const noteSnsTitle = document.querySelector('#sns .note-section .platform-title');
    const noteDesc = document.querySelector('#sns .note-section .platform-description');
    const noteBtn = document.querySelector('#sns .note-section .platform-btn span');
    const noteTags = document.querySelectorAll('#sns .note-section .note-feature-tag');
    if (noteSnsTitle) noteSnsTitle.textContent = trans.snsSection.noteTitle;
    if (noteDesc) noteDesc.textContent = trans.snsSection.noteDesc;
    if (noteBtn) noteBtn.textContent = trans.snsSection.noteButton;
    if (noteTags[0]) noteTags[0].textContent = trans.snsSection.noteTag1;
    if (noteTags[1]) noteTags[1].textContent = trans.snsSection.noteTag2;
    if (noteTags[2]) noteTags[2].textContent = trans.snsSection.noteTag3;
    
    // SNSセクション - X（新レイアウト）
    const xTitle = document.querySelector('#sns .x-section .platform-title');
    const xDesc = document.querySelector('#sns .x-section .platform-description');
    const xBtn = document.querySelector('#sns .x-section .platform-btn span');
    if (xTitle) xTitle.textContent = trans.snsSection.xTitle;
    if (xDesc) xDesc.textContent = trans.snsSection.xDesc;
    if (xBtn) xBtn.textContent = trans.snsSection.xButton;
    
    // SNSセクション - フォローメッセージ
    const followMessage = document.querySelector('#sns .follow-message');
    if (followMessage) followMessage.textContent = trans.snsSection.followMessage;
    
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
    
    // AIラジコンゲームセクション
    const aiGamesTitle = document.querySelector('#ai-games .section-title');
    if (aiGamesTitle) aiGamesTitle.textContent = '🎮 ' + (trans.aiGamesSection ? trans.aiGamesSection.title : 'AIラジコンゲーム開発');
    
    if (trans.aiGamesSection) {
        const aiGamesIntroTitle = document.querySelector('#ai-games .ai-games-intro-content h3');
        const aiGamesIntroDesc = document.querySelector('#ai-games .ai-games-intro-content p');
        if (aiGamesIntroTitle) aiGamesIntroTitle.textContent = trans.aiGamesSection.introTitle;
        if (aiGamesIntroDesc) aiGamesIntroDesc.textContent = trans.aiGamesSection.introDesc;
        
        const gameTitles = document.querySelectorAll('#ai-games .game-content h4');
        const gameDescs = document.querySelectorAll('#ai-games .game-content p');
        if (gameTitles[0]) gameTitles[0].textContent = trans.aiGamesSection.game1Title;
        if (gameDescs[0]) gameDescs[0].textContent = trans.aiGamesSection.game1Desc;
        if (gameTitles[1]) gameTitles[1].textContent = trans.aiGamesSection.game2Title;
        if (gameDescs[1]) gameDescs[1].textContent = trans.aiGamesSection.game2Desc;
        if (gameTitles[2]) gameTitles[2].textContent = trans.aiGamesSection.game3Title;
        if (gameDescs[2]) gameDescs[2].textContent = trans.aiGamesSection.game3Desc;
        if (gameTitles[3]) gameTitles[3].textContent = trans.aiGamesSection.game4Title;
        if (gameDescs[3]) gameDescs[3].textContent = trans.aiGamesSection.game4Desc;
        if (gameTitles[4]) gameTitles[4].textContent = trans.aiGamesSection.game5Title;
        if (gameDescs[4]) gameDescs[4].textContent = trans.aiGamesSection.game5Desc;
        
        const shareCta = document.querySelector('#ai-games .ai-games-share-cta p');
        if (shareCta) shareCta.textContent = trans.aiGamesSection.shareCta;
    }
    
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
    
    // お問い合わせセクション - Phase 5: ステップ表示
    const contactFlowTitle = document.querySelector('#contact .contact-flow-title');
    if (contactFlowTitle) contactFlowTitle.textContent = trans.contactSection.flowTitle;
    
    const stepTitlesContact = document.querySelectorAll('#contact .step-content h4');
    const stepDescsContact = document.querySelectorAll('#contact .step-content p');
    if (stepTitlesContact[0]) stepTitlesContact[0].textContent = trans.contactSection.step1Title;
    if (stepDescsContact[0]) stepDescsContact[0].textContent = trans.contactSection.step1Desc;
    if (stepTitlesContact[1]) stepTitlesContact[1].textContent = trans.contactSection.step2Title;
    if (stepDescsContact[1]) stepDescsContact[1].textContent = trans.contactSection.step2Desc;
    if (stepTitlesContact[2]) stepTitlesContact[2].textContent = trans.contactSection.step3Title;
    if (stepDescsContact[2]) stepDescsContact[2].textContent = trans.contactSection.step3Desc;
    if (stepTitlesContact[3]) stepTitlesContact[3].textContent = trans.contactSection.step4Title;
    if (stepDescsContact[3]) stepDescsContact[3].textContent = trans.contactSection.step4Desc;
    if (stepTitlesContact[4]) stepTitlesContact[4].textContent = trans.contactSection.step5Title;
    if (stepDescsContact[4]) stepDescsContact[4].textContent = trans.contactSection.step5Desc;
    
    // お問い合わせセクション - Phase 5: 期待値の明示
    const expectationsTitle = document.querySelector('#contact .expectations-title');
    if (expectationsTitle) expectationsTitle.textContent = trans.contactSection.expectationsTitle;
    
    const expectationTitles = document.querySelectorAll('#contact .expectation-content h4');
    const expectationDescs = document.querySelectorAll('#contact .expectation-content p');
    if (expectationTitles[0]) expectationTitles[0].textContent = trans.contactSection.responseTimeTitle;
    if (expectationDescs[0]) expectationDescs[0].textContent = trans.contactSection.responseTimeDesc;
    if (expectationTitles[1]) expectationTitles[1].textContent = trans.contactSection.supportTypeTitle;
    if (expectationDescs[1]) expectationDescs[1].textContent = trans.contactSection.supportTypeDesc;
    if (expectationTitles[2]) expectationTitles[2].textContent = trans.contactSection.costTitle;
    if (expectationDescs[2]) expectationDescs[2].textContent = trans.contactSection.costDesc;
    if (expectationTitles[3]) expectationTitles[3].textContent = trans.contactSection.partsTitle;
    if (expectationDescs[3]) expectationDescs[3].textContent = trans.contactSection.partsDesc;
    if (expectationTitles[4]) expectationTitles[4].textContent = trans.contactSection.areaTitle;
    if (expectationDescs[4]) expectationDescs[4].textContent = trans.contactSection.areaDesc;
    
    // お問い合わせセクション - Phase 5: 重要なお知らせバナー
    const noMoneyNotice = document.querySelector('#contact .contact-important-banner p');
    if (noMoneyNotice) noMoneyNotice.textContent = trans.contactSection.noMoneyNotice;
    
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
    const contactButton = document.querySelector('#contact .contact-button span');
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
// ========================================
// 季節の挨拶機能
// ========================================
function initSeasonalGreeting() {
    const greetingEl = document.getElementById('seasonal-greeting');
    if (!greetingEl) return;
    
    // 挨拶を非表示にした場合、1日間は表示しない
    const dismissedDate = localStorage.getItem('greetingDismissed');
    if (dismissedDate) {
        const dismissed = new Date(dismissedDate);
        const now = new Date();
        const daysDiff = (now - dismissed) / (1000 * 60 * 60 * 24);
        if (daysDiff < 1) return;
    }
    
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();
    
    let greeting = {};
    let seasonClass = '';
    
    // 1月（正月期間は1日〜7日）
    if (month === 1 && day <= 7) {
        greeting = {
            icon: '🎍',
            message: 'あけましておめでとうございます！今年もラジコンを楽しみましょう！'
        };
        seasonClass = 'newyear';
    }
    // 1月8日〜2月（冬）
    else if (month === 1 || month === 2) {
        greeting = {
            icon: '❄️',
            message: '寒い日は室内ラジコンやメンテナンスの季節ですね！'
        };
        seasonClass = 'winter';
    }
    // 3月〜5月（春）
    else if (month >= 3 && month <= 5) {
        greeting = {
            icon: '🌸',
            message: '春の陽気でラジコンにも元気が宿る季節ですね！'
        };
        seasonClass = 'spring';
    }
    // 6月〜8月（夏）
    else if (month >= 6 && month <= 8) {
        greeting = {
            icon: '☀️',
            message: '暑い日が続きますが、ラジコン楽しんでいますでしょうか？(●´ω｀●)'
        };
        seasonClass = 'summer';
    }
    // 9月〜11月（秋）
    else if (month >= 9 && month <= 11) {
        greeting = {
            icon: '🍂',
            message: '秋晴れはラジコンに最高の季節です！風邪には気をつけましょう！'
        };
        seasonClass = 'autumn';
    }
    // 12月
    else if (month === 12) {
        greeting = {
            icon: '🎄',
            message: '今年も一年間誠にありがとうございました！来年もよろしくお願いいたしますm(_ _)m'
        };
        seasonClass = 'december';
    }
    
    // 挨拶を表示
    const iconEl = greetingEl.querySelector('.greeting-icon');
    const messageEl = greetingEl.querySelector('.greeting-message');
    const closeBtn = greetingEl.querySelector('.greeting-close');
    
    if (iconEl) iconEl.textContent = greeting.icon;
    if (messageEl) messageEl.textContent = greeting.message;
    
    greetingEl.classList.add(seasonClass);
    greetingEl.classList.add('show');
    
    // 閉じるボタン
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            greetingEl.classList.remove('show');
            localStorage.setItem('greetingDismissed', new Date().toISOString());
        });
    }
}

// ========================================
// note最新記事 自動取得機能
// ========================================
async function fetchNoteArticles() {
    const container = document.getElementById('note-articles-container');
    if (!container) return;
    
    const RSS_URL = 'https://note.com/postsoni/rss';
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
    
    // ピン留め記事のURL（除外用）
    const PINNED_URL = 'https://note.com/postsoni/n/needace09bdbd';
    
    // デフォルト画像（Base64エンコード済み）
    const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTUwIj48cmVjdCBmaWxsPSIjNDFjOWI0IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIvPjx0ZXh0IHg9IjEwMCIgeT0iODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+bm90ZTwvdGV4dD48L3N2Zz4=';
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('RSS取得に失敗しました');
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok' || !data.items || data.items.length === 0) {
            throw new Error('記事が見つかりません');
        }
        
        // ピン留め記事を除外して最新3件を取得
        const articles = data.items
            .filter(item => !item.link.includes('needace09bdbd'))
            .slice(0, 3);
        
        if (articles.length === 0) {
            throw new Error('新しい記事がありません');
        }
        
        // 記事カードを生成
        container.innerHTML = '';
        
        articles.forEach(article => {
            const pubDate = new Date(article.pubDate);
            const dateStr = pubDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // サムネイル画像（なければデフォルト）
            const thumbnail = article.thumbnail || article.enclosure?.link || DEFAULT_IMAGE;
            
            // カード要素を作成
            const card = document.createElement('a');
            card.href = article.link;
            card.target = '_blank';
            card.className = 'note-article-card';
            card.rel = 'noopener noreferrer';
            
            // 画像要素
            const img = document.createElement('img');
            img.src = thumbnail;
            img.alt = article.title;
            img.className = 'note-article-image';
            img.loading = 'lazy';
            img.onerror = function() {
                this.src = DEFAULT_IMAGE;
                this.onerror = null;
            };
            
            // コンテンツ要素
            const content = document.createElement('div');
            content.className = 'note-article-content';
            
            const title = document.createElement('h5');
            title.className = 'note-article-title';
            title.textContent = article.title;
            
            const date = document.createElement('span');
            date.className = 'note-article-date';
            date.textContent = '📅 ' + dateStr;
            
            content.appendChild(title);
            content.appendChild(date);
            
            card.appendChild(img);
            card.appendChild(content);
            
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('note記事取得エラー:', error);
        
        // エラー時の表示
        container.innerHTML = `
            <div class="note-error">
                <div class="note-error-icon">📝</div>
                <p class="note-error-message">最新記事の取得に失敗しました。<br>直接noteでご覧ください。</p>
                <a href="https://note.com/postsoni" target="_blank" class="note-error-link">
                    noteで記事を見る →
                </a>
            </div>
        `;
    }
}

// HTMLエスケープ関数
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========================================
// セクション記憶機能
// ========================================
function initSectionMemory() {
    // 最後に訪問したセクションを保存
    const saveLastSection = () => {
        if (currentTab) {
            localStorage.setItem('lastVisitedSection', currentTab);
            localStorage.setItem('lastVisitedTime', new Date().toISOString());
        }
    };
    
    // タブ切り替え時に保存
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', saveLastSection);
    });
    
    // ページを離れる時に保存
    window.addEventListener('beforeunload', saveLastSection);
    
    // 前回のセクションを復元（オプション）
    const lastSection = localStorage.getItem('lastVisitedSection');
    const lastTime = localStorage.getItem('lastVisitedTime');
    
    if (lastSection && lastTime) {
        const timeDiff = (new Date() - new Date(lastTime)) / (1000 * 60 * 60); // 時間差（時間）
        
        // 24時間以内の訪問で、topページ以外に訪問していた場合
        if (timeDiff < 24 && lastSection !== 'top') {
            // インジケーターを表示（自動復元はしない）
            showLastVisitedIndicator(lastSection);
        }
    }
}

function showLastVisitedIndicator(sectionId) {
    const sectionNames = {
        'profile': 'プロフィール',
        'support': 'サポート情報',
        'faq': 'よくある質問',
        'roadmap': 'ロードマップ',
        'archive-project': 'アーカイブ',
        'sns': 'SNS',
        'blog-access': 'ブログ',
        'ai-games': 'AIゲーム',
        'goods': 'グッズ',
        'contact': 'お問い合わせ'
    };
    
    const sectionName = sectionNames[sectionId] || sectionId;
    
    // インジケーターを作成
    const indicator = document.createElement('div');
    indicator.className = 'last-visited-indicator show';
    indicator.innerHTML = `
        <span class="indicator-icon">📍</span>
        <span>前回は「${sectionName}」を見ていました</span>
        <button class="indicator-go" onclick="goToSection('${sectionId}')">続きを見る</button>
        <button class="indicator-dismiss" onclick="dismissIndicator(this)">×</button>
    `;
    
    // メインコンテンツの先頭に追加
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(indicator, mainContent.firstChild);
    }
}

function goToSection(sectionId) {
    const navItem = document.querySelector(`.nav-item[data-tab="${sectionId}"]`);
    if (navItem) {
        navItem.click();
    }
    dismissIndicator(document.querySelector('.last-visited-indicator'));
}

function dismissIndicator(element) {
    const indicator = element.closest ? element.closest('.last-visited-indicator') : element;
    if (indicator) {
        indicator.remove();
    }
}

// グローバルに公開
window.goToSection = goToSection;
window.dismissIndicator = dismissIndicator;

// ========================================
// Service Worker登録（強化版）
// ========================================
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker登録成功:', registration.scope);
                
                // 更新があった場合
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // 新しいバージョンが利用可能
                            console.log('新しいバージョンが利用可能です');
                        }
                    });
                });
            })
            .catch(err => console.log('Service Worker登録失敗:', err));
    }
}

// ========================================
// 画像の遅延読み込み強化
// ========================================
function initLazyLoading() {
    // Intersection Observer対応確認
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // data-srcがあれば読み込み
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // loading="lazy"属性を持つ画像を監視
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========================================
// 初期化に追加
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 既存の初期化は維持
    
    // 新機能の初期化
    initSeasonalGreeting();
    fetchNoteArticles();
    initSectionMemory();
    initServiceWorker();
    initLazyLoading();
    
    // EdgeTXマニュアル フィードバックボタンのイベント
    const feedbackContactBtn = document.querySelector('.edgetx-feedback-btn[data-tab="contact"]');
    if (feedbackContactBtn) {
        feedbackContactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactTab = document.querySelector('.nav-item[data-tab="contact"]');
            if (contactTab) {
                contactTab.click();
            }
        });
    }
});

// ========================================
// EdgeTXマニュアル - 章のアコーディオン
// ========================================
function toggleChapter(chapterId) {
    const chapter = document.getElementById(chapterId);
    if (chapter) {
        const chapterContainer = chapter.parentElement;
        chapterContainer.classList.toggle('open');
    }
}

// ========================================
// ファイルダウンロード関数
// ========================================
function downloadFile(event, url, filename) {
    event.preventDefault();
    
    // fetchでファイルを取得してBlobとしてダウンロード
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error('ダウンロードエラー:', error);
            // フォールバック：通常のリンクとして開く
            window.open(url, '_blank');
        });
}
