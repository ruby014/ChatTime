from app import app, socketio
if __name__ == '__main__':
    socketio.run(app)

# Gunicorn and wsgi - stands for web server gateway interface are used to deploy and serve python web applications, like those built with frameworks like Flask and Django 