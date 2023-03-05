import styles from './HowItWorks.module.css';

const HowItWorks = () => {
    return (  
        <div className={styles.howItWorks}>
            <h1>How it works?</h1>
            <div>

                Zero-Knowledge proofs (ZKPs) are a cryptographic technique that allows a person to prove that they know a certain piece of information, without actually revealing that information to anyone else. This means that ZKPs can be used to verify identity without having to reveal personal information like names, addresses, or other sensitive data.            </div>
            <div>
                Using ZKPs, it is possible to generate a zero-knowledge identity from official documents like passports and driver's licenses. This means that a person could prove that they are who they say they are without having to share their personal information with anyone else.            </div>
            <div>
                One potential application of this technology is in voting. By using zero-knowledge identities, it is possible to ensure that each person is only able to vote once, without revealing their personal information to anyone else. This can help to improve the accuracy and reliability of voting statistics, since it eliminates the possibility of people voting multiple times or using false identities.
            </div>
            <div>
                Overall, using ZKPs to generate zero-knowledge identities from official documents like passports and driver's licenses has the potential to improve the security and privacy of identity verification, as well as enhance the accuracy and reliability of voting statistics.
            </div>
            <div>
                Identity commitments are downloaded from the merkle tree stored on blockchain.
            </div>
            <div>
                Dapp generates the proof, which checks that user is in the semaphore group
            </div>
            <div>
                (User's identity commitment is in the merkle tree). It also checks if user has already voted
            </div>
            <div>
                (every user can vote only once).
            </div>
            <div>
                After the proof is generated, voting happens. During voting, proof is verified.
            </div>
            <div>
                If Successful votes are updated and shown to the user.
            </div>
            <div className={styles.bigBtn}>
                Happy voting :)
            </div>
        </div>
    );
}
 
export default HowItWorks;