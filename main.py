from faceEncoding import faceEncode
from studentAtten import start_attendance
faceEncode('images','teacherEnco.pkl')
faceEncode('studentimage','studentEnco.pkl')

start_attendance("teacherEnco.pkl",'teacher') # This is the file name where the face encodings are saved
start_attendance("studentEnco.pkl",'student') # This is the file name where the face encodings are saved
