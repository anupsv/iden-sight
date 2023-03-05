import { useState } from 'react';
import { useEffect } from 'react';
import VotingProcess from './VotingProcess';

import {getAllProposals} from '../web3/contracts';

import { useDispatch, useSelector } from 'react-redux'
import { selectHasRegistered, selectTestState, setTestState } from '../store/home.slice';

const Home = (props) => {
    const [proposals, setProposals] = useState([]);
    const hasRegistered = useSelector(selectHasRegistered);

    useEffect(() => {
        getAllProposals().then(
            res => {
                setProposals(res.slice(0, 5));
            }
        );
    }, [])

    const renderProcesses = () => {
        let retVal;
        if(hasRegistered){
            retVal = <div>
                    {proposals.map( (votingProcess, i) => (
                        <VotingProcess className="VotingProcess" key={i} votingProcess = {votingProcess} groupArray={props.groups} group={i+10} />
                    ))}
                </div>
        }else{
            retVal = <div style={{margin: "0 auto", justifyContent: "center", textAlign:"center"}}>
                <h1>Please Register</h1>
            </div>
        }
        return retVal
    } 

    return (  
        <div className="home">
            {renderProcesses()}
        </div>
    );

}
 
export default Home;