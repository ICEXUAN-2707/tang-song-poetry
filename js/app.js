/**
 * app.js
 * 应用入口模块（经典脚本，须在其他三个脚本之后加载）。
 * 负责初始化、事件绑定与业务逻辑编排，保持低耦合与高可读性。
 * 依赖全局：POEMS（data.js）、state / VIEWS / setView / toggleTheme /
 *           toggleFavorite / getDisplayedPoems / isFavorite（state.js）、
 *           各 render 与 bind 系列函数（ui.js）。
 */

/**
 * 刷新整个页面视图。
 * 根据当前 state 渲染 Hero、导航与卡片列表。
 */
function refreshView() {
    renderHero();
    renderNavigation();

    var poems = getDisplayedPoems();
    renderPoemGrid(poems);

    updateFavCount(state.favorites.size, POEMS.length);
}

/**
 * 处理视图切换。
 * @param {string} view
 */
function handleViewChange(view) {
    setView(view);
    refreshView();
}

/**
 * 处理主题切换。
 */
function handleThemeToggle() {
    var newTheme = toggleTheme();
    renderTheme();
    // 主题切换后重新渲染 Hero 以匹配新的视觉氛围
    renderHero();
}

/**
 * 处理卡片点击：打开详情弹窗。
 * @param {string} poemId
 */
function handleCardClick(poemId) {
    var poem = POEMS.find(function (p) { return p.id === poemId; });
    if (!poem) return;

    renderDetailModal(poem);
    openModal();
}

/**
 * 处理收藏按钮点击。
 * @param {string} poemId
 */
function handleFavoriteToggle(poemId) {
    var newState = toggleFavorite(poemId);
    updateCardFavoriteState(poemId, newState);

    // 如果在收藏视图，移除后重新渲染列表
    if (state.currentView === VIEWS.FAVORITES) {
        renderPoemGrid(getDisplayedPoems());
    }

    updateFavCount(state.favorites.size, POEMS.length);
    return newState;
}

/**
 * 初始化应用。
 */
function init() {
    // 1. 应用持久化主题
    renderTheme();

    // 2. 绑定各区域事件
    bindNavEvents(handleViewChange);
    bindThemeEvent(handleThemeToggle);
    bindGridEvents(handleCardClick, handleFavoriteToggle);
    bindModalEvents(handleFavoriteToggle);

    // 3. 首次渲染
    refreshView();

    // 4. ESC 关闭弹窗由 <dialog> 元素原生支持，无需额外处理
}

// DOM 就绪后启动；用 try/catch 包裹，初始化异常时直接在页面顶部给出可见提示
function bootstrap() {
    try {
        init();
    } catch (err) {
        console.error("初始化失败：", err);
        var box = document.createElement("div");
        box.style.cssText =
            "position:fixed;left:0;right:0;top:0;z-index:9999;" +
            "background:#7a1f1f;color:#fff;font:13px/1.6 system-ui,sans-serif;" +
            "padding:12px 18px;white-space:pre-wrap;box-shadow:0 2px 10px rgba(0,0,0,.3)";
        box.textContent = "⚠ 初始化失败：" + (err && err.stack ? err.stack : err);
        document.body.appendChild(box);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
} else {
    bootstrap();
}
