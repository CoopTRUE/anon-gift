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
                        What are we?
                    </Heading>
                    <Text className={styles.aboutText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                    </Text>
                </div>
                <div className={styles.innerAboutContainer}>
                    <Heading className={styles.aboutHeading}>
                        How does it work?
                    </Heading>
                    <Text className={styles.aboutText}>
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Neque porro
                        quisquam est, qui dolorem ipsum quia dolor sit amet,
                        consectetur, adipisci velit, sed quia non numquam eius
                    </Text>
                </div>
            </div>
        </>
    )
}
