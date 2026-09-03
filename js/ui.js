/**
 * ui.js
 * UI 渲染模块（经典脚本，配合 data.js / state.js / app.js 顺序加载）。
 * 负责 Hero、导航、诗词卡片与详情弹窗的渲染与事件绑定。
 * 依赖全局：state / THEMES / VIEWS / isFavorite（来自 state.js），POEMS（来自 data.js）。
 */

// DOM 元素缓存（脚本位于 body 末尾，此时 DOM 已就绪）
var elements = {
    body: document.body,
    hero: document.getElementById("hero"),
    poemGrid: document.getElementById("poemGrid"),
    emptyState: document.getElementById("emptyState"),
    detailModal: document.getElementById("detailModal"),
    poemDetail: document.getElementById("poemDetail"),
    closeModal: document.getElementById("closeModal"),
    navItems: document.querySelectorAll(".nav-item"),
    themeToggle: document.getElementById("themeToggle"),
    favCount: document.getElementById("favCount"),
    totalCount: document.getElementById("totalCount")
};

/**
 * 截取诗词正文前两句作为卡片摘要。
 * @param {string} content
 * @returns {string}
 */
function getExcerpt(content) {
    return content
        .split("\n")
        .slice(0, 2)
        .join("，") + "……";
}

/**
 * 各视图对应的水墨 Hero 背景图（位于 assets 目录）。
 */
var HERO_IMAGES = {
    [VIEWS.TANG]: "assets/hero-tang.png",
    [VIEWS.SONG]: "assets/hero-song.png",
    [VIEWS.FAVORITES]: "assets/hero-favorites.png"
};

/**
 * 渲染 Hero 区域。
 * 各模块（唐诗 / 宋词 / 收藏）均只呈现对应的水墨背景图，不叠加任何文字。
 */
function renderHero() {
    // 按当前视图注入对应的水墨背景图（纯图片展示）
    var imagePath = HERO_IMAGES[state.currentView] || HERO_IMAGES[VIEWS.TANG];
    elements.hero.style.backgroundImage = 'url("' + imagePath + '")';
    // 清空可能存在的旧文字内容，确保 Hero 区域只保留图片
    elements.hero.innerHTML = "";
}

/**
 * 渲染左侧导航激活状态。
 */
function renderNavigation() {
    elements.navItems.forEach(function (item) {
        var view = item.dataset.view;
        var isActive = view === state.currentView;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-current", isActive ? "page" : "false");
    });
}

/**
 * 渲染主题按钮状态。
 */
function renderTheme() {
    elements.body.setAttribute("data-theme", state.theme);
    var label = state.theme === THEMES.LIGHT ? "宣纸" : "墨夜";
    elements.themeToggle.querySelector(".theme-toggle__text").textContent = label;
}

/**
 * 创建一首诗词卡片 DOM。
 * @param {Object} poem
 * @returns {HTMLElement}
 */
