from sqlite3 import Timestamp
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
from sqlalchemy.sql import func
import os

# Init app
app = Flask(__name__, static_url_path='/static')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

basedir = os.path.abspath(os.path.dirname(__file__))
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Init db
db = SQLAlchemy(app)
# Init ma
ma = Marshmallow(app)

# Attendance Class/Model


class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(200))
    picture = db.Column(db.String(255))
    type = db.Column(
        db.Enum('ENTRY', 'EXIT'), nullable=False, server_default="ENTRY")
    timestamp = db.Column(db.DateTime(timezone=False),
                          server_default=func.now())

    def __init__(self, name, email, picture, type):
        self.name = name
        self.email = email
        self.picture = picture
        self.type = type

# Attendance Schema


class AttendanceSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'picture', 'type', 'timestamp')


# Init schema
attendance_schema = AttendanceSchema()
attendances_schema = AttendanceSchema(many=True)

# Create a Attendance


@ app.route('/attendances', methods=['POST'])
@cross_origin()
def add_attendance():
    print(request.form)
    name = request.form['name']
    email = request.form['email']
    type = request.form['type']
    picture = request.files['picture']
    if(type == 'EXIT'):
        entry = Attendance.query.filter(
            Attendance.name.like(name),
            Attendance.email.like(email)).first()
        data = attendance_schema.dump(entry)
        if not data:
            result = {"message": 'No entry data found', "data": data}
            return jsonify(result), 400
    extensionLength = len(picture.filename.split('.')) - 1
    fileExtension = picture.filename.split(".")[extensionLength]
    filename = name + '.' + fileExtension
    picture.save(os.path.join(basedir, 'static/'+filename))

    attendancePitcure = 'images/'+filename
    new_attendance = Attendance(name, email, attendancePitcure, type)

    db.session.add(new_attendance)
    db.session.commit()

    data = attendance_schema.dump(new_attendance)
    message = 'Entry recorded successfully' if type == 'ENTRY' else 'Exit recorded successfully'
    result = {"message": message, "data": data}
    return jsonify(result)

# Get All Attendances


@ app.route('/attendances/current', methods=['GET'])
def get_attendances():
    currentAttendanceSQL = "select * from attendance as aa where aa.email not in (select a.email from attendance as a where date(a.timestamp) = date() and a.type = 'EXIT') and date(timestamp) = date()"
    result = db.engine.execute(currentAttendanceSQL)
    data = [dict(row) for row in result]
    return jsonify({'data': data, 'message': "List of currently active entries for today"})


@ app.route('/attendances', methods=['GET'])
def get_attendances():
    currentAttendanceSQL = "select * from attendance as aa where date(timestamp) = date()"
    result = db.engine.execute(currentAttendanceSQL)
    data = [dict(row) for row in result]
    return jsonify({'data': data, 'message': "List of all entries for today"})


@ app.route('/images/<path:filename>')
def download_file(filename):
    return send_from_directory('static', filename, as_attachment=True)


# Run Server
if __name__ == '__main__':
    app.run(debug=True)
