
import { Identity } from "@semaphore-protocol/identity";



const generateIdentityCommitment = () => {
    let identity;
    if (localStorage.getItem('iden') !== '' && localStorage.getItem('iden') !== null) {
        identity = new Identity(localStorage.getItem('iden'));
    } else {
        identity = new Identity()
        localStorage.setItem("iden", identity.toString())
    }
    console.log("identity", identity)
    return identity.getCommitment().toString();
}

const getNullifierHash = () => {
    let identity;
    if (localStorage.getItem('iden') !== '') {
        identity = new Identity(localStorage.getItem('iden'));
    } else {
        identity = new Identity()
        localStorage.setItem("iden", identity.toString())
    }
    console.log("identity", identity)
    return identity.getNullifier().toString();
}

export {
    generateIdentityCommitment,
    getNullifierHash
}