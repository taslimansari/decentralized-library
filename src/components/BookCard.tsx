import React from 'react';
import { Book, Calendar, User, Clock } from 'lucide-react';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    isAvailable: boolean;
    borrower: string;
    dueDate: number;
    createdAt: number;
  };
  onBorrow?: (bookId: number) => void;
  onReturn?: (bookId: number) => void;
  userAccount?: string;
  isLoading?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onBorrow,
  onReturn,
  userAccount,
  isLoading = false,
}) => {
  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatDateTime = (timestamp: number) => {
    if (timestamp === 0) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const isDueToday = () => {
    if (book.dueDate === 0 || book.isAvailable) return false;
    const today = new Date();
    const dueDate = new Date(book.dueDate * 1000);
    return today.toDateString() === dueDate.toDateString();
  };

  const isOverdue = () => {
    if (book.dueDate === 0 || book.isAvailable) return false;
    const now = Date.now() / 1000;
    return now > book.dueDate;
  };

  const canReturn = userAccount && book.borrower.toLowerCase() === userAccount.toLowerCase();

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      book.isAvailable ? 'border-green-200 hover:border-green-300' : 
      isOverdue() ? 'border-red-200 hover:border-red-300' :
      isDueToday() ? 'border-yellow-200 hover:border-yellow-300' :
      'border-blue-200 hover:border-blue-300'
    }`}>
      <div className="p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            book.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : isOverdue()
                ? 'bg-red-100 text-red-800'
                : isDueToday()
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
          }`}>
            <Book className="h-4 w-4 mr-1" />
            {book.isAvailable 
              ? 'Available' 
              : isOverdue() 
                ? 'Overdue'
                : isDueToday()
                  ? 'Due Today'
                  : 'Borrowed'
            }
          </span>
          <span className="text-sm text-gray-500">ID: {book.id}</span>
        </div>

        {/* Book Info */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <User className="h-4 w-4 mr-2" />
          by {book.author}
        </p>

        {/* Metadata */}
        <div className="space-y-2 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Added: {formatDate(book.createdAt)}
          </div>
          
          {!book.isAvailable && (
            <>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Borrower: {book.borrower.slice(0, 6)}...{book.borrower.slice(-4)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Due: {formatDateTime(book.dueDate)}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {book.isAvailable && onBorrow && (
            <button
              onClick={() => onBorrow(book.id)}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Processing...' : 'Borrow Book'}
            </button>
          )}
          
          {!book.isAvailable && canReturn && onReturn && (
            <button
              onClick={() => onReturn(book.id)}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Processing...' : 'Return Book'}
            </button>
          )}
          
          {!book.isAvailable && !canReturn && (
            <div className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium">
              Not Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;