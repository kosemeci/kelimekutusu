document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const url = index < 9 ? "/seviye_" : "/kategori_";
            window.location.href = url + card.id;
        });
    });
    const lazyCards = document.querySelectorAll('.lazy-card ');
    const observerOptions = {
        root: null,
        threshold: 0.1 
    };
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    lazyCards.forEach(card => {
        cardObserver.observe(card);
    });
});