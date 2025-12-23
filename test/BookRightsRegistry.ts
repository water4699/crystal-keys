import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { BookRightsRegistry, BookRightsRegistry__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  publisher: HardhatEthersSigner;
  distributor: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory(
    "BookRightsRegistry"
  )) as BookRightsRegistry__factory;
  const contract = (await factory.deploy()) as BookRightsRegistry;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("BookRightsRegistry", function () {
  let signers: Signers;
  let contract: BookRightsRegistry;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      publisher: ethSigners[1],
      distributor: ethSigners[2],
    };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  it("should deploy with zero books", async function () {
    const totalBooks = await contract.getTotalBooks();
    expect(totalBooks).to.eq(0);
  });

  it("should register a new book with encrypted licensing terms", async function () {
    const title = "Digital Publishing in the Blockchain Era";
    const author = "Sarah Chen";
    const publisher = "TechPress Publishing";
    const genre = "Technology";

    // Pricing tier: 2 = Premium ($9.99)
    const pricingTier = 2;
    // Distribution window: 2 = Exclusive (6 months)
    const distributionWindow = 2;

    // Create encrypted inputs
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.publisher.address)
      .add8(pricingTier)
      .add8(distributionWindow)
      .encrypt();

    // Register book
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

    await tx.wait();

    // Verify book count increased
    const totalBooks = await contract.getTotalBooks();
    expect(totalBooks).to.eq(1);

    // Verify book info
    const bookInfo = await contract.getBookInfo(0);
    expect(bookInfo.title).to.eq(title);
    expect(bookInfo.author).to.eq(author);
    expect(bookInfo.publisher).to.eq(publisher);
    expect(bookInfo.genre).to.eq(genre);
    expect(bookInfo.owner).to.eq(signers.publisher.address);
  });

  it("should decrypt pricing tier for authorized user", async function () {
    const title = "Cryptographic Rights Management";
    const author = "Michael Rodriguez";
    const publisher = "Crypto Books Ltd";
    const genre = "Technology";

    // Pricing tier: 1 = Standard ($4.99)
    const pricingTier = 1;
    // Distribution window: 1 = Limited (3 months)
    const distributionWindow = 1;

    // Create encrypted inputs
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.publisher.address)
      .add8(pricingTier)
      .add8(distributionWindow)
      .encrypt();

    // Register book
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

    await tx.wait();

    // Publisher (owner) should be able to decrypt
    const encryptedPricingTier = await contract.getPricingTier(0);
    const decryptedPricingTier = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedPricingTier,
      contractAddress,
      signers.publisher
    );

    expect(decryptedPricingTier).to.eq(pricingTier);
  });

  it("should grant access to distributor and allow decryption", async function () {
    const title = "The Future of Digital Content";
    const author = "Emily Watson";
    const publisher = "Future Media Corp";
    const genre = "Business";

    // Pricing tier: 0 = Basic ($2.99)
    const pricingTier = 0;
    // Distribution window: 0 = Open (Unlimited)
    const distributionWindow = 0;

    // Create encrypted inputs
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.publisher.address)
      .add8(pricingTier)
      .add8(distributionWindow)
      .encrypt();

    // Register book
    let tx = await contract
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

    await tx.wait();

    // Grant access to distributor
    tx = await contract
      .connect(signers.publisher)
      .grantAccess(0, signers.distributor.address);

    await tx.wait();

    // Distributor should now be able to decrypt
    const encryptedPricingTier = await contract.getPricingTier(0);
    const decryptedPricingTier = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedPricingTier,
      contractAddress,
      signers.distributor
    );

    const encryptedDistWindow = await contract.getDistributionWindow(0);
    const decryptedDistWindow = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedDistWindow,
      contractAddress,
      signers.distributor
    );

    expect(decryptedPricingTier).to.eq(pricingTier);
    expect(decryptedDistWindow).to.eq(distributionWindow);
  });

  it("should revert when non-owner tries to grant access", async function () {
    const title = "Test Book";
    const author = "Test Author";
    const publisher = "Test Publisher";
    const genre = "Test";

    // Create encrypted inputs
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.publisher.address)
      .add8(1)
      .add8(1)
      .encrypt();

    // Register book
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

    await tx.wait();

    // Distributor (non-owner) tries to grant access - should fail
    await expect(
      contract
        .connect(signers.distributor)
        .grantAccess(0, signers.distributor.address)
    ).to.be.revertedWith("Only owner can grant access");
  });

  it("should revert when registering book with empty title", async function () {
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.publisher.address)
      .add8(1)
      .add8(1)
      .encrypt();

    await expect(
      contract
        .connect(signers.publisher)
        .registerBook(
          "",
          "Author",
          "Publisher",
          "Genre",
          encryptedInput.handles[0],
          encryptedInput.inputProof,
          encryptedInput.handles[1],
          encryptedInput.inputProof
        )
    ).to.be.revertedWith("Title cannot be empty");
  });

  it("should check if book exists", async function () {
    // Book 0 should not exist initially
    expect(await contract.bookExists(0)).to.be.false;

    // Register a book
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.publisher.address)
      .add8(1)
      .add8(1)
      .encrypt();

    const tx = await contract
      .connect(signers.publisher)
      .registerBook(
        "Test Book",
        "Test Author",
        "Test Publisher",
        "Test",
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        encryptedInput.handles[1],
        encryptedInput.inputProof
      );

    await tx.wait();

    // Book 0 should now exist
    expect(await contract.bookExists(0)).to.be.true;
  });

  it("should register multiple books and track count correctly", async function () {
    const books = [
      {
        title: "Book One",
        author: "Author One",
        publisher: "Publisher One",
        genre: "Fiction",
      },
      {
        title: "Book Two",
        author: "Author Two",
        publisher: "Publisher Two",
        genre: "Non-Fiction",
      },
      {
        title: "Book Three",
        author: "Author Three",
        publisher: "Publisher Three",
        genre: "Science",
      },
    ];

    for (const book of books) {
      const encryptedInput = await fhevm
        .createEncryptedInput(contractAddress, signers.publisher.address)
        .add8(1)
        .add8(1)
        .encrypt();

      const tx = await contract
        .connect(signers.publisher)
        .registerBook(
          book.title,
          book.author,
          book.publisher,
          book.genre,
          encryptedInput.handles[0],
          encryptedInput.inputProof,
          encryptedInput.handles[1],
          encryptedInput.inputProof
        );

      await tx.wait();
    }

    const totalBooks = await contract.getTotalBooks();
    expect(totalBooks).to.eq(books.length);

    // Verify each book
    for (let i = 0; i < books.length; i++) {
      const bookInfo = await contract.getBookInfo(i);
      expect(bookInfo.title).to.eq(books[i].title);
      expect(bookInfo.author).to.eq(books[i].author);
    }
  });
});
