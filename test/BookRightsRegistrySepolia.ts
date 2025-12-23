import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { BookRightsRegistry, BookRightsRegistry__factory } from "../types";
import { expect } from "chai";

type Signers = {
  deployer: HardhatEthersSigner;
  publisher: HardhatEthersSigner;
};

async function getContract() {
  const contractAddress = process.env.BOOK_RIGHTS_REGISTRY_ADDRESS;
  if (!contractAddress) {
    throw new Error("BOOK_RIGHTS_REGISTRY_ADDRESS environment variable not set");
  }

  const factory = (await ethers.getContractFactory(
    "BookRightsRegistry"
  )) as BookRightsRegistry__factory;
  const contract = factory.attach(contractAddress) as BookRightsRegistry;

  return { contract, contractAddress };
}

describe("BookRightsRegistry on Sepolia", function () {
  let signers: Signers;
  let contract: BookRightsRegistry;
  let contractAddress: string;

  before(async function () {
    // Skip if running on mock FHEVM
    if (fhevm.isMock) {
      console.warn(`This test suite is for Sepolia Testnet only`);
      this.skip();
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      publisher: ethSigners[1],
    };

    ({ contract, contractAddress } = await getContract());
  });

  it("should get total books count", async function () {
    const totalBooks = await contract.getTotalBooks();
    console.log(`Total books registered: ${totalBooks}`);
    expect(totalBooks).to.be.gte(0);
  });

  it("should register a new book on Sepolia", async function () {
    this.timeout(120000); // 2 minutes timeout for Sepolia transactions

    const title = "Blockchain Publishing Guide";
    const author = "Alice Developer";
    const publisher = "Web3 Press";
    const genre = "Technology";

    // Pricing tier: 1 = Standard ($4.99)
    const pricingTier = 1;
    // Distribution window: 1 = Limited (3 months)
    const distributionWindow = 1;

    console.log("Creating encrypted inputs...");
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.publisher.address)
      .add8(pricingTier)
      .add8(distributionWindow)
      .encrypt();

    console.log("Registering book on Sepolia...");
    const tx = await contract
      .connect(signers.publisher)
      .registerBook(
        title,
        author,
        publisher,
        genre,
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        encryptedInput.handles[1],
        encryptedInput.inputProof
      );

    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log(`Book registered in block: ${receipt?.blockNumber}`);

    // Get the new book ID (total books - 1)
    const totalBooks = await contract.getTotalBooks();
    const newBookId = totalBooks - 1n;

    // Verify book info
    const bookInfo = await contract.getBookInfo(newBookId);
    expect(bookInfo.title).to.eq(title);
    expect(bookInfo.author).to.eq(author);
    expect(bookInfo.publisher).to.eq(publisher);
    expect(bookInfo.genre).to.eq(genre);
    expect(bookInfo.owner).to.eq(signers.publisher.address);

    console.log(`✓ Book registered successfully with ID: ${newBookId}`);
  });

  it("should retrieve book information", async function () {
    const totalBooks = await contract.getTotalBooks();
    if (totalBooks === 0n) {
      console.log("No books registered yet, skipping test");
      this.skip();
    }

    // Get info for the first book
    const bookInfo = await contract.getBookInfo(0);
    console.log("\nBook #0 Information:");
    console.log(`  Title: ${bookInfo.title}`);
    console.log(`  Author: ${bookInfo.author}`);
    console.log(`  Publisher: ${bookInfo.publisher}`);
    console.log(`  Genre: ${bookInfo.genre}`);
    console.log(`  Owner: ${bookInfo.owner}`);
    console.log(`  Timestamp: ${new Date(Number(bookInfo.timestamp) * 1000).toISOString()}`);

    expect(bookInfo.title).to.not.be.empty;
    expect(bookInfo.author).to.not.be.empty;
  });

  it("should check if books exist", async function () {
    const totalBooks = await contract.getTotalBooks();
    
    if (totalBooks > 0n) {
      const exists = await contract.bookExists(0);
      expect(exists).to.be.true;
      console.log("✓ Book #0 exists");
    }

    // Check a non-existent book
    const nonExistent = await contract.bookExists(999999);
    expect(nonExistent).to.be.false;
    console.log("✓ Book #999999 does not exist");
  });
});
