from flask import Flask

app = Flask(__name__)

from eventsearch import routes
# The above statement is to import the routes 