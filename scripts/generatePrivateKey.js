const {ethers} = require("ethers");
require('dotenv').config();


let mnemonicWallet = ethers.Wallet.fromMnemonic(process.env.SEED);
console.log(mnemonicWallet.address)
console.log(mnemonicWallet.privateKey)
