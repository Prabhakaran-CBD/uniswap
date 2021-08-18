//-------------Writing own in the config file-------------
const path = require('path')
// const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider')
//const AccountIndex = 0;
require('dotenv').config({ path: './.env' })

const rinkebyURL = `https://rinkeby.infura.io/v3/${process.env.INFURA_RINKEBY_KEY}`

const ropstenURL = `https://ropsten.infura.io/v3/${process.env.INFURA_ROPSTEN_KEY}`

module.exports = {
  //configuration
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: 5777,
    },

    rinkeby_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONICS, rinkebyURL)
      },
      network_id: 4,
      skipDryRun: true,
    },

    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONICS, ropstenURL)
      },
      network_id: 3,
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: '0.8.4',
    },
  },
}
