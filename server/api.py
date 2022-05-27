from email import message
from web3 import Web3
from web3.exceptions import TransactionNotFound
from flask import Flask, request
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource
import json
import os
import re

app = Flask(__name__)
CORS(app)
api = Api(app)

TXN_REGEX = re.compile("^0x([A-Fa-f0-9]{64})$")
ABI = '[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
MAIN_WALLET = "0x9B681E7074D5Ff2edC85a5381a84A7687aBb7a66"

web3 = Web3(Web3.HTTPProvider("https://bsc-dataseed.binance.org/"))
while not web3.isConnected():
    web3 = Web3(Web3.HTTPProvider("https://bsc-dataseed.binance.org/"))
eth = web3.eth
eth.get_transaction

FAKE_TO_REAL = {
    "visa": "Visa Credit Card",
    "amazon": "Amazon Gift Card",
}
CONTRACT_ADDRESSES = {
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", #busd
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", #usdc
    "0x55d398326f99059fF775485246999027B3197955", #usdt
}


def get_cards():
    with open("data.json") as fp:
        return json.load(fp)


def get_cards_safe():
    return {
        FAKE_TO_REAL[card_type]: [
            card_value
            for card_value, card_codes in card_values.items()
            if len(card_codes) > 0
        ]
        for card_type, card_values in get_cards().items()
    }


class get_available(Resource):
    def get(self):
        return get_cards_safe()


class transaction(Resource):
    def post(self, card_type):
        if not request.json or not (txn_hash:=request.json.get("txn-hash")):
            abort(404, message="The txn hash is not found in the request")

        with open("used.txt") as fp:
            used = fp.read().split("\n")
            if txn_hash in used:
                return abort(404, message="The txn hash has already been used")
        with open("used.txt", "a") as fp:
            fp.write(f"{txn_hash}\n")

        if TXN_REGEX.match(txn_hash) is None:
            return abort(404, message="The txn hash is not valid")

        # check if txn is in the blockchain
        try:
            transaction = eth.get_transaction(txn_hash)
        except TransactionNotFound:
            return abort(404, message="The txn hash is not found in the blockchain")

        contract_address = transaction["to"]
        if contract_address not in CONTRACT_ADDRESSES:
            return abort(404, message="The transaction does not interact with a valid contract")
        contract = eth.contract(address=contract_address, abi=ABI)
        transaction_arguments = contract.decode_function_input(transaction["input"])[1]
        # transaction arguments -> {"recipient": "0x...", "amount": "1..."}

        if transaction_arguments["recipient"] != MAIN_WALLET:
            abort(404, message="The transaction is not sent to the main wallet")

        if str(web3.fromWei(transaction_arguments["amount"], "ether")) not in get_cards_safe().get(FAKE_TO_REAL[contract_address]):




api.add_resource(get_available, '/getAvailable')
api.add_resource(transaction, '/transaction/<card_type>')

if __name__ == '__main__':
    app.run(debug=True)