/* ========================================
   RCアーカイブ JavaScript
   多言語対応・検索機能
======================================== */

// 翻訳データ
const translations = {
    ja: {
        archive: {
            title: "RCアーカイブ",
            subtitle: "絶版から現代までのラジコンデータベース",
            backToMain: "← メインサイトに戻る",
            stats: {
                models: "登録機種数",
                manufacturers: "メーカー数",
                guides: "修理ガイド"
            },
            databaseLink: {
                title: "📋 機種情報を検索",
                button: "📋 機種データベース一覧を見る →",
                desc: "100機種の詳細情報・修理ガイドを掲載中"
            },
            search: {
                title: "🔍 機種を検索",
                placeholder: "機種名・メーカー・型番で検索...",
                button: "検索",
                noticeTitle: "⚠️ お知らせ",
                noticeText1: "現在、検索機能は<strong>機種データベース一覧</strong>で実装しています。",
                noticeText2: "下記の検索ではなく、次のページにてお探しいただけると幸いです。"
            },
            manufacturer: {
                title: "🏭 メーカー別で探す",
                tamiya: "タミヤ",
                kyosho: "京商",
                yokomo: "ヨコモ",
                jrpropo: "JR PROPO",
                hirobo: "ヒロボー",
                futaba: "双葉電子工業"
            },
            category: {
                title: "🚗 カテゴリー別で探す",
                car: "ラジコンカー",
                carDesc: "RC Car - ツーリングカー、オフロード、ドリフトなど",
                heli: "ラジコンヘリ",
                heliDesc: "RC Helicopter - 電動ヘリ、エンジンヘリ、スケールヘリ",
                plane: "ラジコン飛行機",
                planeDesc: "RC Airplane - トレーナー、スケール、グライダーなど"
            },
            era: {
                title: "📅 年代別で探す",
                era1970: "1970年代",
                era1980: "1980年代",
                era1990: "1990年代",
                era2000: "2000年代",
                era2010: "2010年代",
                era2020: "2020年代",
                era2020range: "2020-現在"
            },
            about: {
                title: "📖 アーカイブについて",
                desc1: "このアーカイブは、絶版機種から現代の最新機種まで、ラジコンの歴史と技術を後世に残すためのデータベースです。",
                desc2: "取扱説明書、修理ガイド、パーツ互換情報など、ラジコン文化の保存と継承を目的としています。",
                desc3: "ぽすとそに工房の19年間の修理経験と、100件以上の修理実績をもとに構築されています。"
            },
            footer: {
                license: "このアーカイブは非営利・教育目的で運営されています。<br>著作権は各メーカーに帰属します。"
            }
        }
    },
    en: {
        archive: {
            title: "RC Archive",
            subtitle: "Database from Vintage to Modern RC Models",
            backToMain: "← Back to Main Site",
            stats: {
                models: "Registered Models",
                manufacturers: "Manufacturers",
                guides: "Repair Guides"
            },
            databaseLink: {
                title: "📋 Search Model Information",
                button: "📋 View Model Database →",
                desc: "100 models with detailed information and repair guides"
            },
            search: {
                title: "🔍 Search Models",
                placeholder: "Search by model name, manufacturer, or model number...",
                button: "Search",
                noticeTitle: "⚠️ Notice",
                noticeText1: "The search function is currently implemented in the <strong>Model Database</strong>.",
                noticeText2: "Please use the next page instead of the search below."
            },
            manufacturer: {
                title: "🏭 Browse by Manufacturer",
                tamiya: "Tamiya",
                kyosho: "Kyosho",
                yokomo: "Yokomo",
                jrpropo: "JR PROPO",
                hirobo: "Hirobo",
                futaba: "Futaba Corporation"
            },
            category: {
                title: "🚗 Browse by Category",
                car: "RC Cars",
                carDesc: "RC Car - Touring cars, Off-road, Drift, etc.",
                heli: "RC Helicopters",
                heliDesc: "RC Helicopter - Electric, Nitro/Gas, Scale helicopters",
                plane: "RC Airplanes",
                planeDesc: "RC Airplane - Trainers, Scale models, Gliders, etc."
            },
            era: {
                title: "📅 Browse by Era",
                era1970: "1970s",
                era1980: "1980s",
                era1990: "1990s",
                era2000: "2000s",
                era2010: "2010s",
                era2020: "2020s",
                era2020range: "2020-Present"
            },
            about: {
                title: "📖 About This Archive",
                desc1: "This archive is a database dedicated to preserving the history and technology of RC models, from vintage discontinued models to the latest modern releases.",
                desc2: "The archive aims to preserve and pass on RC culture through instruction manuals, repair guides, and parts compatibility information.",
                desc3: "Built upon 19 years of repair experience and over 100 repair cases by Postsoni Workshop."
            },
            footer: {
                license: "This archive is operated for non-profit and educational purposes.<br>All copyrights belong to respective manufacturers."
            }
        }
    },
    zh: {
        archive: {
            title: "RC资料库",
            subtitle: "从绝版到现代的遥控模型数据库",
            backToMain: "← 返回主站",
            stats: {
                models: "已登录机型数",
                manufacturers: "制造商数",
                guides: "维修指南"
            },
            databaseLink: {
                title: "📋 搜索机型信息",
                button: "📋 查看机型数据库 →",
                desc: "已收录100种机型的详细信息和维修指南"
            },
            search: {
                title: "🔍 搜索机型",
                placeholder: "按机型名、制造商或型号搜索...",
                button: "搜索",
                noticeTitle: "⚠️ 通知",
                noticeText1: "搜索功能目前已在<strong>机型数据库</strong>中实现。",
                noticeText2: "请使用下一页，而不是下面的搜索。"
            },
            manufacturer: {
                title: "🏭 按制造商浏览",
                tamiya: "田宫",
                kyosho: "京商",
                yokomo: "横模",
                jrpropo: "JR PROPO",
                hirobo: "Hirobo",
                futaba: "双叶电子工业"
            },
            category: {
                title: "🚗 按类别浏览",
                car: "遥控车",
                carDesc: "RC Car - 房车、越野车、漂移车等",
                heli: "遥控直升机",
                heliDesc: "RC Helicopter - 电动直升机、燃油直升机、比例直升机",
                plane: "遥控飞机",
                planeDesc: "RC Airplane - 练习机、比例模型、滑翔机等"
            },
            era: {
                title: "📅 按年代浏览",
                era1970: "1970年代",
                era1980: "1980年代",
                era1990: "1990年代",
                era2000: "2000年代",
                era2010: "2010年代",
                era2020: "2020年代",
                era2020range: "2020-至今"
            },
            about: {
                title: "📖 关于资料库",
                desc1: "本资料库是一个旨在为后代保存遥控模型历史和技术的数据库，从绝版机型到现代最新机型。",
                desc2: "通过说明书、维修指南、零件兼容性信息等，旨在保存和传承遥控模型文化。",
                desc3: "基于Postsoni工房19年的维修经验和100多个维修案例构建。"
            },
            footer: {
                license: "本资料库为非营利和教育目的运营。<br>版权归各制造商所有。"
            }
        }
    }
};

