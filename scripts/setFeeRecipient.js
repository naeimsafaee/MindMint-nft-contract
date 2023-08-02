require('dotenv').config();
const {ethers} = require("ethers");
const {abi: contractABI} = require("../artifacts/contracts/MindMintNft.sol/MindMintNft.json");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);

    const managerWallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

    const contractAddress = process.env.NFT_CONTRACT_SEPOLIA;
    const contract = new ethers.Contract(contractAddress, contractABI, managerWallet);

    const index = 0;
    const recipient = "0x9Cb407fc46690bA9a1Ef89d1D525CA47Da553133";
    const feePercent = 5;

    const tx = await contract.setFeeRecipient(index, recipient, feePercent, {gasLimit: 100000});
    await tx.wait();

    const [actualRecipient, actualFeePercent] = await contract.getFeeRecipient(index);

    console.log({actualRecipient, actualFeePercent})

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
