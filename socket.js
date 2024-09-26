module.exports = function (io) {

    const db = require("./data/db");
    let rooms = {};

    io.on("connection", (socket) => {

        socket.on("joinRoom", (roomData) => {

            const roomId = String(roomData.id);
            var infoUser = roomData.newPlayer;
            infoUser.id = socket.id;
            let noRoom = "";
            if (!(roomData.hasOwnProperty('category'))) {
                if (!rooms[roomId]) {
                    noRoom = true;
                    socket.emit("noRoom", noRoom);
                }
                else {
                    noRoom = false;
                    socket.emit("noRoom", noRoom);
                    if (!rooms[roomId].players.some(player => player.id === infoUser.id)) {
                        rooms[roomId].players.push(infoUser);
                    }
                    socket.join(roomId);
                    io.in(roomId).emit("updatePlayers", rooms[roomId].players);
                }
            }
            else {
                if (!rooms[roomId]) {
                    rooms[roomId] = {
                        players: [],
                        category: roomData.category,
                        isGameStarted: false,
                        questionCount: roomData.questionCount,
                    };
                }
                if (!rooms[roomId].players.some(player => player.id === infoUser.id)) {
                    rooms[roomId].players.push(infoUser);
                }
                socket.join(roomId);
                io.in(roomId).emit("updatePlayers", rooms[roomId].players);
            }
        });
        socket.on("startGame", (roomStart) => {
            const roomId = String(roomStart.id);
            const maxCount = roomStart.questionCount;
            const startId = {
                roomId : roomId,
                maxCount : maxCount,
            }
            if (roomStart.status === 'start') {
                rooms[roomId].isGameStarted = true;
            }
            if (rooms[roomId].isGameStarted) {
                io.to(roomId).emit("gameStarted", startId);
                sendQuestions(roomId);
            } else {
                console.log("Oyun henüz başlatılmadı.");
            }
        });
        socket.on("answerQuestion", (infoAnswer) => {
            const answer = infoAnswer.answer;
            const num_id = String(infoAnswer.id);
            const elapsedTime = infoAnswer.elapsedTime;
            const player = rooms[num_id].players.find((p) => p.id === socket.id);
            player.elapsedTime += elapsedTime;
            if (answer === "correct") {
                player.point += 10;
            }
            io.to(num_id).emit("updatePlayers", rooms[num_id].players);
        });
        socket.on("disconnect", () => {
            for (const roomId in rooms) {
                rooms[roomId].players = rooms[roomId].players.filter(
                    (player) => player.id !== socket.id
                );
                io.to(roomId).emit("updatePlayers", rooms[roomId].players);
            }
        });
        socket.on('questionReceived', (data) => {
            const roomId = data.roomId;
            const countdownTime = 15;
            io.to(roomId).emit("startCountdown", { countdownTime });
        });
    });

    async function sendQuestions(roomId) {
        const category = rooms[roomId].category;
        const questionCount = +rooms[roomId].questionCount;
        const questions = await getQuestionsByCategory(category, questionCount);
        let questionIndex = 0;

        setTimeout(function () {
            const questionInfo = {
                question: questions[questionIndex],
                askEnglish: Math.random() > 0.5,
                count : questionIndex+2,
            };
            io.to(roomId).emit("newQuestion", questionInfo);
            const countdownTime = 15;
            questionIndex++;

            const interval = setInterval(() => {
                if (questionIndex < questions.length) {
                    const questionInfo = {
                        question: questions[questionIndex],
                        askEnglish: Math.random() > 0.5,
                        count:questionIndex+2,
                    };
                    io.to(roomId).emit("newQuestion", questionInfo);
                    questionIndex++;
                } else {
                    clearInterval(interval);
                    io.to(roomId).emit("gameEnded", rooms[roomId].players);
                }
            }, 20500);
        }, 5000);
    }
    async function getQuestionsByCategory(category, questionCount) {
        try {
            const [categoryCheck] = await db.query('SELECT english FROM t_category WHERE turkish = ? LIMIT 1', [category]);
            const count = categoryCheck.length;
            let result;
            if (count === 0) {
                [result] = await db.query('SELECT english, turkish,other_english,other_turkish FROM words WHERE level = ? ORDER BY RAND() LIMIT ?', [category, questionCount]);
            }
            else {
                [result] = await db.query('SELECT english, turkish,other_english,other_turkish FROM categories WHERE category = ? ORDER BY RAND() LIMIT ?', [categoryCheck[0].english, questionCount]);
            }
            return result;
        } catch (err) {
            console.error('Error fetching questions:', err);
            return [];
        }
    }
};