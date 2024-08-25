document.addEventListener("DOMContentLoaded", function () {
    const topFace = document.getElementById("top");
    const answerSection = document.getElementById("answer-section");
    const questionText = document.getElementById("questionText");
    const userAnswer = document.getElementById("userAnswer");
    const submitAnswerButton = document.getElementById("submitAnswer");
    const answerText = document.getElementById("answerText");
    const modal = document.getElementById("resultModal");
    const retryButon = document.getElementById("retryButton");
    const span = document.getElementsByClassName("close")[0];
    const progressContainer = document.querySelector('.progress-container');

    document.getElementById('box').classList.add('shake');
    submitAnswerButton.disabled = true;

    const words = [];
    const red_color = "#E74C3C";
    const green_color = "#2ECC71";
    let currentWord = null;
    let askEnglish = true;
    let correctNum = 0;
    let message = "";
    let ask_index = 0;
    let ask_line = 1;
    let progress = 0;
    let randomWords = [];

    fetch('/seviye-ogren')
        .then(response => response.json())
        .then(data => {
            words.push(...data);
            ask_line = words.length;
        })
        .catch(error => {
            console.error('Hata:', error);
        });


    function showGameResult(correctAnswers) {
        const point = ((correctAnswers / 43) * 100).toFixed(2);
        let message_ = "";

        if (point >= 90) {
            message_ = `
        <div style="text-align: center;"><h2>Kelime testi tamamlandı!</h2></div>
        <h3 class="yellow-color">Başarı: ${point}%</h3>
        <p>Performansınız mükemmel! <strong>C2</strong> seviyesine ulaştınız.</p>
        <p>Sonuçlar: Dili mükemmel bir şekilde kavradınız!</p>
    `;
        } else if (point >= 80) {
            message_ = `
        <div style="text-align: center;"><h2>Kelime testi tamamlandı!</h2></div>
        <h3 class="yellow-color">Başarı: ${point}%</h3>
        <p>Performansınız çok iyi! <strong>C1</strong> seviyesine ulaştınız.</p>
        <p>Sonuçlar: Dili çok güçlü bir şekilde kavradınız!</p>
    `;
        } else if (point >= 70) {
            message_ = `
        <div style="text-align: center;"><h2>Kelime testi tamamlandı!</h2></div>
        <h3 class="yellow-color">Başarı: ${point}%</h3>
        <p>Performansınız iyi! <strong>B2</strong> seviyesine ulaştınız.</p>
        <p>Sonuçlar: Dili iyi bir şekilde kavradınız!</p>
    `;
        } else if (point >= 55) {
            message_ = `
        <div style="text-align: center;"><h2>Kelime testi tamamlandı!</h2></div>
        <h3 class="yellow-color">Başarı: ${point}%</h3>
        <p>Performansınız tatmin edici! <strong>B</strong> seviyesine ulaştınız.</p>
        <p>Sonuçlar: Dili tatmin edici bir şekilde kavradınız.</p>
    `;
        } else if (point >= 40) {
            message_ = `
        <div style="text-align: center;"><h2>Kelime testi tamamlandı!</h2></div>
        <h3 class="yellow-color">Başarı: ${point}%</h3>
        <p>Performansınız ortalama. <strong>A2</strong> seviyesine ulaştınız.</p>
        <p>Sonuçlar: Dili temel bir şekilde kavradınız.</p>
    `;
        } else {
            message_ = `
        <div style="text-align: center;"><h2>Kelime testi tamamlandı!</h2></div>
        <h3 class="yellow-color">Başarı: ${point}%</h3>
        <p>Performansınızın geliştirilmesi gerekiyor. Şu anda <strong>A1</strong> seviyesindesiniz.</p>
        <p>Sonuçlar: Dili daha iyi kavrayabilmek için geliştirilmesi gereken alanlar var.</p>
    `;
        }

        document.getElementById("resultMessage").innerHTML = message_ + message;
        modal.style.display = "block";
    }

    span.onclick = function () {
        window.location.href = "/"
    }

    retryButon.onclick = function () {
        window.location.href = url;
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    topFace.addEventListener("click", function () {
        answerSection.style.display = "flex";

        if (box.classList.contains("open-top")) {
            console.log(words);
            submitAnswerButton.disabled = true;
            if (ask_index < ask_line) {
                setTimeout(() => {
                    document.getElementById('box').classList.add('shake');
                }, 1000);
            }
            box.classList.remove("open-top");
        }
        else {
            document.getElementById('box').classList.remove('shake');

            if (ask_index < ask_line) {
                submitAnswerButton.disabled = false;
                box.classList.toggle("open-top");
                createAsk();
            }
            else {
                submitAnswerButton.disabled = true;
            }
        }
    });

    function createAsk() {
        topFace.classList.add("disabled");
        ask_index++;

        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * words.length);
        } while (randomWords.includes(randomIndex));

        currentWord = words[randomIndex];
        randomWords.push(randomIndex);
        askEnglish = Math.random() > 0.5;
        answerText.innerText = "";
        progressContainer.style.display = "flex";

        if (askEnglish) {
            paper.textContent = currentWord.turkish;
        } else {
            paper.textContent = currentWord.english;
        }
        paper.addEventListener('transitionend', function () {
            if (askEnglish) {
                questionText.textContent = `What is the English translation of "${currentWord.turkish}"?`;
            } else {
                questionText.textContent = `What is the Turkish translation of "${currentWord.english}"?`;
            }

        }, { once: true });
    }

    submitAnswerButton.addEventListener("click", function () {

        let isCorrect = false;
        const answer = userAnswer.value.trim().toLowerCase();
        let correctAnswer = askEnglish ? currentWord.english.toLowerCase() : currentWord.turkish.toLowerCase();
        if (answer === correctAnswer) {
            answerText.innerText = "Correct Answer!"
            answerText.style.color = green_color;
            correctNum += currentWord.point;
            isCorrect = true;
            message += `<span class="yellow-border"> 
            ${currentWord.english} = ${currentWord.turkish} 
            <span>✅</span></span><br>`;
        } else {
            answerText.innerText = correctAnswer;
            answerText.style.color = red_color;
            isCorrect = false;
            message += `<span class="yellow-border"> 
            ${currentWord.english} = ${currentWord.turkish} 
            <span>❌</span></span><br>`;
        }
        topFace.classList.remove("disabled");
        updateProgress(isCorrect);
        setTimeout(() => {
            userAnswer.value = "";
            answerText.innerText = "";
            questionText.innerText = "";
            topFace.click();
        }, 2000);

    });

    function updateProgress(isCorrect) {
        if (progress < 100) {
            progress += 100 / ask_line;
            const segment = document.createElement('div');
            segment.classList.add('progress-segment');
            segment.style.width = (100 / ask_line) + '%';
            segment.style.backgroundColor = isCorrect ? green_color : red_color;
            progressContainer.appendChild(segment);

            if (progress >= 100) {
                showGameResult(correctNum);
            }
        }
    }

    userAnswer.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            if (userAnswer.innerText !== null) {
                submitAnswerButton.click();
            }
        }
    });

    const url = `${window.location.origin}${window.location.pathname}`;
    const text = encodeURIComponent('Hadi bakalım!Özenle hazırlanmış bu kelime kutusunda kaç puan alıcaksın 😊');

    document.getElementById('whatsappShareBtn').addEventListener('click', () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const baseUrl = isMobile ? 'https://api.whatsapp.com/send?text=' : 'https://web.whatsapp.com/send?text=';
        window.open(`${baseUrl}${text} ${url}`, '_blank');
    });

    document.getElementById('copyLinkBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(url).catch(err => {
            console.error('Link kopyalanırken bir hata oluştu: ', err);
        });
    });

    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('temp-color');
            setTimeout(() => {
                button.classList.remove('temp-color');
            }, 2000);
        });
    });

}); 