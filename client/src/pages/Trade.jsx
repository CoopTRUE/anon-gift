import React, { useState, useMemo, useEffect } from 'react'
import styles from './Trade.module.css'

import Heading from '../components/Heading'
import Text from '../components/Text'
import Button from '../components/Button'
import Selector from '../components/Selector'
import Modal from 'react-modal'

import Web3 from 'web3/dist/web3.min.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CHAINS from '../../../constants/chains'
import COINS from '../../../constants/coins'
import ABI from '../../../constants/abi.json'

export default function Trade() {
    // un-comment this on production
    // useEffect(() => console.log(
    //     '%cIf you are reading this, you may want to work at my company :D Send me an email!',
    //     'font-size: 20px; font-weight: bold;'
    // ), [])

    const [right, setRight] = useState(0)
    const [cardType, setCardType] = useState('None')
    const [cardValue, setCardValue] = useState('None')
    const [cryptoType, setCryptoType] = useState('None')
    const [cardCode, setCardCode] = useState('None')
    const [modalIsOpen, setModalIsOpen] = useState(true)
    const [modalHasOpened, setModalHasOpened] = useState(false)

    const [mainWalletAddress, setMainWalletAddress] = useState('None')
    const [chainId, setChainId] = useState(0)
    const mainPage = useMemo(() =>
        `${window.location.protocol}//${window.location.hostname}:${process.env.NODE_ENV==='development' ? '2000' : window.location.port}`
    , [])

    const [serverResponse, setServerResponse] = useState({})
    const updateServerResponse = () => {
        fetch(mainPage+'/getAvailable')
            .then(response => response.json())
            .then(setServerResponse)
            .catch(toast.error)
    }
    useEffect(() => {
        Modal.setAppElement('body');
        updateServerResponse()
        setInterval(updateServerResponse, 10000)
    }, [])

    const cardOptions = useMemo(() => Object.keys(serverResponse), [serverResponse])
    const valueOptions = useMemo(() => {
        for (const [serverCardType, cardValues] of Object.entries(serverResponse)) {
            if (cardType === serverCardType) {
                setCardValue(cardValues[0].toString())
                return cardValues
            }
        }
    }, [cardType])


    const [cryptoTypeOptions, setCryptoTypeOptions] = useState([])
    const updateCryptoTypeOptions = async (mainWalletAddress, chainId) => {
        setCryptoTypeOptions(await Promise.all(
            Object.entries(COINS[chainId]).map(async ([symbol, address]) => {
                const contract = new web3.eth.Contract(ABI, address)
                const balance = await contract.methods.balanceOf(mainWalletAddress).call()
                return (parseInt(balance)>0 ? '✔' : '✘') + symbol
            })
        ))
    }

    const provider = useMemo(() => window.ethereum, [])
    const web3 = useMemo(() => new Web3(provider), [provider])

    const reelStyle = useMemo(() => ({ right: right + 'vw' }), [right])

    const moveLeft = () => setRight(Math.max(right - 80, 0))
    const moveRight = () => setRight(Math.min(right + 80, 80 * 2))

    const connectMetaMask = () => {
        if (typeof provider === 'undefined') {
            return toast.error('Please install a web3 provider!')
        }
        provider.request({ method: 'eth_requestAccounts' }).then((accounts) => {
            provider.request({ method: 'eth_chainId' }).then((chainId) => {
                chainId*=1 // convert to string
                if (chainId in CHAINS) {
                    setChainId(chainId)
                    setMainWalletAddress(accounts[0])
                    updateCryptoTypeOptions(accounts[0], chainId)
                } else {
                    toast.error('Please connect to a supported network!')
                }
            })
        })
    }

    const updateCardType = e => {
        setCardType(e.target.value)
    }

    const updateValue = e => setCardValue(e.target.value)

    const updateCryptoType = e => setCryptoType(e.target.value)

    const sendTransaction = () => {
        if (cryptoType.startsWith('✘')) return toast.error('Please select a crypto in your wallet!')
        const contract = new web3.eth.Contract(ABI, COINS[chainId][cryptoType.substring(1)])

        const sendCoins = contract.methods.transfer(
            '0x0367De624725fAfCA0e9953492ce8A0a7C0A05D9',
            web3.utils.toWei(
                cardValue.startsWith('$') ? cardValue.substring(1) : cardValue,
                chainId===56 ? 'ether' : 'lovelace')
            )
        .send({
            'from': mainWalletAddress,
            'value': 0,
            'gas': 250000,
            'gasPrice': web3.utils.toWei('6', 'gwei'),
        }).then(txn => {
            getCardCode(txn['transactionHash'])
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

    const getCardCode = transactionHash => {
        fetch(mainPage+'/transaction?'+ new URLSearchParams({
            chainId,
            cardType,
            transactionHash
        }))
        .then(response => response.json())
        .then(data => {
            if (typeof data === 'string') {
                setCardCode(data)
            } else {
                toast.error(data.error)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }

    const modalClick = () => {
        navigator.clipboard.writeText(cardCode)
        toast.success("Copied code to clipboard!")
    }

    provider?.on('chainChanged', () => window.location.reload())

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
                                    Allows for us to make transactions
                                </Text>
                            </div>
                            <Button callback={connectMetaMask}>
                            {/* <Button callback={getGiftCard}> */}
                                Connect to MetaMask🦊
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
                                    options={cardOptions || []}
                                    callback={updateCardType}
                                >
                                    Card Type
                                </Selector>
                                <Selector
                                    options={valueOptions?.map(value => '$'+value) || []}
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
                                    cardValue !== 'None' &&
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
                                    Get gift card
                                </Heading>
                                <Text className={styles.description}>
                                    Send the coins to our wallet and receive your giftcard
                                </Text>
                            </div>
                            {modalHasOpened === true ? null :
                                <Button callback={sendTransaction}>
                                    Send Transaction
                                </Button>
                            }
                            {cardCode === 'None' ? null :
                                <Button callback={() => setModalIsOpen(true)}>
                                    Reopen card popup
                                </Button>
                            }
                            <Modal
                                isOpen={cardCode !== 'None' && modalIsOpen}
                                onAfterOpen={() => setModalHasOpened(true)}
                                onRequestClose={() => setModalIsOpen(false)}
                                contentLabel="Card Code Modal"
                                style={{
                                    content: {
                                        top: '50%',
                                        left: '50%',
                                        right: 'auto',
                                        bottom: 'auto',
                                        marginRight: '-50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '1.3rem',
                                        backgroundColor: 'black',
                                        color: 'white',
                                        borderRadius: '0.5rem',

                                    }
                                }}
                            >
                                Card Code: <div className={styles.rainbowText} onClick={modalClick}>
                                    {cardCode}
                                </div>
                            </Modal>
                            {/* <div className={styles.status}>
                                Your gift card: {cardCode ?? 'no card'}
                            </div> */}
                            <Arrows {...{ moveLeft, moveRight }}
                            />
                        </div>
                    </div>
                    <ToastContainer
                        position='top-right'
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable={false}
                        pauseOnHover
                        theme='colored'
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
            <div className={criteria ? styles.arrowOn : styles.arrow} onClick={moveRightWithCriteria}>
                {'continue →'}
            </div>
        </div>
    )
}