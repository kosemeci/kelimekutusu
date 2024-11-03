function showContent(element) {
    window.location.href = `/learn-english/${element}`; // Tam URL ile yönlendirme
}

// Sayfa yüklendiğinde aktif öğeyi belirlemek için fonksiyon
function setActiveMenuItem() {
    // URL'den sayfa adını al
    const path = window.location.pathname; // Örneğin: /d/pronouns
    const page = path.split('/').pop(); // Son elemanı al (örn. 'pronouns')

    // Tüm liste öğelerini seç
    const items = document.querySelectorAll('#blog-titles li');

    // Eşleşen öğeye 'active' sınıfını ekle
    items.forEach(item => {
        const itemText = item.id; // Liste öğesinin metnini al
        if (itemText.toLowerCase() === page.toLowerCase()) { // Büyük/küçük harf duyarsız karşılaştırma
            item.classList.add('active'); // Aktif sınıfını ekle
        }
    });
}

// Sayfa yüklendiğinde aktif öğeyi belirle
window.onload = setActiveMenuItem;