function createPoemCard(poem) {
    var favorited = isFavorite(poem.id);
    var card = document.createElement("article");
    card.className = "poem-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "查看《" + poem.title + "》详情");
    card.dataset.id = poem.id;

    card.innerHTML =
        '<span class="poem-card__dynasty">' + poem.dynasty + "</span>" +
        '<h3 class="poem-card__title">' + poem.title + "</h3>" +
        '<p class="poem-card__author">' + poem.author + "</p>" +
        '<p class="poem-card__excerpt">' + getExcerpt(poem.content) + "</p>" +
        '<div class="poem-card__actions">' +
        '<span class="poem-card__tag">' + (poem.category === "tang" ? "唐诗" : "宋词") + "</span>" +
        '<button class="favorite-btn ' + (favorited ? "is-favorited" : "") + '" data-id="' + poem.id + '" aria-label="' + (favorited ? "取消收藏" : "收藏此诗词") + '">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="' + (favorited ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
        "</button>" +
        "</div>";

    return card;
}

/**
 * 渲染诗词卡片网格。
 * @param {Array<Object>} poems
 */
function renderPoemGrid(poems) {
    elements.poemGrid.innerHTML = "";

    if (poems.length === 0) {
        elements.emptyState.hidden = false;
        elements.poemGrid.hidden = true;
        // 不同视图给出更贴切的空状态文案，避免「收藏页空白」被误判为故障
        var emptyMsg = elements.emptyState.querySelector("p");
        if (emptyMsg) {
            emptyMsg.textContent = state.currentView === VIEWS.FAVORITES
                ? "尚无收藏。在「唐诗」或「宋词」中点亮红心，心仪之作便会汇聚于此。"
                : "未找到相关诗词。";
        }
        return;
    }

    elements.emptyState.hidden = true;
    elements.poemGrid.hidden = false;

    var fragment = document.createDocumentFragment();
    poems.forEach(function (poem) {
        fragment.appendChild(createPoemCard(poem));
    });
    elements.poemGrid.appendChild(fragment);
}

/**
 * 渲染详情弹窗。
 * 详情按「标题 → 作者 → 原文 → 作者简介」四段呈现。
 * @param {Object} poem
 */
function renderDetailModal(poem) {
    var favorited = isFavorite(poem.id);
    elements.poemDetail.innerHTML =
        '<header class="poem-detail__header">' +
        '<h2 class="poem-detail__title" id="modalTitle">' + poem.title + "</h2>" +
        "</header>" +
        '<section class="poem-detail__section">' +
        '<span class="poem-detail__label">作者</span>' +
        '<p class="poem-detail__author">' + poem.dynasty + " · " + poem.author + "</p>" +
        "</section>" +
        '<section class="poem-detail__section">' +
        '<span class="poem-detail__label">原文</span>' +
        '<p class="poem-detail__text">' + poem.content + "</p>" +
        "</section>" +
        '<section class="poem-detail__section">' +
        '<span class="poem-detail__label">作者简介</span>' +
        '<p class="poem-detail__author-intro">' + poem.authorIntro + "</p>" +
        "</section>" +
        '<footer class="poem-detail__footer">' +
        '<button class="btn btn--primary favorite-toggle-btn ' + (favorited ? "is-favorited" : "") + '" data-id="' + poem.id + '">' +
        (favorited ? "已收藏" : "收藏此卡片") +
        "</button>" +
        '<button class="btn close-detail-btn">关闭</button>' +
        "</footer>";
}

/**
 * 打开详情弹窗。
 */
function openModal() {
    elements.detailModal.showModal();
    document.body.style.overflow = "hidden";
}

/**
 * 关闭详情弹窗。
 */
function closeModal() {
    elements.detailModal.close();
    document.body.style.overflow = "";
}

/**
 * 更新收藏计数显示。
 * @param {number} count
 * @param {number} total
 */
function updateFavCount(count, total) {
    elements.favCount.textContent = count;
    elements.totalCount.textContent = total;
}

/**
 * 绑定事件委托：卡片点击与收藏按钮点击。
 * @param {Function} onCardClick
 * @param {Function} onFavoriteToggle
 */
function bindGridEvents(onCardClick, onFavoriteToggle) {
    elements.poemGrid.addEventListener("click", function (event) {
        var favBtn = event.target.closest(".favorite-btn");
        if (favBtn) {
            event.stopPropagation();
            onFavoriteToggle(favBtn.dataset.id);
            return;
        }

        var card = event.target.closest(".poem-card");
        if (card) {
            onCardClick(card.dataset.id);
        }
    });

    // 键盘 Enter/Space 打开详情
    elements.poemGrid.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            var card = event.target.closest(".poem-card");
            if (card) {
                event.preventDefault();
                onCardClick(card.dataset.id);
            }
        }
    });
}

/**
 * 绑定弹窗内事件。
 * @param {Function} onFavoriteToggle
 */
function bindModalEvents(onFavoriteToggle) {
    elements.closeModal.addEventListener("click", closeModal);

    elements.poemDetail.addEventListener("click", function (event) {
        var favBtn = event.target.closest(".favorite-toggle-btn");
        if (favBtn) {
            var newState = onFavoriteToggle(favBtn.dataset.id);
            favBtn.textContent = newState ? "已收藏" : "收藏此卡片";
            favBtn.classList.toggle("is-favorited", newState);
            return;
        }

        if (event.target.closest(".close-detail-btn")) {
            closeModal();
        }
    });

    // 点击弹窗背景关闭
    elements.detailModal.addEventListener("click", function (event) {
        if (event.target === elements.detailModal) {
            closeModal();
        }
    });
}

/**
 * 绑定导航点击事件。
 * @param {Function} onViewChange
 */
function bindNavEvents(onViewChange) {
    elements.navItems.forEach(function (item) {
        item.addEventListener("click", function () {
            onViewChange(item.dataset.view);
        });
    });
}

/**
 * 绑定主题切换事件。
 * @param {Function} onThemeToggle
 */
function bindThemeEvent(onThemeToggle) {
    elements.themeToggle.addEventListener("click", onThemeToggle);
}

/**
 * 高刷新单张卡片的收藏按钮状态。
 * @param {string} poemId
 * @param {boolean} favorited
 */
function updateCardFavoriteState(poemId, favorited) {
    var card = elements.poemGrid.querySelector('.poem-card[data-id="' + poemId + '"]');
    if (!card) return;
    var btn = card.querySelector(".favorite-btn");
    btn.classList.toggle("is-favorited", favorited);
    btn.setAttribute("aria-label", favorited ? "取消收藏" : "收藏此诗词");
    var svg = btn.querySelector("svg");
    svg.setAttribute("fill", favorited ? "currentColor" : "none");
}
