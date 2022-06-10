const express = require('express');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(express.static(path.resolve(__dirname, '../client/dist')));


// get database functions
const { getCardsSafely, getTransactions, retrieveCard, addTransaction } = require('./db');

// api
app.get('/getAvailable', cors(), async (req, res) => {
    /* returns giftcards and values
    {
        card type: [
            value,
            ...
        ],
        ...
    }
    */
    return res.json(await getCardsSafely())
})


// web3 stuff
const { serverWallet, chains, coins, abi } = require('./constants');
const Web3 = require('web3');
const Contract = require('web3-eth-contract')

// create web3 instances prematurely to avoid slowdown on individual requests
web3Instances = {}
Object.entries(chains).forEach(([id, rpc]) => {
    web3Instances[id] = new Web3(new Web3.providers.HttpProvider(rpc));
});

app.get('/transaction', cors(), async (req, res) => {
    console.log(req.query)
    const { chainId, cardType, transactionHash } = req.query;
    // check if all required parameters are present
    if (chainId===undefined || cardType===undefined || transactionHash===undefined) {
        return res.status(400).json({ error: 'Missing parameters' })
    }

    // check if the transaction has already been used
    const transactions = await getTransactions();
    if (transactions.includes(transactionHash)) {
        return res.status(400).json({ error: 'Transaction already used' })
    }
    addTransaction(transactionHash)

    // check if card type is valid
    const cards = await getCardsSafely()
    if (!(cardType in cards)) {
        return res.status(400).json({ error: 'Invalid card type' })
    }

    // check if txnHash is valid
    if (!/^0x([A-Fa-f0-9]{64})$/.test(transactionHash)) {
        return res.status(400).json({ error: 'Invalid transaction hash' })
    }

    // check if chainId is valid
    if (!(chainId in chains)) {
        return res.status(400).json({ error: 'Invalid chain id' })
    }

    const web3 = web3Instances[chainId];
    const eth = web3.eth

    // check if transaction exists
    const transaction = await eth.getTransaction(transactionHash)
    if (transaction === null) {
        return res.status(400).json({ error: 'Transaction hash doesn\'t exist' })
    }

    // check if transaction interacts with a valid contract
    const contract_address = transaction.to
    if (!coins[chainId].includes(contract_address)) {
        return res.status(400).json({ error: 'Transaction hash doesn\'t interact with a valid contract' })
    }

    // decode dat abi
    const abiDecoder = require('abi-decoder')
    abiDecoder.addABI(abi);
    const transactionParams = abiDecoder.decodeMethod(transaction.input).params
    // check if transaction is to the server wallet
    if (transactionParams[0].value !== serverWallet) {
        return res.status(400).json({ error: 'Transaction is not to the server wallet' })
    }

    // check if transaction is a valid amount
    const value = parseInt(web3.utils.fromWei(transactionParams[1].value, chainId ? 'ether' : 'lovelace'))
    if (!cards[cardType].includes(value)) {
        return res.status(400).json({ error: `Transaction value is not a valid amount: ${cards[cardType]}` })
    }

    return res.json(await retrieveCard(cardType, value))
})

const PORT = process.env.PORT || 3000;
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
