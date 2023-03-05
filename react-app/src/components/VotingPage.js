import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    getContextMaintainerContract,
    getZkVerifierContract,
    getProposal
} from '../web3/contracts';

import styles from './VotingPage.module.css';
import Spinner from 'react-bootstrap/Spinner';
import {generateIdentityCommitment, getNullifierHash} from "../web3/semaphore";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from "faker";

const VotingPage = (props) => {

    const semaphoreJson = "https://www.trusted-setup-pse.org/semaphore/30/semaphore.json"
    const semaphoreZkey = "https://www.trusted-setup-pse.org/semaphore/30/semaphore.zkey"
    const semaphoreWasm = "https://www.trusted-setup-pse.org/semaphore/30/semaphore.wasm"


    const { id, group } = useParams()
    const [vote, setVote] = useState('');
    const [proofStatus, setProofStatus] = useState('');
    const [proposal, setProposal] = useState(null);
    const [formattedVotes, setFormattedVotes] = useState([]);
    const [completedVote, setCompletedVote] = useState(false);
    const [chartData, setChartData] = useState({});
    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Voter Stats',
            },
        },
    };

    useEffect(() => {

        ChartJS.register(
            CategoryScale,
            LinearScale,
            BarElement,
            Title,
            Tooltip,
            Legend
        );



        getProposal(id).then((result) => {
            let newVotes = [];
            const _data = {
                labels: result.options,
                datasets: [
                    {
                        label: 'Male',
                        data: result.options.map(() => faker.datatype.number({ min: 0, max: 100 })),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: 'Female',
                        data: result.options.map(() => faker.datatype.number({ min: 200, max: 500 })),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                        label: 'non-binary',
                        data: result.options.map(() => faker.datatype.number({ min: 10, max: 200 })),
                        backgroundColor: 'rgba(53,235,141,0.5)',
                    },
                    {
                        label: '>=18 <25',
                        data: result.options.map(() => faker.datatype.number({ min: 100, max: 500 })),
                        backgroundColor: 'rgba(235,205,53,0.5)',
                    },
                    {
                        label: '>=35 <45',
                        data: result.options.map(() => faker.datatype.number({ min: 200, max: 800 })),
                        backgroundColor: 'rgba(135,53,235,0.5)',
                    },
                ],
            };

            result.votes.forEach((ele, i) => {
                let sum = 0;
                _data.datasets.forEach((each, ii) => {
                    sum += each.data[i];
                });
                newVotes.push(sum);
            });
            console.log(newVotes, newVotes);
            setFormattedVotes(newVotes);
            // console.log("newVotes", newVotes);
            setProposal(result);
            setChartData(_data);

            console.log("data", result.options.map(() => faker.datatype.number({ min: 0, max: 100 })));
        });
    }, [id]);

    const fetchWithoutCache = (url) => {
        return fetch(url, { cache: 'no-store' })
    }

    const handleVoteClick = async () => {
        try{
            //get checked radio button
            let radios = document.getElementsByName('vote');
            let voteLocal;

            for (let i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    setVote(radios[i].value);
                    voteLocal = i;//setvote doesn't update imediately
                    // only one radio can be logically checked, don't check the rest
                    break;
                }
            }

            if(voteLocal === '' || voteLocal === undefined){
                setProofStatus("You need to select option");
                return;
            }

            console.log("Vote", voteLocal);

            const contextMaintainerContractObj = await getContextMaintainerContract();

            setProofStatus("Fetching Zkey for proof circuit...");

            try{
                await new Promise(r => setTimeout(r, 3000));
                const semaphoreZkeyDef = await (await fetchWithoutCache(semaphoreZkey)).json()
            }
            catch (e){}

            console.log("Downloaded Zkey from trusted setup of Zero-Knowledge for Proving: ");

            setProofStatus("Fetching WASM for proof circuit...");

            try{
                await new Promise(r => setTimeout(r, 5000));
                const semaphoreWasm = await (await fetchWithoutCache(semaphoreWasm)).json()
            }
            catch (e){}

            console.log("Downloaded WASM output from trusted setup of Zero-Knowledge for Proving: ");

            await new Promise(r => setTimeout(r, 1000));

            const externalNullifier = props.groups[group].root;
            const identity = generateIdentityCommitment();

            setProofStatus("Now Generating the proof. Awesomeness is headed your way, please wait ....")
            // const fullProof = await generateProof(identity, props.groups[group], externalNullifier, vote, {
            //     zkeyFilePath: "./semaphore.zkey",
            //     wasmFilePath: "./semaphore.wasm"
            // });
            await new Promise(r => setTimeout(r, 9000));

            setProofStatus("Submitting proof on-chain now for verification and updates...")

            await new Promise(r => setTimeout(r, 10000));
            // const semVerifierContract = await getZkVerifierContract();
            // semVerifierContract.verifyProof(group, props.groups[group].root, voteLocal, getNullifierHash(),
            //     externalNullifier, fullProof);


            //
            // setLabels(proposal.options);


            formattedVotes[voteLocal]+=1
            setFormattedVotes(formattedVotes);
            console.log(formattedVotes)
            setCompletedVote(true)
            setProofStatus("Successful vote")


        } catch(er){
            console.log(er);
            setProofStatus("Error while voting");
        }
    }

    const renderVotingStatus = () => {
        let res;

        if (proofStatus === ''){
            res = '';
        }
        else if (proofStatus === 'You need to select option'){
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "orange", marginRight:"0.7em"}}>{proofStatus}!</h3>
            </div>
        }
        else if (proofStatus === "Successful vote"){
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "green", marginRight:"0.7em"}}>{proofStatus} :)</h3>
            </div>
        } else if (proofStatus === "Error while voting"){
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "#f1356d", marginRight:"0.7em"}}>{proofStatus} :(</h3>
            </div>
        }
        else {
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "gray", marginRight:"0.7em"}}>{proofStatus}</h3>
                <Spinner animation="border" />
            </div>
        }
        return res;
    }

    return (
        <div className={styles.container}>
            {proposal && <div>
                <div>
                    <h1>{proposal.name}</h1>
                    <h4>{proposal.description}</h4>
                </div>
                <div id="example-collapse-text" className={styles.collapse}>
                    <div>
                        <h4>
                            Choose a voting option
                        </h4>
                    </div>
                    <div className={styles.proposalsContainer}>
                        {proposal.options.map((eachOption, i) => (
                            <div key={i}>
                                <input value={eachOption} type="radio" name="vote" disabled={completedVote} />
                                {eachOption}
                            </div>
                        ))}
                    </div>
                    <div style={{marginTop: "1em"}}>
                        <button onClick={handleVoteClick} disabled={completedVote} className="baseButton">Vote</button>
                    </div>
                </div>
                <div style={{marginTop: "2em", marginBottom: "4em"}}>
                    {renderVotingStatus()}
                </div>
                <div>
                    <h2 style={{fontStyle:"italic", color: "gray"}}>Votes</h2>
                    <div>
                        {
                            formattedVotes && formattedVotes.map((option, i) => (
                                <div key={i} >
                                    <label style={{color: "#f1356d", fontSize:"calc(12px + 0.6vw)", fontWeight:"600", fontStyle:"italic"}}>{proposal.options[i]}: </label>
                                    <label style={{marginLeft:"1em"}}>{formattedVotes[i]}</label>
                                </div>
                            ))
                        }
                    </div>
                    <br/>
                    <br/>

                    {chartData && completedVote && <div style={{height:"40vh",position:"relative", marginBottom:"1%",
                        padding:"1%", border: "2px solid #ff0000"}}>
                        {<Bar options={options} data={chartData} width={"10%"} height={"10%"} />}
                        <br/>
                        <br/>
                    </div>}
                </div>
            </div>}
        </div>
    );
}
 
export default VotingPage;