import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:registerBook")
  .addParam("title", "Book title")
  .addParam("author", "Author name")
  .addParam("publisher", "Publisher name")
  .addParam("genre", "Book genre")
  .addParam("pricingtier", "Pricing tier (0=Basic, 1=Standard, 2=Premium)")
  .addParam("distributionwindow", "Distribution window (0=Open, 1=Limited, 2=Exclusive)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, fhevm, deployments } = hre;
    const { title, author, publisher, genre, pricingtier, distributionwindow } = taskArguments;

    const BookRightsRegistry = await deployments.get("BookRightsRegistry");
    const signers = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory("BookRightsRegistry");
    const contract = contractFactory.attach(BookRightsRegistry.address);

    const pricingTierValue = parseInt(pricingtier);
    const distributionWindowValue = parseInt(distributionwindow);

    console.log(`\nRegistering book: "${title}"`);
    console.log(`Author: ${author}`);
    console.log(`Publisher: ${publisher}`);
    console.log(`Genre: ${genre}`);
    console.log(`Pricing Tier: ${pricingTierValue} (${["Basic", "Standard", "Premium"][pricingTierValue]})`);
    console.log(
      `Distribution Window: ${distributionWindowValue} (${["Open", "Limited", "Exclusive"][distributionWindowValue]})`
    );

    // Create encrypted inputs
    const encryptedInput = await fhevm
      .createEncryptedInput(BookRightsRegistry.address, signers[0].address)
      .add8(pricingTierValue)
      .add8(distributionWindowValue)
      .encrypt();

    const tx = await contract.registerBook(
      title,
      author,
      publisher,
      genre,
      encryptedInput.handles[0],
      encryptedInput.inputProof,
      encryptedInput.handles[1],
      encryptedInput.inputProof
    );

    const receipt = await tx.wait();
    console.log(`\n✓ Book registered successfully!`);
    console.log(`Transaction hash: ${receipt?.hash}`);
    console.log(`Block number: ${receipt?.blockNumber}`);

    const totalBooks = await contract.getTotalBooks();
    console.log(`Total books in registry: ${totalBooks}`);
  });

task("task:getBookInfo")
  .addParam("bookid", "Book ID to query")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const { bookid } = taskArguments;

    const BookRightsRegistry = await deployments.get("BookRightsRegistry");
    const contractFactory = await ethers.getContractFactory("BookRightsRegistry");
    const contract = contractFactory.attach(BookRightsRegistry.address);

    const bookId = parseInt(bookid);
    const exists = await contract.bookExists(bookId);

    if (!exists) {
      console.log(`\n❌ Book #${bookId} does not exist`);
      return;
    }

    const bookInfo = await contract.getBookInfo(bookId);
    console.log(`\n📚 Book #${bookId} Information:`);
    console.log(`Title: ${bookInfo.title}`);
    console.log(`Author: ${bookInfo.author}`);
    console.log(`Publisher: ${bookInfo.publisher}`);
    console.log(`Genre: ${bookInfo.genre}`);
    console.log(`Owner: ${bookInfo.owner}`);
    console.log(`Registered: ${new Date(Number(bookInfo.timestamp) * 1000).toISOString()}`);
    console.log(`\nNote: Pricing tier and distribution window are encrypted.`);
    console.log(`Use the frontend to decrypt these values with proper permissions.`);
  });

task("task:getTotalBooks").setAction(async function (taskArguments: TaskArguments, hre) {
  const { ethers, deployments } = hre;

  const BookRightsRegistry = await deployments.get("BookRightsRegistry");
  const contractFactory = await ethers.getContractFactory("BookRightsRegistry");
  const contract = contractFactory.attach(BookRightsRegistry.address);

  const totalBooks = await contract.getTotalBooks();
  console.log(`\n📊 Total books registered: ${totalBooks}`);

  if (totalBooks > 0n) {
    console.log(`\nUse 'npx hardhat task:getBookInfo --bookid <ID>' to view book details`);
  }
});

task("task:grantAccess")
  .addParam("bookid", "Book ID")
  .addParam("accessor", "Address to grant access to")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const { bookid, accessor } = taskArguments;

    const BookRightsRegistry = await deployments.get("BookRightsRegistry");
    const contractFactory = await ethers.getContractFactory("BookRightsRegistry");
    const contract = contractFactory.attach(BookRightsRegistry.address);

    const bookId = parseInt(bookid);
    console.log(`\nGranting access to book #${bookId} for address: ${accessor}`);

    const tx = await contract.grantAccess(bookId, accessor);
    const receipt = await tx.wait();

    console.log(`\n✓ Access granted successfully!`);
    console.log(`Transaction hash: ${receipt?.hash}`);
    console.log(`Block number: ${receipt?.blockNumber}`);
  });
