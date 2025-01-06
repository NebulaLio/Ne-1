document.addEventListener("DOMContentLoaded", function() {
    const grid = document.getElementById('grid');
    const contentElements = document.querySelectorAll('.content h1, .content p');

    // 先让内容淡入
    contentElements.forEach(function(el) {
        el.style.animationDelay = '0s';
        el.style.animationDuration = '1s';
    });

    // 等内容淡入后，再让格子淡入
    setTimeout(function() {
        grid.style.opacity = 1;
    }, 1000); // 延迟1秒，等待内容淡入完成
});