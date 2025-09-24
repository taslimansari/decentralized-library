# Decentralized Library Management System

A fully functional decentralized application (DApp) for managing a library system on the Ethereum blockchain. This application uses smart contracts to handle book borrowing and returning, with all data stored transparently on-chain.

## 🚀 Features

### Smart Contract Functionality
- **Add Books**: Admins can add new books to the library
- **Borrow Books**: Users can borrow available books (7-day lending period)
- **Return Books**: Borrowers can return their books
- **View Books**: Real-time book status and availability
- **Admin Controls**: Only admin can add books, users can only return their own borrowed books

### Frontend Features  
- **Modern React Interface**: Clean, responsive design with Tailwind CSS
- **Web3 Integration**: Connect with MetaMask wallet
- **Real-time Updates**: Automatic refresh of book status after transactions
- **Multi-view Tabs**: View all books, available books, or personal borrowed books
- **Transaction Feedback**: Loading states and error handling
- **Admin Dashboard**: Special interface for library administrators

## 🛠 Tech Stack

- **Smart Contract**: Solidity ^0.8.19
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Blockchain Integration**: Ethers.js v6
- **Wallet**: MetaMask
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📋 Prerequisites

1. **MetaMask**: Browser extension installed
2. **Test ETH**: Get test tokens from:
   - [Sepolia Faucet](https://sepoliafaucet.com) for Sepolia testnet
   - Or use Ganache for local development
3. **Remix IDE**: For compiling and deploying the smart contract

## 🏗 Setup Instructions

### Quick Start (Fully Automated)

Everything is pre-configured! Just run these commands:

```bash
# Terminal 1 - Start local blockchain
npm run blockchain

# Terminal 2 - Deploy contracts and start app
npm run setup
```

### What's Included

- ✅ **Hardhat Local Blockchain**: Pre-configured with 10 accounts
- ✅ **Smart Contract**: Auto-compiled and deployed
- ✅ **Sample Data**: 8 books pre-loaded in the library
- ✅ **Test Accounts**: Each account has 10,000 ETH
- ✅ **MetaMask Ready**: Just add the localhost network

### MetaMask Configuration

Add this network to MetaMask:
- **Network Name**: Localhost 8545
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 1337
- **Currency Symbol**: ETH

Import the admin account:
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

## 🎯 How to Use

### For Regular Users

1. **Connect Wallet**: Connect your MetaMask with test ETH
2. **Browse Books**: View all available books in the library
3. **Borrow Books**: Click "Borrow Book" on any available book
4. **Return Books**: Go to "My Books" tab and return borrowed books
5. **Track Due Dates**: Monitor your borrowed books and due dates

### For Admins

1. **Admin Access**: The deployer address is automatically the admin
2. **Add Books**: Use the "Add Book" button to add new books
3. **Manage Library**: View all books and their current status
4. **Monitor System**: Track borrowing patterns and overdue books

## 🔧 Smart Contract Details

### Main Functions

```solidity
// Admin only - add new books
function addBook(string memory _title, string memory _author)

// Borrow available books  
function borrowBook(uint256 _bookId)

// Return borrowed books
function returnBook(uint256 _bookId)

// View functions
function getAllBooks() returns (Book[] memory)
function getAvailableBooks() returns (Book[] memory) 
function getUserBorrowedBooks(address _user) returns (Book[] memory)
```

### Security Features

- **Access Control**: Only admin can add books
- **Borrower Validation**: Only the borrower can return their books
- **Availability Checking**: Prevents double-borrowing
- **Due Date Tracking**: 7-day borrowing period with overdue detection

## 🌐 Network Configuration

### Sepolia Testnet
- **Network Name**: Sepolia
- **RPC URL**: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
- **Chain ID**: 11155111
- **Currency Symbol**: SepoliaETH

### Local Development (Ganache)
- **Network Name**: Ganache
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: 1337
- **Currency Symbol**: ETH

## 🐛 Troubleshooting

### Common Issues

1. **"Contract not configured"**: Update CONTRACT_ADDRESS in contract.ts
2. **MetaMask connection failed**: Ensure MetaMask is installed and unlocked
3. **Transaction failed**: Check you have sufficient test ETH for gas fees
4. **Wrong network**: Switch MetaMask to the network where you deployed
5. **Books not loading**: Verify the contract address and network match

### Error Messages

- **"Only admin can perform this action"**: You're not the contract admin
- **"Book is not available"**: Book is already borrowed
- **"You did not borrow this book"**: Can't return a book you didn't borrow

## 🔐 Security Considerations

- Uses test networks only - no real ETH at risk
- Smart contract includes access controls and validation
- All transactions are transparent and auditable on-chain
- No private data stored - everything is public blockchain data

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets  
- Mobile phones
- All modern browsers with MetaMask support

## 🎨 Design Features

- **Clean Interface**: Modern, library-themed design
- **Status Indicators**: Clear visual feedback for book availability
- **Smooth Animations**: Hover effects and transitions
- **Intuitive Navigation**: Easy-to-use tab system
- **Professional Styling**: Consistent color scheme and typography

## 🤝 Contributing

This is a complete, production-ready decentralized application. The code is organized into logical modules for easy maintenance and extension.

## 📄 License

This project is provided as-is for educational and development purposes.

---

**Ready to use**: This is a complete, working decentralized library system that demonstrates real blockchain interactions with a polished user interface. All transactions happen on-chain with test ETH only.