document.addEventListener("DOMContentLoaded", function () {

    const addButton = document.getElementById("addButton");
    const startButton = document.getElementById("startButton");
    const englishWordInput = document.getElementById("englishWord");
    const turkishWordInput = document.getElementById("turkishWord");
    const wordList = document.getElementById("wordList");
    const basket = document.getElementById("basket");
    const myboxNone = document.getElementById('myboxNone');

    myboxNone.remove();
    let words = [];
    let boxId = 0;

    addButton.addEventListener("click", function () {
        const englishWord = englishWordInput.value.trim();
        const turkishWord = turkishWordInput.value.trim();
        if (englishWord && turkishWord) {
            const word = { english: englishWord, turkish: turkishWord };
            words.push(word);
            addWordToList(word);
            englishWordInput.value = "";
            turkishWordInput.value = "";
            basket.style.display = "block";
            englishWordInput.setAttribute("placeholder", "English Word");
            turkishWordInput.setAttribute("placeholder", "Turkish Word");
        }
        else if (!englishWord) {
            englishWordInput.setAttribute("placeholder", "Bu alanı doldur!");
        }
        else if (!turkishWord) {
            turkishWordInput.setAttribute("placeholder", "Bu alanı doldur!");
        }
    });

    function addWordToList(word) {
        const li = document.createElement("li");
        li.textContent = `${word.english} = ${word.turkish}`;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const deleteButton = document.createElement("i");
        deleteButton.classList.add("fas", "fa-trash-alt");
        deleteButton.addEventListener("click", function () {
            deleteWord(word, li);
        });

        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);
        wordList.appendChild(li);
    }

    function deleteWord(word, li) {
        const index = words.indexOf(word);
        if (index > -1) {
            words.splice(index, 1);
            wordList.removeChild(li);
        }
    }

    startButton.addEventListener("click", function () {
        if (words.length > 0) {
            boxId = Math.floor(Math.random() * 90000000000) + 10000000000;
            fetch('/create_box', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boxId: boxId,
                    words: words
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/kutum/" + boxId;
                } else {
                    console.log('Kayıt başarısız:', data.message);
                }
            })
            .catch(error => {
                console.error('İstek sırasında bir hata oluştu:', error);
            });
        }
    });

    englishWordInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            turkishWordInput.focus();
        }
    });
    turkishWordInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            if (turkishWordInput.innerText !== null && englishWordInput.innerText !== null) {
                englishWordInput.focus();
                addButton.click();
            }
        }
    });
});