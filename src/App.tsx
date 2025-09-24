import React, { useState, useCallback } from 'react';
import { useWeb3 } from './hooks/useWeb3';
import { useLibraryContract } from './hooks/useLibraryContract';
import { CONTRACT_ADDRESS } from './utils/contract';

import Header from './components/Header';
import WalletPrompt from './components/WalletPrompt';
import ContractSetup from './components/ContractSetup';
import BookCard from './components/BookCard';
import AddBookModal from './components/AddBookModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

import { Plus, BookOpen, Users, Library } from 'lucide-react';

function App() {
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'borrowed'>('all');
  const [transactionLoading, setTransactionLoading] = useState(false);

  const {
    provider,
    signer,
    account,
    chainId,
    isConnecting,
    error: web3Error,
    connect,
    disconnect,
    isConnected,
  } = useWeb3();

  const {
    books,
    borrowedBooks,
    isAdmin,
    loading,
    error: contractError,
    addBook,
    borrowBook,
    returnBook,
    refreshData,
  } = useLibraryContract(provider, signer);

  // Check if contract is configured
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x...") {
    return <ContractSetup />;
  }

  // Show wallet prompt if not connected
  if (!isConnected) {
    return <WalletPrompt connect={connect} isConnecting={isConnecting} error={web3Error} />;
  }

  const handleAddBook = useCallback(async (title: string, author: string) => {
    setTransactionLoading(true);
    try {
      await addBook(title, author);
    } finally {
      setTransactionLoading(false);
    }
  }, [addBook]);

  const handleBorrowBook = useCallback(async (bookId: number) => {
    setTransactionLoading(true);
    try {
      await borrowBook(bookId);
    } finally {
      setTransactionLoading(false);
    }
  }, [borrowBook]);

  const handleReturnBook = useCallback(async (bookId: number) => {
    setTransactionLoading(true);
    try {
      await returnBook(bookId);
    } finally {
      setTransactionLoading(false);
    }
  }, [returnBook]);

  const getFilteredBooks = () => {
    switch (activeTab) {
      case 'available':
        return books.filter(book => book.isAvailable);
      case 'borrowed':
        return borrowedBooks;
      default:
        return books;
    }
  };

  const filteredBooks = getFilteredBooks();
  const availableCount = books.filter(book => book.isAvailable).length;
  const borrowedCount = books.filter(book => !book.isAvailable).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        account={account}
        isConnected={isConnected}
        isConnecting={isConnecting}
        connect={connect}
        disconnect={disconnect}
        chainId={chainId}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Library className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Borrowed</p>
                <p className="text-2xl font-bold text-gray-900">{borrowedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header with Tabs and Add Book Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Books ({books.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'available'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setActiveTab('borrowed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'borrowed'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Books ({borrowedBooks.length})
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          )}
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">
              🔐 You are logged in as an admin. You can add new books to the library.
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : contractError ? (
          <ErrorMessage message={contractError} onRetry={refreshData} />
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {activeTab === 'borrowed' 
                ? "You haven't borrowed any books yet"
                : activeTab === 'available'
                ? "No books available"
                : "No books in the library"
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'borrowed' 
                ? "Browse available books and borrow some to get started."
                : activeTab === 'available'
                ? "All books are currently borrowed. Check back later."
                : isAdmin 
                ? "Add some books to get started with the library system."
                : "The library is empty. Contact an admin to add books."
              }
            </p>
            {activeTab !== 'all' && (
              <button
                onClick={() => setActiveTab('all')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all books
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBorrow={activeTab !== 'borrowed' ? handleBorrowBook : undefined}
                onReturn={activeTab === 'borrowed' ? handleReturnBook : undefined}
                userAccount={account}
                isLoading={transactionLoading}
              />
            ))}
          </div>
        )}

        {/* Add Book Modal */}
        <AddBookModal
          isOpen={showAddBookModal}
          onClose={() => setShowAddBookModal(false)}
          onAddBook={handleAddBook}
          isLoading={transactionLoading}
        />
      </main>
    </div>
  );
}

export default App;