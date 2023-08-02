require('dotenv').config();
const {ethers} = require("ethers");
const {abi: contractABI} = require("../artifacts/contracts/MindMintNft.sol/MindMintNft.json");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);

    const managerWallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

    const contractAddress = process.env.NFT_CONTRACT_SEPOLIA;
    const contract = new ethers.Contract(contractAddress, contractABI, managerWallet);

    console.log("setting manager with address: " , managerWallet.address)

    const tx = await contract.setManager({gasLimit: 50000});
    await tx.wait();

    const manager = await contract.getManager();
    console.log({manager})
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
