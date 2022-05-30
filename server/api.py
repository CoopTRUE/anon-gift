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

CHAINS = {
    56: "https://bsc-dataseed.binance.org",
    250: "https://rpc.fantom.network",
    43114: "https://api.avax.network/ext/bc/C/rpc",
    # "1666600000": "Harmony",
    # "137": "Polygon"
}

COINS = {
    56: [# Binance Smart Chain
        "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        "0x55d398326f99059fF775485246999027B3197955"
    ],
    250: [# Fantom Opera
        "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
        "0x049d68029688eabf473097a2fc38ef61633a3c7a"
    ],
    43114: [# Avalanche
        "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
    ]
}

def get_cards():
    with open("data.json") as fp:
        return json.load(fp)


def get_cards_safe(use_real_name: bool = False):
    return {
        card_type: [
            card_value
            for card_value, card_codes in card_values.items()
            if len(card_codes) > 0
        ]
        for card_type, card_values in get_cards().items()
    }


class get_available(Resource):
    def get(self):
        return get_cards_safe(True)


class transaction(Resource):
    def post(self, chain_id, card_type):
        chain_id = int(chain_id)
        if (not request.json or not (txn_hash:=request.json.get("txn-hash"))):
            abort(404, message="The txn hash is not found in the request")

        with open("used.txt") as fp:
            used = fp.read().split("\n")
            if txn_hash in used:
                abort(404, message="The txn hash has already been used")
        with open("used.txt", "a") as fp:
            fp.write(f"{txn_hash}\n")

        cards_safe = get_cards_safe()

        if card_type not in cards_safe:
            abort(404, message=f"{card_type!s} IS NOT A SUPPORTED CARD")


        if TXN_REGEX.match(txn_hash) is None:
            abort(404, message="The txn hash is not valid")

        if not CHAINS.get(chain_id):
            abort(404, message="The chain is not supported")

        web3 = Web3(Web3.HTTPProvider(CHAINS[chain_id]))
        eth = web3.eth

        try:
            transaction = eth.get_transaction(txn_hash)
        except TransactionNotFound:
            abort(404, message="The txn hash is not found in the blockchain")

        contract_address = transaction["to"]
        if contract_address not in COINS[chain_id]:
            abort(404, message="The transaction does not interact with a valid contract")

        contract = eth.contract(address=contract_address, abi=ABI)
        transaction_arguments = contract.decode_function_input(transaction["input"])[1]
        if transaction_arguments["recipient"] != MAIN_WALLET:
            abort(404, message="The transaction was not sent to the main wallet")

        total = str(web3.fromWei(transaction_arguments["amount"], ("ether" if chain_id == 56 else "lovelace")))
        print(total)
        if total not in cards_safe[card_type]:
            abort(404, message="The transaction amount is not valid")

        return get_card(card_type, total)

def get_card(card_type, card_value, pop = True):
    cards = get_cards()
    if pop:
        card_code = cards[card_type][card_value].pop()
    else:
        card_code = cards[card_type][card_value][0]
    return card_value
    # return {
    #     "card-type": card_type,
    #     "card-code": card_code,
    #     "card-value": card_value,
    # }




api.add_resource(get_available, '/getAvailable')
api.add_resource(transaction, '/transaction/<chain_id>/<card_type>')

if __name__ == '__main__':
    app.run(debug=True)