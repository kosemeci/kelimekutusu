document.addEventListener("DOMContentLoaded", function () {
    const formContainer = document.getElementById('form-container');
    const boxContainer = document.getElementById('container-box');
    const userList = document.getElementById('userList');
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const hiddenInput = document.getElementById('category');
    const createRoomTab = document.getElementById('createRoomTab');
    const joinRoomTab = document.getElementById('joinRoomTab');
    const waitingMessage = document.getElementById('waitingMessage');
    const paperText = document.getElementById('paper');
    const errorMessage = document.getElementById('error-message');
    const answerSection = document.getElementById("answer-section");
    const questionText = document.getElementById("questionText");
    const userAnswer = document.getElementById("userAnswer");
    const submitAnswerButton = document.getElementById("submitAnswer");
    const answerText = document.getElementById("answerText");
    const actionButtons = document.getElementById("action-buttons");
    const newGameButton = document.getElementById('newGameButton');
    const resultContainer = document.getElementById('result-container');
    const resultList = document.getElementById('resultList');
    const homeButton = document.getElementById('homeButton');
    const orderQuestion = document.getElementById('selectZ');
    const speakButton = document.getElementById('speakButton');
    const randomRoomId = Math.floor(Math.random() * 9000) + 1000;
    var activeRoomId = "";
    var correctAnswer = [];
    let countdownStartTime = null;
    var elapsedTime = 11;
    let maxCount = 5;
    let count = 0;
    var isMuted = true;

    const socket = io('https://kutukutukelime.com');

    document.getElementById('createRoomForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const newRoomIdField = document.getElementById('newRoomId');
        const newUserNameField = document.getElementById('newUserName');
        const categoryField = document.getElementById('category');
        const roomIdLabel = document.getElementById('roomIdLabel');
        const createNewRoomBtn = document.getElementById('createNewRoom');
        const questionCount = document.getElementById('questionCount');

        if (createNewRoomBtn.innerText === "Oyunu Başlat") {
            const roomStarter = {
                id: randomRoomId,
                status: "start",
                questionCount: parseInt(questionCount.value),
            };
            socket.emit('startGame', roomStarter);
        } else {
            if (dropdownBtn.getAttribute('data-selected') === 'true') {
                newRoomIdField.value = randomRoomId;
                roomIdLabel.style.display = 'block';
                newRoomIdField.style.display = 'block';
                newUserNameField.disabled = true;
                categoryField.disabled = true;
                questionCount.disabled = true;
                newRoomIdField.disabled = true;
                dropdownMenu.style.display = 'none';
                createNewRoomBtn.innerText = "Oyunu Başlat";
                userList.style.display = "block";
                joinRoomTab.disabled = true;

                const creatorName = newUserNameField.value;
                const category = categoryField.value;
                const questionsCount = questionCount.value;
                const player = { id: '', username: creatorName, point: 0, elapsedTime: 11 };
                const roomData = {
                    id: randomRoomId,
                    newPlayer: player,
                    category: category,
                    questionCount: questionsCount,
                };
                socket.emit('joinRoom', roomData);
            }
            else {
                dropdownBtn.innerText = 'Bir kategori seçmelisiniz!';
            }
        }
    });

    document.getElementById('joinRoomForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const roomNumber = document.getElementById('roomNumber').value;
        const player = { id: '', username: username, point: 0, elapsedTime: 11 };
        const roomData = {
            id: roomNumber,
            newPlayer: player,
        };

        socket.emit('joinRoom', roomData);
        socket.on('noRoom', function (info) {
            if (info) {
                errorMessage.style.display = 'block';
            }
            else {
                document.body.classList.add('blur');
                document.getElementById('username').disabled = true;
                document.getElementById('roomNumber').disabled = true;
                document.getElementById('readyButton').disabled = true;
                createRoomTab.disabled = true;
                waitingMessage.style.display = 'block';

                const roomStart = {
                    id: roomNumber,
                    status: "ready"
                };
                socket.emit('startGame', roomStart);
            }
        });
    });

    socket.on('updatePlayers', function (players) {
        const userList = document.getElementById('userList');
        userList.style.display = 'block';
        const playerList = document.getElementById('userListContainer');
        playerList.innerHTML = "";

        players.sort(function (a, b) {
            return b.point - a.point || a.elapsedTime - b.elapsedTime;
        });

        let rank = 1;
        let previousPoint = null;
        let elapsedTimePoint = null;

        players.forEach(function (player, index) {
            const tr = document.createElement('tr');
            const tdRank = document.createElement('td');
            const tdUsername = document.createElement('td');
            const tdPoint = document.createElement('td');
            tdRank.classList.add('rounded-cell');
            if (previousPoint !== null && player.point === previousPoint && player.elapsedTime === elapsedTimePoint) {
                tdRank.textContent = rank;
            } else {
                rank = index + 1;
                tdRank.textContent = rank;
                tr.classList.add('moving-up');
            }

            previousPoint = player.point;
            elapsedTimePoint = player.elapsedTime;
            tdUsername.textContent = player.username;
            tdPoint.textContent = player.point;

            tr.appendChild(tdRank);
            tr.appendChild(tdUsername);
            tr.appendChild(tdPoint);
            playerList.appendChild(tr);
        });
    });

    socket.on("gameStarted", (roomIdInfo) => {
        activeRoomId = roomIdInfo.roomId;
        maxCount = roomIdInfo.maxCount;
        formContainer.style.display = "none";
        waitingMessage.style.display = 'none';
        boxContainer.style.display = "block";
        closeModal();
        orderQuestion.innerText = "1.Soru";
        answerText.textContent = 'Oyun başlıyor...';
        userList.querySelector('h3').innerText = "Skor Tablosu";
    });

    socket.on('newQuestion', async function (questionInfo) {
        submitAnswerButton.innerText = "Send Reply";
        submitAnswerButton.disabled = false;
        userAnswer.disabled = false;
        const askEnglish = questionInfo.askEnglish;
        const questions = questionInfo.question;
        count = questionInfo.count;

        if (askEnglish) {
            paperText.innerText = questions.turkish;
            correctAnswer.push(questions.english);
            if (questions.other_english !== null) { correctAnswer.push(...questions.other_english.split(',')); }
            questionText.textContent = `What is the English translation of "${questions.turkish}"?`;
            const tr = document.createElement('tr');
            const tdAsk = document.createElement('td');
            const tdAnswer = document.createElement('td');
            tdAsk.textContent=questions.turkish;
            tdAnswer.textContent = correctAnswer.join(', ');
            tr.appendChild(tdAsk);
            tr.appendChild(tdAnswer);
            resultList.appendChild(tr);
            if(!isMuted){speakText(currentWord.turkish, 'tr-TR');}
        } else {
            paperText.innerText = questions.english;
            correctAnswer.push(questions.turkish);
            if (questions.other_turkish !== null) { correctAnswer.push(...questions.other_turkish.split(',')); }
            questionText.textContent = `What is the Turkish translation of "${questions.english}"?`;
            const tr = document.createElement('tr');
            const tdAsk = document.createElement('td');
            const tdAnswer = document.createElement('td');
            tdAsk.textContent=questions.english;
            tdAnswer.textContent = correctAnswer.join(', '); 
            tr.appendChild(tdAsk);
            tr.appendChild(tdAnswer);
            resultList.appendChild(tr);
            if(!isMuted){speakText(currentWord.english, 'en-GB');}  
        }
        answerText.textContent = '15'
        box.classList.toggle("open-top");
        answerSection.style.display = "flex";
        socket.emit('questionReceived', { roomId: activeRoomId });
    });
    socket.on('startCountdown', function (data) {
        const countdownTime = data.countdownTime;
        startCountdown(countdownTime, answerText);
    });
    
    function startCountdown(duration, display) {
        let timer = duration * 1000;
        countdownStartTime = Date.now();
        elapsedTime = duration + 1;

        const countdownInterval = setInterval(function () {
            let seconds = Math.floor(timer / 1000);
            let milliseconds = Math.floor((timer % 1000) / 10);

            seconds = seconds < 10 ? '0' + seconds : seconds;
            milliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds;

            display.textContent = `${seconds}:${milliseconds}`;
            timer -= 10;

            if (timer < 0) {
                clearInterval(countdownInterval);
                display.textContent = "Time's up!";

                const answer = userAnswer.value.trim().toLocaleLowerCase('tr-TR');
                let isCorrect = "wrong";
                if (correctAnswer.includes(answer)) {
                    isCorrect = "correct";
                }

                const infoAnswer = {
                    id: activeRoomId,
                    answer: isCorrect,
                    elapsedTime: elapsedTime,
                };

                socket.emit("answerQuestion", infoAnswer);
                userAnswer.value = '';
                correctAnswer = [];
                answerSection.style.display = "none";
                questionText.textContent = '';
                box.classList.remove("open-top");
                if(count<maxCount+1){orderQuestion.innerText = count + ".Soru";};
            }
        }, 10);
    }
    function speakText(text, language = 'en-GB') {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
    submitAnswerButton.addEventListener("click", function () {
        submitAnswerButton.disabled = true;
        userAnswer.disabled = true;
        submitAnswerButton.innerText = "Cevap gönderildi!";
        window.scrollTo(0, 0);
        const currentTime = Date.now();
        elapsedTime = currentTime - countdownStartTime;
    });
    speakButton.addEventListener('click', () => {
        isMuted = !isMuted;
            if (isMuted) {
                speakButton.classList.remove("fa-volume-up");
                speakButton.classList.add("fa-volume-mute");
            } else {
                speakButton.classList.remove("fa-volume-mute");
                speakButton.classList.add("fa-volume-up");
            }
    });
    socket.on('gameEnded', function (players) {
        var userList = document.getElementById('userList');
        boxContainer.style.display = "none";
        const screenWidth = window.innerWidth;
        if (screenWidth <= 600) {
            userList.style.marginTop = '26%';
        } else if (screenWidth > 600 && screenWidth <= 1024) {
            userList.style.marginTop = '14%';
        } else {
            userList.style.marginTop = '10%';
        }        
        var confettiContainer = document.getElementById('confetti-container');
        confettiContainer.style.display = 'block';
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            decay: 0.95,
        });
        players.sort((a, b) => b.point - a.point || a.elapsedTime - b.elapsedTime);
        var firstPlayer = players[0];

        var winnerName = document.getElementById('winner-name');
        var winnerDiv = document.getElementById('winner');

        winnerName.innerHTML = '<p style="color:black;">Kelime Yarışmasının Galibi</p><br><i class="fa-solid fa-trophy"></i> ' + firstPlayer.username;
        winnerDiv.style.display = 'block';
        actionButtons.style.display = 'block';
        resultContainer.style.display ='block';
        setTimeout(() => {
            winnerDiv.style.display = 'none';
        }, 4000);

    });

    dropdownBtn.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownMenu.classList.toggle('show-menu');
    });
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            dropdownBtn.setAttribute('data-selected', 'true');
            dropdownBtn.innerText = this.innerText;
            hiddenInput.value = this.getAttribute('data-value');
            dropdownMenu.classList.remove('show-menu');
        });
    });

    window.onclick = function (event) {
        if (!event.target.matches('.dropdown-toggle')) {
            if (dropdownMenu.classList.contains('show-menu')) {
                dropdownMenu.classList.remove('show-menu');
            }
        }
    };

    userAnswer.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            if (userAnswer.innerText !== null) {
                submitAnswerButton.click();
            }
        }
    });

    document.getElementById('roomNumber').addEventListener('input', function () {
        const value = this.value;

        if (value.length !== 4) {
            this.setCustomValidity('Lütfen 4 haneli bir numara girin.');
        } else {
            this.setCustomValidity('');
        }
    });
    homeButton.addEventListener('click', () => {
        window.location.href = '/';
    });
    newGameButton.addEventListener('click', () => {
        window.location.href = '/kelime-yarismasi';
    });
});
function openForm(evt, formName) {
    const tabcontent = document.getElementsByClassName("tab-content");
    const tablinks = document.getElementsByClassName("tab-link");

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(formName).style.display = "block";
    evt.currentTarget.className += " active";
}
function openModal() {
    const modal = document.getElementById('gameRulesInfo');
    modal.style.display = 'flex';
}
function closeModal() {
    const modal = document.getElementById('gameRulesInfo');
    modal.style.display = 'none';
}
