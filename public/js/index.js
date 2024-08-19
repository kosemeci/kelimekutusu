document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            fetch('/update-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const url = index < 9 ? "/seviye_" : "/kategori_";
            window.location.href = url + card.id;
        });
    });
});