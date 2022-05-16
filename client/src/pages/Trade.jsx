import React, { useState, useMemo } from 'react'
import styles from './Trade.module.css'

import Heading from '../components/Heading'
import Text from '../components/Text'
import Button from '../components/Button'
import Selector from '../components/Selector'

export default function Trade() {
    const [right, setRight] = useState(0)
    const [metaMask, setMetaMask] = useState(null)
    const [cardType, setCardType] = useState('None')
    const [value, setValue] = useState('None')
    const [cryptoType, setCryptoType] = useState('None')
    const [card, setCard] = useState(null)

    const reelStyle = useMemo(() => ({ right: right + 'vw' }), [right])

    const moveLeft = () => setRight(Math.max(right - 80, 0))

    const moveRight = () => setRight(Math.min(right + 80, 80 * 2))

    const connectMetaMask = () => {
        // TODO actually connect to MetaMask
        console.log('woooo')
        setMetaMask('bruh')
    }

    const updateCardType = e => setCardType(e.target.value)

    const updateValue = e => setValue(e.target.value)

    const updateCryptoType = e => setCryptoType(e.target.value)

    const sendTransaction = () => {
        // TODO actually send transaction
        console.log('cock')
        setCard('aiwjmfkoaemjnfuaweijfkoawejf')
    }

    // TODO fill in the card options
    const cardTypeOptions = ['Visa Credit Card', 'Amazon', 'Target']

    // TODO fill in value options
    const valueOptions = ['$5', '$10', '$25', '$50', '$100']

    // TODO fill in crypto type options
    const cryptoTypeOptions = ['BUSD', 'BTC', 'ETH']

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
                                Connect to MetaMask
                            </Button>
                            <div className={styles.status}>
                                Status: {(metaMask ? '' : 'not ') + 'connected'}
                            </div>
                            <Arrows
                                {...{ moveLeft, moveRight }}
                                criteria={metaMask}
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
                                    options={cardTypeOptions}
                                    callback={updateCardType}
                                >
                                    Card Type
                                </Selector>
                                <Selector
                                    options={valueOptions}
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
                                    Complete Transaction
                                </Heading>
                                <Text className={styles.description}>
                                    You're almost done
                                </Text>
                            </div>
                            <Button callback={sendTransaction}>
                                Send Transaction
                            </Button>
                            <div className={styles.status}>
                                Your gift card: {card ?? 'no card'}
                            </div>
                            <Arrows {...{ moveLeft, moveRight }} />
                        </div>
                    </div>
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
