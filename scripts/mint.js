require('dotenv').config();
const {ethers} = require("ethers");
const {abi: contractABI} = require("../artifacts/contracts/MindMintNft.sol/MindMintNft.json");
const {abi: tokenABI} = require("../artifacts/contracts/ERC20Token.sol/ERC20Token.json");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);

    const managerWallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

    const contractAddress = process.env.NFT_CONTRACT_SEPOLIA;
    const contract = new ethers.Contract(contractAddress, contractABI, managerWallet);
    const tokenContract = new ethers.Contract(process.env.ERC20_CONTRACT_SEPOLIA, tokenABI, managerWallet);

    const approved = await tokenContract.approve(contractAddress, ethers.utils.parseEther('10000'));
    await approved.wait();

    console.log("Approved");

    const category = 0;
    const tokenId = 100;

    const tx = await contract.mint(category, tokenId , {gasLimit: 500000});
    await tx.wait();

    console.log("Done")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
