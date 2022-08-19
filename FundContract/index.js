import {ethers} from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect(){
    if(typeof window.ethereum !== "undefined"){
            await window.ethereum.request({method: "eth_requestAccounts"})
            connectButton.innerHTML = "Connected!"
        }
        else{
            connectButton.innerHTML = "Cannot Connecet!"
            }
}

async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with Eth: ${ethAmount}`)
    if(typeof window.ethereum !== "undefined"){
        /*To fund we require: provider, connection to blockchain, signer, wallet, contract(ABI, Address) */
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            await Listener(transactionResponse, provider)
            console.log("Done!")
        }
        catch(error){
            console.log(error)
        }
    }
}

function Listener(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}.....`)
    //Listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
    
}

async function getBalance(){
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw(){
    if(typeof window.ethereum !== "undefined"){
        console.log("Withdrawing.....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.withdraw()
            await Listener(transactionResponse, provider)
        }
        catch(error){
            console.log(error)
        }
    }
}
    