function createWords() {
  const wordsContainer = document.getElementById('words');
  const words = ['table', 'key', 'hospital', 'student', 'school', 'book', 'apple', 'car', 'pen', 'phone', 'brave', 'army',
    'computer', 'box', 'house', 'dog', 'cat', 'mother', 'brother', 'girl', 'summer', 'window', 'yesterday', 'freedom', 'wallet', 'president',
    'milk', 'animals', 'door', 'country', 'city', 'father', 'sister', 'winter', 'snow', 'television', 'football', 'moon', 'green', 'passenger',
    'travel', 'holiday', 'furniture', 'honey', 'lion', 'bird', 'banana', 'strawberry', 'red', 'blue', 'yellow', 'black', 'white', 'sun', 'tomorrow'
  ];
  const numWords = 20;

  for (let i = 0; i < numWords; i++) {
    const word = document.createElement('div');
    word.classList.add('word');

    const randomWord = words[Math.floor(Math.random() * words.length)];
    word.textContent = randomWord;

    word.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;

    word.style.left = Math.random() * 80 + '%';

    word.style.animationDelay = Math.random() * 8 + 's';

    wordsContainer.appendChild(word);
  }
}


document.getElementById('main-boxes-page').addEventListener('click', function () {
  const targetElement = document.getElementById('main-containers');
  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
});


document.getElementById('create-box-page').addEventListener('click', function () {
  window.location.href = '/kutum';
});

document.getElementById('learn-level-page').addEventListener('click', function () {
  window.location.href = '/seviye-ogrenme-testi';
});

document.getElementById('competition-page').addEventListener('click', function () {
  window.location.href = '/kelime-yarismasi';
});

document.getElementById('learn-page').addEventListener('click', function () {
  window.location.href = '/learn-english';
});
window.onload = createWords;

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector('.feature-cards');
  const containerWidth = window.innerWidth * 0.8;
  const featureCard = document.querySelector('.feature-card');
  const cardWidth = featureCard ?
    parseFloat(getComputedStyle(featureCard).width) + 55 +
    parseFloat(getComputedStyle(featureCard).marginLeft) +
    parseFloat(getComputedStyle(featureCard).marginRight) : 0;
  
  let scrollAmount = 0;
  const step = 1; // Her animasyonda kaydırılacak piksel sayısı
  const scrollSpeed = 10; // Kaydırma hızı (ms)

  function autoScroll() {
    if (scrollAmount < container.scrollWidth - containerWidth) {
      scrollAmount += cardWidth; // Kart genişliği kadar kaydır
    } else {
      scrollAmount = 0; // Sonuna geldiğinde tekrar başa dön
    }
    smoothScrollTo(scrollAmount);
  }

  function smoothScrollTo(target) {
    const start = container.scrollLeft;
    const distance = target - start;
    const duration = 500; // Animasyon süresi (ms)
    const startTime = performance.now();

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1); // İlerleme oranı

      // Easing: daha akışkan bir hareket sağlamak için
      const easing = easeInOutCubic(progress);
      container.scrollLeft = start + distance * easing;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  const scrollInterval = setInterval(autoScroll, 3000); // Otomatik kaydırma süresi

  document.getElementById("leftButton").addEventListener('click', () => {
    clearInterval(scrollInterval);
    if (scrollAmount > 0) {
      scrollAmount -= cardWidth; // Kart genişliği kadar kaydır
    } else {
      scrollAmount = container.scrollWidth - containerWidth; // Başlangıca dön
    }
    smoothScrollTo(scrollAmount);
  });

  document.getElementById("rightButton").addEventListener('click', () => {
    clearInterval(scrollInterval);
    if (scrollAmount < container.scrollWidth - containerWidth) {
      scrollAmount += cardWidth; // Kart genişliği kadar kaydır
    } else {
      scrollAmount = 0; // Başlangıca dön
    }
    smoothScrollTo(scrollAmount);
  });

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // Akışkanlık için easing
  }
});

