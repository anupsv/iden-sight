import { useDispatch } from 'react-redux'
import { setHasRegistered } from '../store/home.slice';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { generateIdentityCommitment } from '../web3/semaphore';
import styles from './Register.module.css';
import votingImage from '../assets/voting.svg';
import { parse } from 'parse-usdl'
import CreateProcessPageStyles from './CreateProcessPage.module.css';


const Register = (props) => {
    const dispatch = useDispatch()
    const [identityCommitment, setIdentityCommitment] = useState(null);
    const [connectWallet, setConnectWallet] = useState('');
    const [status, setStatus] = useState('');
    const [pending, setPending] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    const handleGroupSetup = async () => {
        // groups
        // 0: generic registration
        // 1: male
        // 2: female
        // 3: non-binary
        // 4: age >=18 <25
        // 5: age >=25 <35
        // 6: age >=35 <45
        // 7: age >= 45 <60
        // 8: age >= 60
    }

    const handleRegisterClick = async (type) => {

        const {ethereum} = window;
        if(!ethereum){
            console.log("Install metamask");
            return;
        }
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if (accounts.length === 0) {
            setConnectWallet('You need to connect wallet');
        }

        setPending(true);

        const person = {
            age: 25,
            sex: "male"
        }

        console.log("identityCommitment", identityCommitment);
        setStatus("Please wait while we figure you out :D ....")
        await new Promise(r => setTimeout(r, 1000));

        // checking if member already registered.
        if (props.groups[0].indexOf(identityCommitment) === -1){
            await new Promise(r => setTimeout(r, 2000));
            props.groups[0].addMember(identityCommitment);

            switch (true) {
                case person.sex === "male":
                    props.groups[1].addMember(identityCommitment);
                    break;
                case person.sex === "female":
                    props.groups[2].addMember(identityCommitment);
                    break;
                case person.sex === "non-binary":
                    props.groups[3].addMember(identityCommitment);
                    break;
                default:
                    console.log(`${person.sex} couldn't be mapped to any of the options.`)
            }

            switch (true) {
                case person.age >= 18 && person.age < 25:
                    props.groups[4].addMember(identityCommitment);
                    break;
                case person.age >= 25 && person.age < 35:
                    props.groups[5].addMember(identityCommitment);
                    break;
                case person.age >= 35 && person.age < 45:
                    props.groups[6].addMember(identityCommitment);
                    break;
                case person.age >= 45 && person.age < 60:
                    props.groups[7].addMember(identityCommitment);
                    break;
                case person.age >= 60:
                    props.groups[8].addMember(identityCommitment);
                    break;
                default:
                    console.log(`${person.age} couldn't be mapped to any of the options.`)
            }
        }
        else{
            setStatus("User already registered..")
        }

        setStatus("Logging you in ....")
        await new Promise(r => setTimeout(r, 1000));

        // console.log(txForAge);
        dispatch(setHasRegistered(true));
    }

    useEffect(() => {
        setIdentityCommitment(generateIdentityCommitment());
    }, []);

    const parseDlFile = async(e) => {
        setStatus(`Now parsing file ${e.target.files[0].name}. Please wait while we fetch the information.`)
        setShowUpload(false);
        setPending(true);
        await new Promise(r => setTimeout(r, 5000));
        const code =
            `@

ANSI 636014090102DL00410287ZC03280024DLDAQY8970643
DCSSWAMYVEENA
DDEN
DACANUP
DDFN
DADNONE
DDGN
DCACM1
DCB01
DCDNONE
DBD03172022
DBB04091991
DBA04092026
DBC1
DAU067 IN
DAYBLK
DAG16045 CAMINITO TOMAS
DAISAN DIEGO
DAJCA
DAK921280000  
DCF03/17/202267621/BBFD/26
DCGUSA
DAW205
DAZBLK
DCK22076Y89706430401
DDAF
DDB08292017
DDD1
`
        const data = parse(code)
        console.log(JSON.stringify(data, null, 2))
        setStatus(`Hello ${data["firstName"]}, we fetched you're data including, age, sex and zipcode.`);
        await new Promise(r => setTimeout(r, 3000));
        await handleRegisterClick();
    }

    return ( 
        <div className={styles.Register}>
            <div style={{margin: "0 auto", justifyContent: "center", textAlign:"center"}}>
                <div className={styles.title}>
                    Welcome to IDEN-SIGHT
                </div>
                <div className={styles.subtitle}>
                    decentralized anonymous voting app with voter metrics
                </div>
                <div>
                    <img width="500px;" src={votingImage} alt="wrong path"/>
                </div>
                <div style={{marginBottom: "4em", marginTop: "2em"}}>
                    <h3 style={{color: "#f1356d"}}>
                        <Link style={{color: "#f1356d", margin: "0"}} to="/howItWorks">
                            How it works?
                        </Link>
                    </h3>
                </div>
                <div style={{marginBottom: "2em"}}>
                    <h2 style={{fontStyle:"italic", color: "gray", marginBottom: "0.5em"}}>Start Voting</h2>
                    <h2 style={{color: "red", marginTop: "1em"}}>{status}</h2>
                    {showUpload && <form className={CreateProcessPageStyles.create}>
                        <div>
                            <label>Upload Driver License:</label>
                            <input
                                type="file"
                                onChange={(e) => parseDlFile(e)}
                            />
                        </div>
                    </form>}
                    {!pending && !showUpload && <button onClick={(e) => setShowUpload(true)} className="baseButton">Register</button>}
                    {!pending && !showUpload && <button onClick={() => handleRegisterClick("login")} className="baseButton">Login</button>}
                    {/*<button onClick={handleGroupSetup} className="baseButton">Group Setup</button>*/}
                    <h2 style={{color: "red", marginTop: "1em"}}>{connectWallet}</h2>
                </div>
                {pending && <div style={{marginTop: "2em", marginBottom: "2em"}}>
                    <Spinner animation="border" />
                </div>}
            </div>
        </div>
    );
}
 
export default Register