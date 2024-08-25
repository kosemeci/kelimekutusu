document.addEventListener("DOMContentLoaded", function () {
    const box = document.getElementById("box");
    const paper = document.getElementById("paper");
    const topFace = document.getElementById("top");
    const answerSection = document.getElementById("answer-section");
    const questionText = document.getElementById("questionText");
    const userAnswer = document.getElementById("userAnswer");
    const submitAnswerButton = document.getElementById("submitAnswer");
    const answerText = document.getElementById("answerText");
    const modal = document.getElementById("resultModal");
    const span = document.getElementsByClassName("close")[0];
    const retryButon = document.getElementById("retryButton");
    const progressContainer = document.querySelector('.progress-container');
    const dataContainer = document.getElementById('data-container');
    
    let words = [];
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

    const boxId = dataContainer.getAttribute('data-boxid');
    fetch(`/box_create/${boxId}`)
        .then(response => response.json())
        .then(get_words => {
            let wordsArray = JSON.parse(get_words);
            words = wordsArray.map(word => ({
                english: word.english,
                turkish: word.turkish
            }));
            ask_line = words.length;
            document.getElementById('box').classList.add('shake');
        })
        .catch(error => console.error('Error:', error));

    function showGameResult(correctAnswers, totalQuestions) {
        const point = ((correctAnswers / totalQuestions) * 100).toFixed(2);
        let message_ = `<div style="text-align: center;"><h2>The word game is over!</h2></div> <h3 class="yellow-color">Success: ${point}% </h3> Word Results:<br>`;
        document.getElementById("resultMessage").innerHTML = message_ + message;
        modal.style.display = "block";
    }

    span.onclick = function () {
        window.location.href = "/kutum"
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
            if(ask_index<ask_line){
                setTimeout(() => {
                    document.getElementById('box').classList.add('shake');
                }, 25);
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
        submitAnswerButton.disabled = true;
        let isCorrect = false;
        const answer = userAnswer.value.trim().toLowerCase();
        let correctAnswer = askEnglish ? currentWord.english.toLowerCase() : currentWord.turkish.toLowerCase();
        if (answer === correctAnswer) {
            answerText.innerText = "Correct Answer!"
            answerText.style.color = green_color;
            correctNum++;
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
        updateProgress(isCorrect);
        setTimeout(() => {
            userAnswer.value = "";
            answerText.innerText = "";
            questionText.innerText = "";
            topFace.classList.remove("disabled");
            topFace.click();
        }, 1880);
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
                showGameResult(correctNum, ask_line);
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

    const url = `${window.location.origin}/kutum/${boxId}`;
    const text = encodeURIComponent('Hadi bakalım!Benim hazırladığım kelime kutusunda kaç puan alıcaksın 😊'); 

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