require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");
require("solidity-coverage");

var fs = require('fs');
const home = require('os').homedir();
const keyfile = require('path').join(home, '.bridgekey')
var bridgeKey = fs.readFileSync(keyfile, { encoding: 'utf8' });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.5.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    cheapeth: {
      url: "https://rpc.cheapeth.org/rpc",
      accounts: [bridgeKey],
      gasPrice: 2000000000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
  },
};
