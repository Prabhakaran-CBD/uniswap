var MintToken = artifacts.require('./MintToken.sol')
var uniswapTokenToEth = artifacts.require('./uniswapTokenToEth.sol')

module.exports = async (deployer) => {
  const BN = await web3.utils.BN
  await deployer.deploy(MintToken, new BN('1000000000000000000000').toString())
  await deployer.deploy(uniswapTokenToEth, MintToken.address)
}
