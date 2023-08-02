require('dotenv').config();
const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log({balance: balance.toString()})

    console.log("Deploying contracts with the account:", deployer.address);

    const MindMintNft = await ethers.getContractFactory("MindMintNft");
    const erc721 = await MindMintNft.deploy(
        process.env.ERC20_CONTRACT_SEPOLIA,
        "https://api.mindmint.life/nft/",
    );


    console.log("MindMintNft Contract deployed to address:", erc721.address);
}


//king => 5
//queen => 4
//bishop => 3
//knight => 2
//rook => 1
//pawn => 0

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });
