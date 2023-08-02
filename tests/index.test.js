require('dotenv').config();
const { ethers } = require("ethers");
const contractABI = require("../artifacts/contracts/MindMintNft.sol/MindMintNft.json").abi;

describe("MindMintNft", () => {
    let provider;
    let managerWallet;
    let userWallet;
    let contract;

    beforeAll(async () => {

        provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);
        managerWallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

        // userWallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = process.env.NFT_CONTRACT_SEPOLIA;
        contract = new ethers.Contract(contractAddress, contractABI, managerWallet);
    });

    describe("mint", () => {
        it("should mint a new NFT", async () => {
            const category = 0;
            const tokenId = 1;

            const tx = await contract.mint(category, tokenId , {gasLimit: 50000});
            await tx.wait();

            const balance = await contract.balanceOf(managerWallet.address, tokenId);
            expect(balance.toNumber()).toBe(1);
        } , 50000);

        /*it("should enforce maximum supply per category", async () => {
            // Increase the category count to the maximum
            const category = 0;
            const maxCount = await contract.getCategoryMaxCount(category);
            for (let i = 0; i < maxCount; i++) {
                const tokenId = i + 1;
                await contract.mint(category, tokenId);
            }

            // Attempt to mint another NFT in the same category
            const tokenId = maxCount + 1;
            await expect(contract.mint(category, tokenId)).rejects.toThrow(
                "Category supply exceeded"
            );
        });

        it("should enforce maximum supply", async () => {
            // Increase the token count to the maximum
            const maxSupply = await contract.MAX_SUPPLY();
            for (let i = 0; i < maxSupply; i++) {
                const category = i % contract.CATEGORY_COUNT();
                const tokenId = i + 1;
                await contract.mint(category, tokenId);
            }

            // Attempt to mint another NFT
            const category = 0;
            const tokenId = maxSupply + 1;
            await expect(contract.mint(category, tokenId)).rejects.toThrow(
                "Maximum supply exceeded"
            );
        });

        it('should set the category price', async () => {
            // Choose the category and desired price to set
            const category = 0; // Choose the category to test
            const price = ethers.utils.parseEther('1'); // Choose the desired price (in Ether)

            await contract.setCategoryPrice(category, price);

            // Verify the updated category price
            const actualPrice = await contract.getCategoryPrice(category);
            expect(actualPrice).toEqual(price);
        });*/

    });

  /*  describe("setFeeRecipient", () => {
        it("should set the fee recipient", async () => {
            const index = 0;
            const recipient = "";
            const feePercent = 5;

            await contract.setFeeRecipient(index, recipient, feePercent);

            // await contract.setFeeRecipient(index, recipient, feePercent);

            const [actualRecipient, actualFeePercent] = await contract.getFeeRecipient(index);
            expect(actualRecipient).toBe(recipient);
            expect(actualFeePercent.toNumber()).toBe(feePercent);
        });

        it("should revert if index is invalid", async () => {
            const invalidIndex = 10;
            const recipient = ethers.constants.AddressZero;
            const feePercent = 5;

            await expect(
                contract.setFeeRecipient(invalidIndex, recipient, feePercent)
            ).rejects.toThrow("Invalid index");
        });
    });

    describe("withdrawERC20", () => {
        it("should allow manager to withdraw ERC20 tokens", async () => {
            const recipient = signers[1].address;
            const amount = ethers.utils.parseEther("100");

            // Manager withdraws ERC20 tokens
            await contract.withdrawERC20(recipient, amount);

            // Check recipient's balance
            const recipientBalance = await erc20Token.balanceOf(recipient);
            expect(recipientBalance).to.equal(amount);
        });

        it("should revert if non-manager attempts to withdraw", async () => {
            const nonManager = signers[1];
            const recipient = signers[2].address;
            const amount = ethers.utils.parseEther("100");

            // Non-manager attempts to withdraw ERC20 tokens
            await expect(
                mindMintNft.connect(nonManager).withdrawERC20(recipient, amount)
            ).rejects.toThrow("Only manager can withdraw");
        });

        it("should revert if amount is zero", async () => {
            const manager = signers[0];
            const recipient = signers[1].address;
            const zeroAmount = ethers.constants.Zero;

            // Manager attempts to withdraw zero amount of ERC20 tokens
            await expect(
                mindMintNft.connect(manager).withdrawERC20(recipient, zeroAmount)
            ).rejects.toThrow("Amount must be greater than zero");
        });
    });
*/
});

