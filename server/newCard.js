const db = require('./db')

function ask(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        readline.question(question, (answer) => {
            resolve(answer);
            readline.close()
        });
    });
}

const Giftcard = require('./model')

async function newCard(){
    await db.addCard(
        await ask('Name: '),
        await ask('Value: '),
        await ask('Code: ')
    )
    console.log('Card added')
}

newCard()