const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedLibrary", function () {
  let library;
  let admin;
  let user1;
  let user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();
    
    const DecentralizedLibrary = await ethers.getContractFactory("DecentralizedLibrary");
    library = await DecentralizedLibrary.deploy();
    await library.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await library.admin()).to.equal(admin.address);
    });

    it("Should start with nextBookId as 1", async function () {
      expect(await library.nextBookId()).to.equal(1);
    });
  });

  describe("Adding Books", function () {
    it("Should allow admin to add books", async function () {
      await library.addBook("Test Book", "Test Author");
      
      const books = await library.getAllBooks();
      expect(books.length).to.equal(1);
      expect(books[0].title).to.equal("Test Book");
      expect(books[0].author).to.equal("Test Author");
      expect(books[0].isAvailable).to.equal(true);
    });

    it("Should not allow non-admin to add books", async function () {
      await expect(
        library.connect(user1).addBook("Test Book", "Test Author")
      ).to.be.revertedWith("Only admin can perform this action");
    });
  });

  describe("Borrowing Books", function () {
    beforeEach(async function () {
      await library.addBook("Test Book", "Test Author");
    });

    it("Should allow users to borrow available books", async function () {
      await library.connect(user1).borrowBook(1);
      
      const book = await library.getBook(1);
      expect(book.isAvailable).to.equal(false);
      expect(book.borrower).to.equal(user1.address);
    });

    it("Should not allow borrowing unavailable books", async function () {
      await library.connect(user1).borrowBook(1);
      
      await expect(
        library.connect(user2).borrowBook(1)
      ).to.be.revertedWith("Book is not available");
    });
  });

  describe("Returning Books", function () {
    beforeEach(async function () {
      await library.addBook("Test Book", "Test Author");
      await library.connect(user1).borrowBook(1);
    });

    it("Should allow borrower to return books", async function () {
      await library.connect(user1).returnBook(1);
      
      const book = await library.getBook(1);
      expect(book.isAvailable).to.equal(true);
      expect(book.borrower).to.equal(ethers.ZeroAddress);
    });

    it("Should not allow non-borrower to return books", async function () {
      await expect(
        library.connect(user2).returnBook(1)
      ).to.be.revertedWith("You did not borrow this book");
    });
  });
});