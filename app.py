import eventlet
eventlet.monkey_patch()

from flask import Flask,render_template,request
from flask_socketio import SocketIO, emit
import random

# create Flask app to use it 
app = Flask(__name__)
socketio = SocketIO(app)

# python dict. To keep track of connected users. Key is socketid, value is username and avatarUrl
users = {}

@app.route('/')
def index():
        return render_template('index.html')

@socketio.on('connect') # listening for the connect event as per the on method 
def handle_connect():
        username = f"User_{random.randint(1000,9999)}"
        gender = random.choice(["girl","boy"])
        # as per this randomly generated url, profile pic will be different
        avatar_url = f" https://avatar.iran.liara.run/public/{gender}?username={username}"

        users[request.sid] = { "username":username,"avatar":avatar_url}

        # emit: notifies people in the chat of event that happened e.g. user joined
        emit("user_joined", {"username":username,"avatar":avatar_url},broadcast=True)

        emit("set_username", {"username":username})

@socketio.on('disconnect')
def handle_disconnect():
    user = users.pop(request.sid, None)
    if user:
        emit("user_left",{"username":user["username"]},broadcast=True)

@socketio.on('send_message')
def handle_message(data):
    user = users.get(request.sid)
    if user:
        emit("new_message", {
              "username":user["username"], 
              "avatar":user["avatar"],
              "message":data["message"]
        }, broadcast=True)

@socketio.on("update_username")
def handle_update_username(data):
    old_username = users[request.sid]["username"]
    new_username = data["username"]
    users[request.sid]["username"] = new_username

    emit("username_updated", {
          "old_username":old_username, 
          "new_username":new_username
    }, broadcast=True)

if __name__ == "__main__":
        socketio.run(app); 