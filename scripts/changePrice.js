require('dotenv').config();
const {ethers} = require("ethers");
const {abi: contractABI} = require("../artifacts/contracts/MindMintNft.sol/MindMintNft.json");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);

    const managerWallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

    const contractAddress = process.env.NFT_CONTRACT_SEPOLIA;
    const contract = new ethers.Contract(contractAddress, contractABI, managerWallet);

    //king => 5
    //queen => 4
    //bishop => 3
    //knight => 2
    //rook => 1
    //pawn => 0

    // king => 40000
    // queen => 30000
    // bishop => 24000
    // knight => 20000
    // rook => 14000
    // pawn => 10000

    const categoriesPrice = [10000 , 14000 , 20000 , 24000 , 30000 , 40000];

    for (let i = 0; i < categoriesPrice.length; i++) {
        const price = ethers.utils.parseEther(categoriesPrice[i] + "");

        const tx = await contract.setCategoryPrice(i, price);
        await tx.wait();
    }

    for (let i = 0; i < categoriesPrice.length; i++) {
        const actualPrice = await contract.getCategoryPrice(i);
        const price = ethers.utils.formatEther(actualPrice);

        console.log({i , price})
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
