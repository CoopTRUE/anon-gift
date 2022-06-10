import styles from './Home.module.css'

import Heading from '../components/Heading'
import Text from '../components/Text'
import Button from '../components/Button'

export default function Home() {
    return (
        <>
            <div className={styles.hero}>
                <div className={styles.innerContainer}>
                    <Heading className={styles.heading}>Anon Gift</Heading>
                    <Text className={styles.subHeading}>
                        anonymous and instant crypto exchange for gift cards
                    </Text>
                    <div className={styles.buttonContainer}>
                        <Button
                            link="/trade"
                            className={styles.button}
                            type="one"
                        >
                            Start Exchange
                        </Button>
                        <Button
                            className={styles.button}
                            link="#about"
                            type="two"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.about} id="about">
                <div className={styles.innerAboutContainer}>
                    <Heading className={styles.aboutHeading}>
                        How does it work?
                    </Heading>
                    <Text className={styles.aboutText}>
                        You send crypto, we send back gift cards. It's as simple as that.
                    </Text>
                </div>
                <div className={styles.innerAboutContainer}>
                    <Heading className={styles.aboutHeading}>
                        Is it legit?
                    </Heading>
                    <Text className={styles.aboutText}>
                        Anon Gift is 100% safe, secure, and anonymous. Our code is open source on github and runs completely autonomously.
                        We do not collect or log any user data.
                    </Text>
                </div>
                <div className={styles.innerAboutContainer}>
                    <Heading className={styles.aboutHeading}>
                        Why use this?
                    </Heading>
                    <Text className={styles.aboutText}>
                        In most crypto exchanges, you are required to provide KYC to even begin trading. This is a pain for most people.
                        Anon Gift is a completely anonymous exchange. You do not need to provide any personal information to use the exchange.
                    </Text>
                </div>
            </div>
        </>
    )
}
