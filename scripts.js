// 模拟文章数据（可以从API加载），新增 content 字段用于完整内容
const posts = [
    {
        title: "好痛苦...",
        date: "2025-03-09",
        tags: ["游戏"], // 改为"游戏"
        excerpt: "之后还有周年庆啊TT",
        content: "之后还有周年庆啊TT。",
        image: "m.PNG"
    },
    {
        title: "Gretsch Guitar",
        date: "2023-06-12",
        tags: ["生活", "音乐"],
        excerpt: "喵",
        content: "Gretsch G5422TG Limited Edition Electromatic Double-Cut Hollowbody w/Bigsby Sapphire Blue",
        image: "m1.JPG"
    },
    {
        title: "咩",
        date: "2023-11-23",
        tags: ["生活"], // 改为"游戏"
        excerpt: "开发中功能！",
        content: "咩。",
        image: "m2.JPG"
    },
    {
        title: "Fire",
        date: "2023-12-22",
        tags: ["游戏"], // 改为"游戏"
        excerpt: "开发中功能",
        content: "六国论",
        image: "m3.jpg"
    },
    {
        title: "重构",
        date: "2021-03-05",
        tags: ["生活"],
        excerpt: "开发中功能。",
        content: "链接",
        image: "m4.jpg"
    },
    // 新增文章以加入"音乐"和"电子产品"标签

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
// 计算标签计数
const tagCounts = {};
posts.forEach(post => {
    post.tags.forEach(tag => {
        if (!tagCounts[tag]) tagCounts[tag] = 0;
        tagCounts[tag]++;
    });
});
// 获取所有唯一标签，并排序
function getUniqueTags() {
    const allTags = new Set();
    posts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
}
// 渲染标签云
function renderTags() {
    tagCloud.innerHTML = '';
    const tags = getUniqueTags();
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.classList.add('tag');
        span.textContent = `${tag} (${tagCounts[tag] || 0})`;
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
        const contentP = document.createElement('p');
        contentP.classList.add('post-excerpt');
        contentP.textContent = post.content; // 显示完整内容
        if (post.image) {
            const img = document.createElement('img');
            img.src = post.image;
            img.alt = '';
            img.classList.add('img');
            article.appendChild(img);
        }
        article.appendChild(title);
        article.appendChild(meta);
        article.appendChild(contentP);
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
            <div class="comment-name">匿名</div>
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
    const content = document.getElementById('comment-content').value.trim();
    if (content) {
        const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
        comments.push({ name: '匿名', content, date: new Date().toISOString() });
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

// 新增天气获取函数（北京为例，替换城市名）
function fetchWeather() {
    fetch('https://wttr.in/Beijing?format="%l:+%c+%t"')
        .then(response => response.text())
        .then(data => {
            document.querySelector('.weather').innerHTML = `<i class="fas fa-cloud-sun"></i> ${data.replace(/\+/g, '')}`;
        })
        .catch(() => {
            document.querySelector('.weather').innerHTML = '<i class="fas fa-cloud-sun"></i> 天气不可用';
        });
}

// 新增实时时间显示
function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });
}
setInterval(updateTime, 1000); // 每秒更新

// 新增月历显示
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let table = '<table><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead><tbody><tr>';

    // 填充空白
    for (let i = 0; i < firstDay; i++) {
        table += '<td></td>';
    }

    // 填充日期
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === now.getDate();
        table += `<td${isToday ? ' class="today"' : ''}>${day}</td>`;
        if ((day + firstDay) % 7 === 0) {
            table += '</tr><tr>';
        }
    }

    table += '</tr></tbody></table>';
    calendar.innerHTML = table;
}

// 初始化
renderTags();
resetAndLoad();
loadComments();
fetchWeather();
updateTime();
renderCalendar();