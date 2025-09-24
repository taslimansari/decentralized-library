export interface Book {
  id: number;
  title: string;
  author: string;
  isAvailable: boolean;
  borrower: string;
  dueDate: number;
  createdAt: number;
}

export interface ContractMethods {
  addBook: (title: string, author: string) => Promise<any>;
  borrowBook: (bookId: number) => Promise<any>;
  returnBook: (bookId: number) => Promise<any>;
  getAllBooks: () => Promise<Book[]>;
  getAvailableBooks: () => Promise<Book[]>;
  getUserBorrowedBooks: (address: string) => Promise<Book[]>;
  getTotalBooks: () => Promise<number>;
  isBookOverdue: (bookId: number) => Promise<boolean>;
}