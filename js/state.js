/**
 * state.js
 * 应用状态管理模块（经典脚本，配合 data.js / ui.js / app.js 顺序加载）。
 * 集中管理当前视图、主题与收藏列表，并提供 localStorage 持久化。
 * 说明：本项目改为非模块（classic script）加载，变量与函数位于全局作用域，
 * 由 app.js 统一协调；各文件仍按「数据 / 状态 / 视图 / 编排」职责分离，保持低耦合。
 */

/** 视图枚举 */
const VIEWS = {
    TANG: "tang",
    SONG: "song",
    FAVORITES: "favorites"
};

/** 主题枚举 */
const THEMES = {
    LIGHT: "light",
    DARK: "dark"
};

const STORAGE_KEY = "qixiu_poem_favorites";
const THEME_KEY = "qixiu_theme";

/** 应用状态对象（Single Source of Truth） */
const state = {
    currentView: VIEWS.TANG,
    theme: loadTheme(),
    favorites: new Set(loadFavorites())
};

/**
 * 从 localStorage 读取主题，默认 light。
 * @returns {string}
 */
function loadTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === THEMES.DARK) return THEMES.DARK;
    } catch (e) {
        // 隐私模式或禁用 storage 时静默失败
    }
    return THEMES.LIGHT;
}

/**
 * 保存主题到 localStorage。
 */
function saveTheme() {
    try {
        localStorage.setItem(THEME_KEY, state.theme);
    } catch (e) {
        // 忽略存储异常
    }
}

/**
 * 从 localStorage 读取收藏 ID 数组。
 * @returns {Array<string>}
 */
function loadFavorites() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

/**
 * 保存收藏列表到 localStorage。
 */
function saveFavorites() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.favorites]));
    } catch (e) {
        // 忽略存储异常
    }
}

/**
 * 切换收藏状态。
 * @param {string} poemId
 * @returns {boolean} 切换后的收藏状态
 */
function toggleFavorite(poemId) {
    const isFav = state.favorites.has(poemId);
    if (isFav) {
        state.favorites.delete(poemId);
    } else {
        state.favorites.add(poemId);
    }
    saveFavorites();
    return !isFav;
}

/**
 * 切换双色主题。
 * @returns {string} 切换后的主题
 */
function toggleTheme() {
    state.theme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    saveTheme();
    return state.theme;
}

/**
 * 设置当前视图。
 * @param {string} view
 */
function setView(view) {
    if (!Object.values(VIEWS).includes(view)) return;
    state.currentView = view;
}

/**
 * 获取当前视图应显示的诗词列表。
 * @returns {Array<Object>}
 */
function getDisplayedPoems() {
    switch (state.currentView) {
        case VIEWS.TANG:
            return POEMS.filter((p) => p.category === "tang");
        case VIEWS.SONG:
            return POEMS.filter((p) => p.category === "song");
        case VIEWS.FAVORITES:
            return POEMS.filter((p) => state.favorites.has(p.id));
        default:
            return [];
    }
}

/**
 * 判断某首诗是否已收藏。
 * @param {string} poemId
 * @returns {boolean}
 */
function isFavorite(poemId) {
    return state.favorites.has(poemId);
}
