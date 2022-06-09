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
    await require('./connectDb')();
    const giftcard = new Giftcard({
        name: await ask('Name: '),
        value: await ask('Value: '),
        code: await ask('Code: ')
    })
    giftcard.save()
    console.log("done")
}

newCard()
