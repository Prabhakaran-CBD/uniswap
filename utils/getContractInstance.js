//Step-1 - Need json file of the smart contract (compiled file)
const contractInstance = require('../client/src/contracts/uniswapTokenToEth.json')

//Step-2 - configure the infura URL and mnemonics to get access to the public network using MetaMask
//Note use dotenv (environment variable) to get/set the mnemonics name
require('dotenv').config({ path: '../.env' })
const mnemonics = process.env.MNEMONICS
const infura_api_key = process.env.INFURA_ROPSTEN_KEY
//ethereum rinkeby public network - get url from infura site by registring your account
const ropstenURL = `https://ropsten.infura.io/v3/${infura_api_key}`

//Step-3
/*---> Note
    To connect with deployed smart contract there are two ways to interact and to do testing before goto main net
    1)public network - rinkeby (testNet)
    2)ganache - a simulated local personal blockchain
    --To connect with public network use @truffle/hdwallet-provider 
    --To connect ganache local blockchain use Web3.providers.HttpProvider 
    --Use web3 a javaScript framework to connect with ethereum network, this framework comes with many features
*/

//for public network/testNet
//---> Commet to test with Ganache (uncomment when want to use this for public network/testNet)
//----> To connect with public netwok
//To connect with public network and interact with deployed smart contract
const getWeb3 = () => {
  const HDWalletProvider = require('@truffle/hdwallet-provider')
  //use your MetaMask account mnemonics and rinkeby url to connect with ethereum network and interact with smart contract
  //This provider will connect with Metamask and access to the deployed smart contract
  const provider = new HDWalletProvider(mnemonics, ropstenURL)
  //framework installed thru npm
  const Web3 = require('web3') //constructor of the web3 framwork (note it should be in uppercase)
  //get the object/instance of that provider
  const web3Provider = new Web3(provider) //here this will creates the connectivity to the deployed smart contract
  return web3Provider
}
//get the web3 for below process to get the contract instance
const web3 = getWeb3()

//Step-4
//-----> smart contract interaction and other related process
//export the main contract instance to get in other modules
const getContractInstance = async () => {
  //get the account this will need to send and sign the transaction
  const accounts = await web3.eth.getAccounts()
  //Note there is networkId conflict between Metamask and local ganache so use below one accordingly to make it work
  const networkId = await web3.eth.net.getId() //this will proivde 5777 works with local ganache
  //const networkId = await web3.eth.getChainId()//not working here since it provide 1337 of ganache (metamask)

  //--> after getting accounts and networkId (you can see this netwrokId in contract json file)
  //get the object/instance of the deployed contract by using the contract byte code abi from json file
  const instance = new web3.eth.Contract(
    contractInstance.abi,
    contractInstance.networks[networkId] &&
      contractInstance.networks[networkId].address, //this will give the contract address without getting this not able to interact with smart contract
  )

  //do console.log to see all values
  //console.log('account -', accounts[0])
  //console.log('networkId -', networkId)
  console.log(
    ' Uniswap Contract Address-',
    contractInstance.networks[networkId].address,
  )
  //console.log('Contract Instance', instance) //this will provide the full objects of the contract

  //export the contract instance
  return instance //get this instance in other module when other module call this module
}

//getContractInstance() // enable for testing
exports.getContractInstance = getContractInstance
exports.web3 = web3