// 現在の言語を保存（デフォルト: 日本語）
let currentLanguage = localStorage.getItem('archiveLanguage') || 'ja';

// ページ読み込み時に言語を適用
document.addEventListener('DOMContentLoaded', function() {
    setLanguage(currentLanguage);
});

// 言語設定関数
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('archiveLanguage', lang);
    
    // 言語ボタンのアクティブ状態を更新
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('lang-' + lang).classList.add('active');
    
    // HTML lang属性を更新
    document.documentElement.lang = lang;
    
    // 翻訳を適用
    applyTranslations(lang);
}

// 翻訳を適用する関数
function applyTranslations(lang) {
    const trans = translations[lang];
    
    // data-i18n属性を持つ要素を翻訳
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedProperty(trans, key);
        
        if (value) {
            element.innerHTML = value;
        }
    });
    
    // プレースホルダーの翻訳
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const value = getNestedProperty(trans, key);
        
        if (value) {
            element.placeholder = value;
        }
    });
}

// ネストされたオブジェクトのプロパティを取得
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

// 検索機能
function searchModels() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        alert(currentLanguage === 'ja' ? '検索キーワードを入力してください。' : 
              currentLanguage === 'en' ? 'Please enter a search term.' : 
              '请输入搜索关键词。');
        return;
    }
    
    // 検索結果ページに遷移（今後実装）
    // 仮のアラート
    alert(currentLanguage === 'ja' ? `「${searchTerm}」を検索中...（検索機能は今後実装予定）` : 
          currentLanguage === 'en' ? `Searching for "${searchTerm}"... (Search feature coming soon)` : 
          `正在搜索"${searchTerm}"...（搜索功能即将推出）`);
}

// Enterキーで検索
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchModels();
            }
        });
    }
});

/* ========================================
   ユーティリティ関数
======================================== */

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ページトップへ戻るボタン（オプション）
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// スクロールに応じて「トップへ戻る」ボタンを表示（今後実装可能）
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

console.log('🚀 RCアーカイブ JavaScript 読み込み完了');
