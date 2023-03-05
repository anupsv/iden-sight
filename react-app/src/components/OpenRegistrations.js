import { useState } from 'react';
import { useEffect } from 'react';
import VotingProcess from './VotingProcess';
import {getAllProposals} from '../web3/contracts';

const OpenRegistrations = (props) => {
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        getAllProposals().then(
            res => {
                setProposals(res.slice(0, 5));
            }
        );
    }, [])

    const renderProcesses = () => {
        let retVal;
            retVal = <div>
                    {proposals.map( (votingProcess, i) => (
                        <VotingProcess className="VotingProcess" key={i} votingProcess={votingProcess} groupArray={props.groups} group={i+10} />
                    ))}
                </div>
        return retVal
    } 

    return (  
        <div className="home">
            {renderProcesses()}
        </div>
    );

}
 
export default OpenRegistrations;