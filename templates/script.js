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

        socket.on("username_updated", (data) => {
            addMessage(`${data.old_username} changed their name to ${data.new_username}`, "system")

            if(data.old_username === currentUsername) {
                currentUsername = data.new_username; 
                currentUsernameSpan.textContent = `Your username: ${currentUsername}`
            }
        })
        
        sendButton.addEventListener("click", sendMessage);
        messageInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage(); 
            }
        })

        updateUsernameButton.addEventListener("click", updateUsername)

        function sendMessage() {
            const message = messageInput.value.trim();
            if(message) {
                socket.emit("message", {message});
                messageInput.value = ""; 
            }
        }

        function updateUsername() {
            const newUsername = usernameInput.value.trim(); 
            if (newUsername && newUsername !== currentUsername) {
                socket.emit("update_username", {username: newUsername}); 
                usernameInput.value = ""; 
            }
        }
        function addMessage() {}