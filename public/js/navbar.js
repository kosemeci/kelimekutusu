const newRoomButton = document.getElementById("newRoom");
const wordBoxBrand = document.getElementById("wordBoxBrand");

newRoomButton.addEventListener("click", function() {
    window.location.href = '/kelime-yarismasi';
});

wordBoxBrand.addEventListener("click", function () {
    window.location.href = '/';
});