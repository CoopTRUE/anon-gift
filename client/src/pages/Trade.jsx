import React, { useState, useMemo, useEffect, useCallback } from 'react'
import styles from './Trade.module.css'

import Heading from '../components/Heading'
import Text from '../components/Text'
import Button from '../components/Button'
import Selector from '../components/Selector'
import Modal from 'react-modal'

import Web3 from 'web3/dist/web3.min.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CHAINS from './../constants/chains'
import COINS from './../constants/coins'
import ABI from './../constants/abi.json'
import SERVER_WALLET from './../constants/serverwallet'
import { addFee } from './../constants/fee'

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
        provider?.on('chainChanged', () => window.location.reload())
    }, [])

    const cardOptions = useMemo(() => Object.keys(serverResponse), [serverResponse])
    const valueOptions = useMemo(() => {
        for (const [serverCardType, cardValues] of Object.entries(serverResponse)) {
            if (cardType === serverCardType) {
                setCardValue(cardValues[0])
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
    const web3 = useMemo(() => new Web3(provider, { transactionBlockTimeout: 9999 }), [provider])

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

    const updateCardType = cardType => {
        setCardType(cardType)
        setCardValue('None')
    }

    const updateCardValue = cardValue => {
        if (cardValue !== 'None') {
            cardValue = parseInt(cardValue.substring(1))
        }
        setCardValue(cardValue)
    }

    const updateCryptoType = cryptoType => {
        if (cryptoType === 'None') {
            setCryptoType(cryptoType)
        }
        else if (cryptoType.startsWith('✔')) {
            setCryptoType(cryptoType.substring(1))
        } else {
            setCryptoType("NOT AVAILABLE")
        }
    }

    const sendTransaction = async() => {
        const contract = new web3.eth.Contract(ABI, COINS[chainId][cryptoType])

        const sendCoins = contract.methods.transfer(
            SERVER_WALLET,
            web3.utils.toWei(
                addFee(cardValue).toString(),
                CHAINS[chainId][2]
            )
        )
        toast.promise(
            sendCoins.send({
                from: mainWalletAddress,
                value: 0,
                // gasLimit: (await web3.eth.getBlock("latest").gasLimit)*2,
                // gas: await sendCoins.estimateGas({ from: mainWalletAddress })*2,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
            }).then(txn => {
                getCardCode(txn['transactionHash'])
            }),
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
                                {...{ moveRight }}
                                requirements={[ [mainWalletAddress!=='None', "Please connect to MetaMask!"] ]}
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
                                    options={valueOptions?.map(value => `$${value} (${addFee(value)})`) || []}
                                    callback={updateCardValue}
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
                            <Text className={styles.feeText}>
                                Fee is 7% + 1
                            </Text>
                            <Arrows
                                {...{ moveLeft, moveRight }}
                                requirements={[
                                    [cardType !== 'None',  'Please select a card type!'],
                                    [cardValue !== 'None', 'Please select a value!'],
                                    [cryptoType !== 'None', 'Please select a crypto type!'],
                                    [cryptoType !== 'NOT AVAILABLE', 'Please select a crypto in your wallet!']
                                ]}
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
                                    Send the coins to our wallet and receive your gift card
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
                                        fontSize: '2rem',
                                        backgroundColor: 'black',
                                        color: 'white',
                                        borderRadius: '0.5rem',
                                        textAlign: 'center',
                                        padding: '0 3rem 0 3rem',
                                    }
                                }}
                            >
                                Card Code:
                                <div className={styles.modalFooter}>Click to copy!</div>
                                <div className={styles.rainbowText} onClick={modalClick}>
                                    {cardCode}
                                </div>
                            </Modal>
                            {/* <div className={styles.status}>
                                Your gift card: {cardCode ?? 'no card'}
                            </div> */}
                            <Arrows
                                {...{ moveLeft}}
                                requirements={[]}
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

function Arrows({ moveLeft, moveRight, requirements}) {
    const requirementsMet = useCallback((enableToast=false) => {
        return requirements.every(([condition, message]) =>
            condition || !(!enableToast || toast.error(message))
        )
    }, [requirements])

    const moveRightWithRequirements = () => {
        if (requirementsMet(true)) {
            moveRight()
        }
    }

    return (
        <div className={styles.arrowContainer}>
            {moveLeft !== undefined ?
                <div className={styles.arrow} onClick={moveLeft}>
                    {'← go back'}
                </div>
            : null}
            {moveRight !== undefined ?
                <div className={requirementsMet() ? styles.arrowOn : styles.arrow} onClick={moveRightWithRequirements}>
                    {'continue →'}
                </div>
            : null}
        </div>
    )
}