require('dotenv').config();
const ethers = require('ethers');

async function estimateDeploymentCost(contractBytecode, provider) {
    // const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

    const transaction = {
        data: contractBytecode,
        gasLimit: '50000'
    };

    const gasPrice = await provider.getGasPrice();

    console.log(ethers.BigNumber.from(transaction.gasLimit).toString())

    const deploymentCost = ethers.BigNumber.from(transaction.gasLimit).mul(gasPrice);

    return deploymentCost.toString();
}

// Usage example
const contractBytecode = require("../artifacts/contracts/MindMintNft.sol/MindMintNft.json").bytecode;
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUEM_RPC);

estimateDeploymentCost(contractBytecode, provider)
    .then(cost => console.log('Estimated deployment cost:', cost))
    .catch(err => console.error('Error:', err));
