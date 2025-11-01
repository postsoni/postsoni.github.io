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
            
            // スマホの場合、ページ全体も最上部にスクロール
            if (window.innerWidth <= 768) {
                window.scrollTo(0, 0);
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
