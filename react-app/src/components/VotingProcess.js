import styles from './VotingProcess.module.css'
import { Link } from 'react-router-dom';
import {generateIdentityCommitment} from "../web3/semaphore";
import {useEffect, useState} from "react";

const VotingProcess = (props) => {
    const process = props.votingProcess;
    const groupArray = props.groupArray;
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        let identity = generateIdentityCommitment();
        console.log("identityidentity",identity)
        if(groupArray[props.group].indexOf(identity) !== -1){
            setAlreadyRegistered(true)
        }
        setLoading(false);
    }, [groupArray, props.group])

    const handleRegisterClick = async () => {
        let identity = generateIdentityCommitment();
        groupArray[props.group].addMember(identity);
        setAlreadyRegistered(true);
    }

    return (
        <div className={styles.votingProcess}>
            <div className={styles.votingChild}>
                <div style={{textAlign: "left"}}>
                    <h2 className={styles.title}>
                        {process.name === "yessyessyessyessyessyess" ?
                            "Thoughts on the new city ordinance" :
                            (process.name === "TestTestTestTest" ? "HOA installing new plastic fences": process.name)}
                    </h2>
                </div>
                <div style={{textAlign: "left", position: "relative", left: "1em"}}>
                    <p style={{"width": "465px"}}>{process.description === "yessyessyessyessyessyessyess" ?
                        "Please provide thoughts on the new city ordinance for more stop signs" :
                        (process.description === "TestTestTestTestTestTest" ? "Would you approve the HOA's plan?": process.description)}</p>
                </div>
            </div>
            <div className={styles.votingChild}
                style={{display: "flex", alignItems: "center", justifyContent: "center"}}
            >
                {loading ? "Please wait ...." : <>
                {alreadyRegistered ? <Link to={`/voting/${process.id}/${props.group}`} className={styles.votingButton}>Vote</Link> :
                    <button onClick={handleRegisterClick} className="baseButton">Register/Login</button>}

                </>}

            </div>
        </div>
    );
}
 
export default VotingProcess
;