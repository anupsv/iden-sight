import * as ethers from 'ethers'
import { Contract } from 'ethers';
import oneVoteAbi from '@/../../abi/OneVote.json';
import semGroupContractAbi from '@/../../abi/semGroupContract.json';
import votingProcessAbi from '@/../../abi/VotingProcess.json';
import contextMaintainerAbi from '@/../../abi/ContextMaintainer.json';
import semVerifierAbi from '@/../../abi/semVerifierAbi.json';

// const semaphoreAddress = semaphoreNetworks[1666700000].address;
// const oneVoteAddress = oneVoteNetworks[1666700000].address;

const oneVoteAddress = "0xb16c490b55898a88701D5c9254577cd5d8b71025";
const contextMaintainerAddress = "0xe1A26BD89EccB7CbD2D264A5Bc8Bb42BcDf3F3F7";
const semGroupContract = "0x46649Fd842F768C562e6A48692AA6CA1bFAD9D97";
const semVerifierAddress = "0x4B6A512d4F5b9054c0f81Cdd9dC4358BcedF0108";

const randomIntFromInterval = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const deployVotingProcess = async (name, description, proposals) => {
    console.log("ContextMaintainer testnet address: ", contextMaintainerAddress);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const contextMaintainerContract = new Contract(contextMaintainerAddress, contextMaintainerAbi, signer);

    const randomHash = crypto.getRandomValues(new Uint32Array(3)).join('');
    const semGroupContractObj = await getGroupsContract();
    const currentWalletAddress = (await provider.listAccounts())[0];
    console.log(randomHash);
    const result = await contextMaintainerContract.createNewElection(name, description,
        randomHash, proposals)
    await result.wait()
    console.log("Result of create voting process: ", result);
    return result;
}

const getZkVerifierContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const zkVerifierContract = new Contract(semVerifierAddress, semVerifierAbi, signer);
    return zkVerifierContract;
}

const getVotingProcessContract = async (id) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    const votingProcessAddress = await oneVoteContract.votingProcesses(id);
    const votingProcessContract = new Contract(votingProcessAddress, votingProcessAbi, signer);
    console.log("Voting process contract: ", votingProcessContract);
    return votingProcessContract;
}

const getOneVoteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    return oneVoteContract;
}

const getGroupsContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const semGroupContractObj = new Contract(semGroupContract, semGroupContractAbi, signer);
    return semGroupContractObj;
}

const getContextMaintainerContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contextMaintainerAddressObj = new Contract(contextMaintainerAddress, contextMaintainerAbi, signer);
    return contextMaintainerAddressObj;
}

const getAllProposals = async () => {
    let contextMaintainerAddressObj = await getContextMaintainerContract();
    let proposals = [];
    const allProposalIndexes = await contextMaintainerAddressObj.getAllProposalIndexes();
    for (const each in allProposalIndexes){
        const proposal = await contextMaintainerAddressObj.allProposalsData(allProposalIndexes[each]);
        proposals.push(proposal)
    }
    return proposals;
}

const getProposal = async (proposalIndex) => {
    let contextMaintainerAddressObj = await getContextMaintainerContract();
    const proposal = await contextMaintainerAddressObj.getProposalData(proposalIndex);
    return proposal;
}


export {
    deployVotingProcess,
    getProposal,
    getContextMaintainerContract,
    getZkVerifierContract,
    getVotingProcessContract,
    getOneVoteContract,
    getAllProposals,
    getGroupsContract
}