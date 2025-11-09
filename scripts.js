// 模拟文章数据（可以从API加载），新增 content 字段用于完整内容
const posts = [
    {
        title: "好痛苦...",
        date: "2025-03-09",
        tags: ["明日方舟"],
        excerpt: "之后还有周年庆啊TT",
        content: "之后还有周年庆啊TT。",
        image: "m.PNG"
    },
    {
        title: "oiiaioiiiai",
        date: "2025-03-08",
        tags: ["生活"],
        excerpt: "喵",
        content: "喵。开发中功能。"
    },
    {
        title: "新的一天",
        date: "2025-03-07",
        tags: ["生活", "明日方舟"],
        excerpt: "开发中功能！",
        content: "开发中功能。"
    },
    {
        title: "游戏更新",
        date: "2025-03-06",
        tags: ["明日方舟"],
        excerpt: "开发中功能",
        content: "开发中功能。"
    },
    {
        title: "日常分享",
        date: "2025-03-05",
        tags: ["生活"],
        excerpt: "开发中功能。",
        content: "开发中功能。"
    },
    // 可以继续添加更多文章以测试无限滚动（假设有更多数据）
];

// 按日期降序排序
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// 设置
const postsPerPage = 20; // 每批加载20篇文章
let currentPage = 1;
let selectedTag = null; // 当前选中的标签
let searchTerm = ''; // 当前搜索词
let isLoading = false; // 防止重复加载
let hasMore = true; // 是否还有更多文章

// 获取元素
const postsContainer = document.querySelector('.posts-container');
const tagCloud = document.querySelector('.tag-cloud');
const searchInput = document.querySelector('.search-input');
const commentForm = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');

// 获取所有唯一标签
function getUniqueTags() {
    const allTags = new Set();
    posts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
}

// 渲染标签云
function renderTags() {
    tagCloud.innerHTML = '';
    const tags = getUniqueTags();
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.classList.add('tag');
        span.textContent = tag;
        if (tag === selectedTag) {
            span.classList.add('active');
        }
        span.addEventListener('click', () => {
            selectedTag = selectedTag === tag ? null : tag;
            resetAndLoad(); // 重置并重新加载
            renderTags(); // 更新标签活跃状态
        });
        tagCloud.appendChild(span);
    });
}

// 过滤文章（结合标签和搜索）
function getFilteredPosts() {
    return posts.filter(post => {
        const tagMatch = !selectedTag || post.tags.includes(selectedTag);
        const searchMatch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm);
        return tagMatch && searchMatch;
    });
}

// 渲染文章（追加模式）
function renderPosts(append = true) {
    const filteredPosts = getFilteredPosts();
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    if (paginatedPosts.length === 0) {
        hasMore = false;
        return;
    }

    if (!append) {
        postsContainer.innerHTML = ''; // 清空重新渲染
    }

    paginatedPosts.forEach(post => {
        const article = document.createElement('article');
        article.classList.add('post-card');

        const title = document.createElement('h2');
        title.classList.add('post-title');
        title.textContent = post.title;

        const meta = document.createElement('div');
        meta.classList.add('post-meta');

        const dateSpan = document.createElement('span');
        dateSpan.innerHTML = `<i class="far fa-calendar"></i> ${post.date.replace(/-/g, '年')}日`;

        const tagsDiv = document.createElement('div');
        tagsDiv.classList.add('post-tags');
        post.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.classList.add('tag');
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });

        meta.appendChild(dateSpan);
        meta.appendChild(tagsDiv);

        const excerpt = document.createElement('p');
        excerpt.classList.add('post-excerpt');
        excerpt.textContent = post.excerpt; // 初始显示摘要

        const readMore = document.createElement('a');
        readMore.classList.add('read-more');
        readMore.href = '#';
        readMore.textContent = '阅读更多';
        readMore.addEventListener('click', (e) => {
            e.preventDefault();
            if (excerpt.textContent === post.excerpt) {
                excerpt.textContent = post.content; // 展开完整内容
                readMore.textContent = '收起';
            } else {
                excerpt.textContent = post.excerpt; // 收起
                readMore.textContent = '阅读更多';
            }
        });

        if (post.image) {
            const img = document.createElement('img');
            img.src = post.image;
            img.alt = '';
            img.classList.add('img');
            article.appendChild(img);
        }

        article.appendChild(title);
        article.appendChild(meta);
        article.appendChild(excerpt);
        article.appendChild(readMore);

        postsContainer.appendChild(article);
    });

    currentPage++;
    if (end >= filteredPosts.length) {
        hasMore = false;
    }
}

// 重置并加载（用于搜索或标签变更）
function resetAndLoad() {
    currentPage = 1;
    hasMore = true;
    renderPosts(false); // 清空并渲染第一批
}

// 搜索事件监听
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    resetAndLoad();
});

// 无限滚动监听
window.addEventListener('scroll', () => {
    if (isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) { // 接近底部100px
        isLoading = true;
        renderPosts(true); // 追加下一批
        isLoading = false;
    }
});

// 本地评论功能
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
    commentsList.innerHTML = '';
    comments.forEach((comment, index) => {
        const div = document.createElement('div');
        div.classList.add('comment');
        div.innerHTML = `
            <div class="comment-name">${comment.name}</div>
            <div class="comment-date">${new Date(comment.date).toLocaleString()}</div>
            <p>${comment.content}</p>
            <button class="comment-delete" data-index="${index}">删除</button>
        `;
        commentsList.appendChild(div);
    });

    // 添加删除事件
    document.querySelectorAll('.comment-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            deleteComment(index);
        });
    });
}

function addComment(e) {
    e.preventDefault();
    const name = document.getElementById('comment-name').value.trim();
    const content = document.getElementById('comment-content').value.trim();
    if (name && content) {
        const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        comments.push({ name, content, date: new Date().toISOString() });
        localStorage.setItem('blogComments', JSON.stringify(comments));
        loadComments();
        commentForm.reset();
    }
}

function deleteComment(index) {
    let comments = JSON.parse(localStorage.getItem('blogComments')) || [];
    comments.splice(index, 1);
    localStorage.setItem('blogComments', JSON.stringify(comments));
    loadComments();
}

commentForm.addEventListener('submit', addComment);

// 初始化
renderTags();
resetAndLoad();
loadComments();