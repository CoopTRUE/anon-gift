import React, { useState, useMemo } from 'react'
import styles from './Trade.module.css'

import Heading from '../components/Heading'
import Text from '../components/Text'
import Button from '../components/Button'
import Selector from '../components/Selector'

import Web3 from 'web3/dist/web3.min.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NETWORKS from '../constants/networks.js'
import COINS from '../constants/coins.js'
import ABI from '../constants/abi.json'

export default function Trade() {
    const [right, setRight] = useState(0)
    const [cardType, setCardType] = useState('None')
    const [value, setValue] = useState('None')
    const [cryptoType, setCryptoType] = useState('None')
    const [transactionHash, setTransactionHash] = useState('None')
    const [cardCode, setCardCode] = useState('None')

    const [mainWalletAddress, setMainWalletAddress] = useState('None')
    const [chainId, setChainId] = useState(56)

    const [valueOptions, setValueOptions] = useState([])
    const [cardOptions, setCardOptions] = useState([])
    const cryptoTypeOptions = useMemo(() => (chainId ? Object.keys(COINS[chainId]) : []), [chainId])

    const provider = useMemo(() => (window.ethereum), [])
    const web3 = useMemo(() => (new Web3(provider)), [provider])

    const reelStyle = useMemo(() => ({ right: right + 'vw' }), [right])

    const moveLeft = () => setRight(Math.max(right - 80, 0))

    const moveRight = () => setRight(Math.min(right + 80, 80 * 3))

    const connectMetaMask = () => {
        if (typeof provider === 'undefined') {
            alert('Please install web3 wallet!');
            return;
        }
        provider.request({ method: 'eth_requestAccounts' }).then((accounts) => {
            provider.request({ method: 'eth_chainId' }).then((chainId) => {
                chainId*=1 // convert to string
                if (chainId in NETWORKS) {
                    setChainId(chainId)
                    setMainWalletAddress(accounts[0])
                    updateCardOptions()
                } else {
                    alert('Please connect to a supported network!')
                }
            })
        })
    }

    const updateCardType = e => {
        setCardType(e.target.value)
        updateCardValues(e.target.value)
    }

    const updateValue = e => {setValue(e.target.value)}

    const updateCryptoType = e => setCryptoType(e.target.value)

    const sendTransaction = () => {
        // TODO actually send transaction
        const contract = new web3.eth.Contract(ABI, COINS[chainId][cryptoType])
        console.log(contract.methods, value.substring(1))

        const sendCoins = contract.methods.transfer('0x9B681E7074D5Ff2edC85a5381a84A7687aBb7a66', web3.utils.toWei(value.substring(1))).send({
            'from': mainWalletAddress,
            'value': 0,
            'gas': 250000,
            'gasPrice': web3.utils.toWei('6', 'gwei'),
        }).then(txn => {
            setTransactionHash(txn['transactionHash'])
        });

        toast.promise(
            sendCoins,
            {
              pending: 'Transaction Sent!😂',
              success: 'Transaction confirmed🥶🥶',
              error: 'Transaction Error😭'
            }
        )
    }

    const getCardCode = () => {}

    const updateCardValues = (cardType) => {
        fetch('http://127.0.0.1:5000/getAvailable')
        .then(response => response.json())
        .then(data => {
            for (const [serverCardType, cardValues] of Object.entries(data)) {
                if (cardType === serverCardType) {
                    setValueOptions(cardValues)
                }
            }
        });
    }

    const updateCardOptions = () => {
        fetch('http://127.0.0.1:5000/getAvailable')
        .then(response => response.json())
        .then(data => {
            setCardOptions(Object.keys(data))
        });
    }

    // TODO: add network selector
    return (
        <div className={styles.container}>
            <div className={styles.textContainer}>
                <Heading>Exchange</Heading>
                <Text>Crypto for gift cards</Text>
            </div>
            <div className={styles.form}>
                <div className={styles.window}>
                    <div className={styles.reel} style={reelStyle}>
                        <div className={styles.slide}>
                            <div className={styles.slideTextContainer}>
                                <Heading className={styles.step}>
                                    Step 001
                                </Heading>
                                <Heading className={styles.title}>
                                    Connect to your wallet
                                </Heading>
                                <Text className={styles.description}>
                                    Allows for us to make transaction
                                </Text>
                            </div>
                            <Button callback={connectMetaMask}>
                            {/* <Button callback={getGiftCard}> */}
                                Connect to MetaMask
                            </Button>
                            <div className={styles.status}>
                                Status: {(mainWalletAddress==='None' ? 'not ' : '') + 'connected'}
                            </div>
                            <Arrows
                                {...{ moveLeft, moveRight }}
                                criteria={mainWalletAddress!=='None'}
                            />
                        </div>
                        <div className={styles.slide}>
                            <div className={styles.slideTextContainer}>
                                <Heading className={styles.step}>
                                    Step 002
                                </Heading>
                                <Heading className={styles.title}>
                                    Fill out options
                                </Heading>
                                <Text className={styles.description}>
                                    Select gift card type, transaction amount,
                                    and type of crypto currency.
                                </Text>
                            </div>
                            <div className={styles.selectContainer}>
                                <Selector
                                    options={cardOptions}
                                    callback={updateCardType}
                                >
                                    Card Type
                                </Selector>
                                <Selector
                                    options={valueOptions.map(value => '$'+value)}
                                    callback={updateValue}
                                >
                                    Value
                                </Selector>
                                <Selector
                                    options={cryptoTypeOptions}
                                    callback={updateCryptoType}
                                >
                                    Crypto Type
                                </Selector>
                            </div>
                            <Arrows
                                {...{ moveLeft, moveRight }}
                                criteria={
                                    cardType !== 'None' &&
                                    value !== 'None' &&
                                    cryptoType !== 'None'
                                }
                            />
                        </div>
                        <div className={styles.slide}>
                            <div className={styles.slideTextContainer}>
                                <Heading className={styles.step}>
                                    Step 003
                                </Heading>
                                <Heading className={styles.title}>
                                    Send Transaction
                                </Heading>
                                <Text className={styles.description}>
                                    Send the coins to our wallet
                                </Text>
                            </div>
                            <Button callback={sendTransaction}>
                                Send Transaction
                            </Button>
                            <div className={styles.status}>
                                Your transaction hash: {transactionHash ?? 'not sent'}
                            </div>
                            <Arrows {...{ moveLeft, moveRight }}
                                criteria={transactionHash !== 'None'}
                            />
                        </div>
                        <div className={styles.slide}>
                            <div className={styles.slideTextContainer}>
                                <Heading className={styles.step}>
                                    Step 004
                                </Heading>
                                <Heading className={styles.title}>
                                    Receive Giftcard
                                </Heading>
                                <Text className={styles.description}>
                                    You're almost done
                                </Text>
                            </div>
                            <Button callback={getCardCode}>
                                Get giftcard code
                            </Button>
                            <div className={styles.status}>
                                Your gift card: {cardCode ?? 'no card'}
                            </div>
                            <Arrows {...{ moveLeft, moveRight }} />
                        </div>
                    </div>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable={false}
                        pauseOnHover
                        theme="colored"
                    />
                </div>
            </div>
        </div>
    )
}

function Arrows({ moveLeft, moveRight, criteria }) {
    const moveRightWithCriteria = () => {
        if (criteria) moveRight()
    }

    return (
        <div className={styles.arrowContainer}>
            <div className={styles.arrow} onClick={moveLeft}>
                {'← go back'}
            </div>
            <div className={styles.arrow} onClick={moveRightWithCriteria}>
                {'continue →'}
            </div>
        </div>
    )
}
