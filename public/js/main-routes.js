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

  window.onload = createWords;