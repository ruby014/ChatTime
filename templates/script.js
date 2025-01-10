const socket = io(); // get socket instance to enable handling of events to backend 
        const chatMessages = document.getElementById("chat-messages");
        const messageInput = document.getElementById("message-input");
        const sendButton = document.getElementById("send-button");
        const currentUsernameSpan = document.getElementById("current-username");
        const usernameInput = document.getElementById("username-input"); 
        const updateUsernameButton = document.getElementById("update-username-button");

        let currentUsername = ""; 

        socket.on("set_username", (data) => {
            curreusernameInput = data.username
            currentUsernameSpan.textContent = `Your username: ${currentUsername}`;
        })

        socket.on("user_joined", data => {
            addMessage(`${data.username} joined the chat!`, "system")
        })

        socket.on("user_left", data => {
            addMessage(`${data.username} has left the chat`, "system")
        })

        socket.on("new_message", data => {
            addMessage(data.message,"user", data.username, data.avatar)
        })

        socket.on("username_updated", data => {
            addMessage(data.message,"user", data.username, data.avatar)
        })
