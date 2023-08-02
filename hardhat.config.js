/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const {PRIVATE_KEY} = process.env;


module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.1"
            },
            {
                version: "0.8.0"
            },
            {
                version: "0.5.16"
            },
            {
                version: "0.4.17"
            },
            {
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            }
        ]
    },
    defaultNetwork: "sepolia",
    networks: {
        hardhat: {},
        matic: {
            url: "https://polygon-mainnet.g.alchemy.com/v2/5erzRBZJq6jgkXdWxOsi8S6sfeiJMdDe",
            accounts: [`0x${PRIVATE_KEY}`]
        },
        mumbai: {
            url: "",
            accounts: [`0x${PRIVATE_KEY}`]
        },
        mainnet: {
            url: process.env.ETHEREUEM_RPC,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        goerli: {
            url: process.env.GOERLI_RPC,
            accounts: [`0x${PRIVATE_KEY}`]
            // gas: 2100000
        }
    }
}