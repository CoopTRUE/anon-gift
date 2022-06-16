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

async function newCard(){
    await db.addCard(
        (await ask('Fake: ')) === 'true',
        await ask('Type: '),
        parseInt(await ask('Value: ')),
        await ask('Code: ')
    )
    console.log('Card added')
}

newCard()