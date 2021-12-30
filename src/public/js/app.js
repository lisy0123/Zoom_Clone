const socket = io();

const welcome = document.getElementById("welcome");
const enterForm = welcome.querySelector("#enterRoom");
const room = document.getElementById("room");

room.hidden = true;
let roomName = "";
let nickName = "";

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const msgInput = room.querySelector("#message");
    const msg = msgInput.value;
    socket.emit("new_message", msg, roomName, () => {
        addMessage(`You: ${msg}`);
    });
    msgInput.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#change");
    socket.emit("nickname", input.value);
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `[ ${roomName} Room ]`;
    
    const chgForm = room.querySelector("#chg");
    chgForm.addEventListener("submit", handleNicknameSubmit);
    
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const roomInput = enterForm.querySelector("#roomName");
    const nameInput = enterForm.querySelector("#nickName");
    roomName = roomInput.value;
    nickName = nameInput.value;
    socket.emit("enter_room", { payload: { roomName, nickName } }, showRoom);
    roomInput.value = "";
    nameInput.value = "";
}

enterForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `[ ${roomName} Room ] (${newCount})`;
    addMessage(`${user} joined the room!`);
});

socket.on("bye", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `[ ${roomName} Room ] (${newCount})`;
    addMessage(`${user} left the room!`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerText = "";
    if (rooms.length === 0) {
        roomList.innerText = "";
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});