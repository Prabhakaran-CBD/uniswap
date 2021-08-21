const web3 = require('./getContractInstance').web3
const getContract = require('./getContractInstance').getContractInstance

const UniswapAddLiquidity = async (deadLine) => {
  const instance = await getContract()
  const accounts = await web3.eth.getAccounts()
  const BN = await web3.utils.BN

  try {
    await instance.methods
      .addLiquidity(
        '0xb123C71C07891043082De575a4062D81574d1cd9', //WAP contract address
        new BN('5000000000000000000').toString(),
        new BN('5000000000000000000').toString(),
        new BN('100000000000000000').toString(),
        '', //owner address
        deadLine,
      )
      .send({
        from: accounts[0],
        value: web3.utils.toWei('1', 'ether'),
        gas: 1000000,
      })
  } catch (err) {
    console.log('Error Message-', err.message)
  }
}

const swapTokenForEth = async (deadLine) => {
  const instance = await getContract()
  const accounts = await web3.eth.getAccounts()
  const BN = await web3.utils.BN

  try {
    await instance.methods
      .swapTokenForEth(
        new BN('500000000000000000').toString(), //change the value accordingly based on testing
        new BN('10000000000000000').toString(), //change the value accordingly based on testing
        deadLine, //change the value accordingly based on testing
      )
      .send({ from: accounts[0], gas: 1000000 })
  } catch (err) {
    console.log('Error Message-', err.message)
  }
}

const getEstimatedTokenforETH = async (amountIn) => {
  const instance = await getContract()
  //const accounts = await web3.eth.getAccounts()

  try {
    const tokenAmt = await instance.methods
      .getEstimatedTokenforETH(
        amountIn, //change the value accordingly based on testing
      )
      .call()
    console.log('Token Amount -', tokenAmt)
  } catch (err) {
    console.log('Error Message-', err.message)
  }
}

//const BN = web3.utils.BN
//UniswapAddLiquidity(1629280400)
//swapTokenForEth(1629280700)
//getEstimatedTokenforETH(1000)
