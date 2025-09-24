const hre = require("hardhat");

async function main() {
  console.log("Deploying DecentralizedLibrary contract...");

  // Get the contract factory
  const DecentralizedLibrary = await hre.ethers.getContractFactory("DecentralizedLibrary");
  
  // Deploy the contract
  const library = await DecentralizedLibrary.deploy();
  
  // Wait for deployment to complete
  await library.waitForDeployment();
  
  const contractAddress = await library.getAddress();
  console.log("DecentralizedLibrary deployed to:", contractAddress);
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployed by:", deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");
  
  // Add some sample books
  console.log("\nAdding sample books...");
  
  const sampleBooks = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger" },
    { title: "Lord of the Flies", author: "William Golding" },
    { title: "Animal Farm", author: "George Orwell" },
    { title: "Brave New World", author: "Aldous Huxley" }
  ];
  
  for (const book of sampleBooks) {
    const tx = await library.addBook(book.title, book.author);
    await tx.wait();
    console.log(`Added: "${book.title}" by ${book.author}`);
  }
  
  console.log("\nSetup complete!");
  console.log("Contract Address:", contractAddress);
  console.log("Admin Address:", deployer.address);
  console.log("Network: Hardhat Local (Chain ID: 1337)");
  
  return contractAddress;
}

main()
  .then((contractAddress) => {
    // Write the contract address to a file for the frontend to use
    const fs = require('fs');
    const contractConfig = `export const CONTRACT_ADDRESS = "${contractAddress}";`;
    fs.writeFileSync('./src/utils/contractAddress.js', contractConfig);
    console.log("\nContract address saved to src/utils/contractAddress.js");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });