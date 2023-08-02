const readMoreV2 = (() => {
    function handleReadMoreClick(linesToShow = 1) {
        const truncateClass = `text-truncate-${linesToShow}`;
        document.querySelector(".js-read-more-text").classList.toggle(truncateClass);
        document.querySelector(".js-read-more-btn").classList.toggle("display-none");
        document.querySelector(".js-read-less-btn").classList.toggle("display-none");
    }
    return {
        handleReadMoreClick
    };
})();