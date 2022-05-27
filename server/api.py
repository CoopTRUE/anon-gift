from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import json
import os

app = Flask(__name__)
CORS(app)
api = Api(app)

FAKE_TO_REAL = {
    "visa": "Visa Credit Card",
    "amazon": "Amazon Gift Card"
}
REAL_TO_FAKE =  {v: k for k, v in FAKE_TO_REAL.items()}

class get_available(Resource):
    def get(self):
        with open("data.json") as fp:
            cards = json.load(fp)

        return {
            FAKE_TO_REAL[card_type]: [
                card_value
                for card_value in cards[card_type]
                if len(cards[card_type][card_value]) > 0
            ]
            for card_type in cards
        }

api.add_resource(get_available, '/getAvailable')

if __name__ == '__main__':
    app.run(debug=True)