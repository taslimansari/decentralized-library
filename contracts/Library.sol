// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecentralizedLibrary {
    
    struct Book {
        uint256 id;
        string title;
        string author;
        bool isAvailable;
        address borrower;
        uint256 dueDate;
        uint256 createdAt;
    }
    
    // State variables
    address public admin;
    uint256 public nextBookId;
    uint256 public constant BORROW_DURATION = 7 days; // 7 days borrowing period
    
    // Mappings
    mapping(uint256 => Book) public books;
    mapping(address => uint256[]) public userBorrowedBooks;
    
    // Arrays to track all book IDs
    uint256[] public allBookIds;
    
    // Events
    event BookAdded(uint256 indexed bookId, string title, string author);
    event BookBorrowed(uint256 indexed bookId, address indexed borrower, uint256 dueDate);
    event BookReturned(uint256 indexed bookId, address indexed borrower);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier bookExists(uint256 _bookId) {
        require(_bookId > 0 && _bookId < nextBookId, "Book does not exist");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        nextBookId = 1; // Start book IDs from 1
    }
    
    // Admin function to add books
    function addBook(string memory _title, string memory _author) public onlyAdmin {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_author).length > 0, "Author cannot be empty");
        
        books[nextBookId] = Book({
            id: nextBookId,
            title: _title,
            author: _author,
            isAvailable: true,
            borrower: address(0),
            dueDate: 0,
            createdAt: block.timestamp
        });
        
        allBookIds.push(nextBookId);
        
        emit BookAdded(nextBookId, _title, _author);
        nextBookId++;
    }
    
    // Function to borrow a book
    function borrowBook(uint256 _bookId) public bookExists(_bookId) {
        Book storage book = books[_bookId];
        
        require(book.isAvailable, "Book is not available");
        require(msg.sender != admin, "Admin cannot borrow books");
        
        book.isAvailable = false;
        book.borrower = msg.sender;
        book.dueDate = block.timestamp + BORROW_DURATION;
        
        userBorrowedBooks[msg.sender].push(_bookId);
        
        emit BookBorrowed(_bookId, msg.sender, book.dueDate);
    }
    
    // Function to return a book
    function returnBook(uint256 _bookId) public bookExists(_bookId) {
        Book storage book = books[_bookId];
        
        require(!book.isAvailable, "Book is not borrowed");
        require(book.borrower == msg.sender, "You did not borrow this book");
        
        book.isAvailable = true;
        book.borrower = address(0);
        book.dueDate = 0;
        
        // Remove book from user's borrowed books array
        _removeFromBorrowedBooks(msg.sender, _bookId);
        
        emit BookReturned(_bookId, msg.sender);
    }
    
    // Helper function to remove book from borrowed books array
    function _removeFromBorrowedBooks(address _user, uint256 _bookId) private {
        uint256[] storage borrowedBooks = userBorrowedBooks[_user];
        for (uint256 i = 0; i < borrowedBooks.length; i++) {
            if (borrowedBooks[i] == _bookId) {
                borrowedBooks[i] = borrowedBooks[borrowedBooks.length - 1];
                borrowedBooks.pop();
                break;
            }
        }
    }
    
    // Function to get book details
    function getBook(uint256 _bookId) public view bookExists(_bookId) returns (Book memory) {
        return books[_bookId];
    }
    
    // Function to get all books
    function getAllBooks() public view returns (Book[] memory) {
        Book[] memory allBooks = new Book[](allBookIds.length);
        
        for (uint256 i = 0; i < allBookIds.length; i++) {
            allBooks[i] = books[allBookIds[i]];
        }
        
        return allBooks;
    }
    
    // Function to get available books only
    function getAvailableBooks() public view returns (Book[] memory) {
        uint256 availableCount = 0;
        
        // Count available books
        for (uint256 i = 0; i < allBookIds.length; i++) {
            if (books[allBookIds[i]].isAvailable) {
                availableCount++;
            }
        }
        
        Book[] memory availableBooks = new Book[](availableCount);
        uint256 currentIndex = 0;
        
        // Populate available books array
        for (uint256 i = 0; i < allBookIds.length; i++) {
            if (books[allBookIds[i]].isAvailable) {
                availableBooks[currentIndex] = books[allBookIds[i]];
                currentIndex++;
            }
        }
        
        return availableBooks;
    }
    
    // Function to get user's borrowed books
    function getUserBorrowedBooks(address _user) public view returns (Book[] memory) {
        uint256[] memory borrowedBookIds = userBorrowedBooks[_user];
        Book[] memory borrowedBooks = new Book[](borrowedBookIds.length);
        
        for (uint256 i = 0; i < borrowedBookIds.length; i++) {
            borrowedBooks[i] = books[borrowedBookIds[i]];
        }
        
        return borrowedBooks;
    }
    
    // Function to get total number of books
    function getTotalBooks() public view returns (uint256) {
        return allBookIds.length;
    }
    
    // Function to check if book is overdue
    function isBookOverdue(uint256 _bookId) public view bookExists(_bookId) returns (bool) {
        Book memory book = books[_bookId];
        return !book.isAvailable && block.timestamp > book.dueDate;
    }
    
    // Function to change admin (only current admin)
    function changeAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "New admin address cannot be zero");
        admin = _newAdmin;
    }
}