module.exports = {
    chains: {
        56: "https://bsc-dataseed.binance.org",
        250: "https://rpc.fantom.network",
        43114: "https://api.avax.network/ext/bc/C/rpc",
        // "1666600000": "Harmony",
        // "137": "Polygon"
    },
    coins: {
        56: [// Binance Smart Chain
            "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            "0x55d398326f99059fF775485246999027B3197955"
        ],
        250: [// Fantom Opera
            "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
            "0x049d68029688eabf473097a2fc38ef61633a3c7a"
        ],
        43114: [// Avalanche
            "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
        ]
    }
}