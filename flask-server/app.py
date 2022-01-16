from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

# Init app
app = Flask(__name__, static_url_path='/static')
basedir = os.path.abspath(os.path.dirname(__file__))
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)
# Init ma
ma = Marshmallow(app)

# User Class/Model


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(200), unique=True)
    picture = db.Column(db.String(255))

    def __init__(self, name, email, picture):
        self.name = name
        self.email = email
        self.picture = picture

# User Schema


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'picture')


# Init schema
user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Create a User


@app.route('/users', methods=['POST'])
def add_user():
    print(request.form)
    name = request.form['name']
    email = request.form['email']
    picture = request.files['picture']
    extensionLength = len(picture.filename.split('.')) - 1
    fileExtension = picture.filename.split(".")[extensionLength]
    filename = name + '.' + fileExtension
    picture.save(os.path.join(basedir, 'static/'+filename))

    userPitcure = 'images/'+filename
    new_user = User(name, email, userPitcure)

    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)

# Get All Users


@app.route('/users', methods=['GET'])
def get_users():
    all_users = User.query.all()
    result = users_schema.dump(all_users)
    return jsonify(result)

# Get Single Users


@app.route('/users/<id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)

# Update a User


@app.route('/users/<id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)

    name = request.json['name']
    email = request.json['email']
    picture = request.json['picture']

    user.name = name
    user.email = email
    user.picture = picture

    db.session.commit()

    return user_schema.jsonify(user)

# Delete User


@app.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)


@app.route('/images/<path:filename>')
def download_file(filename):
    return send_from_directory('static', filename, as_attachment=True)


# Run Server
if __name__ == '__main__':
    app.run(debug=True)
