import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';
import { Book } from '../types';

export const useLibraryContract = (provider: ethers.BrowserProvider | null, signer: ethers.JsonRpcSigner | null) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contract = provider ? getContract(provider, signer || undefined) : null;

  const checkAdminStatus = useCallback(async () => {
    if (!contract || !signer) return;

    try {
      const adminAddress = await contract.admin();
      const userAddress = await signer.getAddress();
      setIsAdmin(adminAddress.toLowerCase() === userAddress.toLowerCase());
    } catch (err: any) {
      console.error('Error checking admin status:', err);
    }
  }, [contract, signer]);

  const loadBooks = useCallback(async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const allBooks = await contract.getAllBooks();
      const formattedBooks = allBooks.map((book: any) => ({
        id: Number(book.id),
        title: book.title,
        author: book.author,
        isAvailable: book.isAvailable,
        borrower: book.borrower,
        dueDate: Number(book.dueDate),
        createdAt: Number(book.createdAt),
      }));
      setBooks(formattedBooks);
      setError(null);
    } catch (err: any) {
      console.error('Error loading books:', err);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const loadBorrowedBooks = useCallback(async () => {
    if (!contract || !signer) return;

    try {
      const userAddress = await signer.getAddress();
      const userBooks = await contract.getUserBorrowedBooks(userAddress);
      const formattedBooks = userBooks.map((book: any) => ({
        id: Number(book.id),
        title: book.title,
        author: book.author,
        isAvailable: book.isAvailable,
        borrower: book.borrower,
        dueDate: Number(book.dueDate),
        createdAt: Number(book.createdAt),
      }));
      setBorrowedBooks(formattedBooks);
    } catch (err: any) {
      console.error('Error loading borrowed books:', err);
    }
  }, [contract, signer]);

  const addBook = useCallback(async (title: string, author: string) => {
    if (!contract || !signer) throw new Error('Contract not available');

    const tx = await contract.addBook(title, author);
    await tx.wait();
    await loadBooks();
  }, [contract, signer, loadBooks]);

  const borrowBook = useCallback(async (bookId: number) => {
    if (!contract || !signer) throw new Error('Contract not available');

    const tx = await contract.borrowBook(bookId);
    await tx.wait();
    await Promise.all([loadBooks(), loadBorrowedBooks()]);
  }, [contract, signer, loadBooks, loadBorrowedBooks]);

  const returnBook = useCallback(async (bookId: number) => {
    if (!contract || !signer) throw new Error('Contract not available');

    const tx = await contract.returnBook(bookId);
    await tx.wait();
    await Promise.all([loadBooks(), loadBorrowedBooks()]);
  }, [contract, signer, loadBooks, loadBorrowedBooks]);

  useEffect(() => {
    if (contract) {
      loadBooks();
      checkAdminStatus();
      if (signer) {
        loadBorrowedBooks();
      }
    }
  }, [contract, loadBooks, loadBorrowedBooks, checkAdminStatus, signer]);

  return {
    books,
    borrowedBooks,
    isAdmin,
    loading,
    error,
    addBook,
    borrowBook,
    returnBook,
    refreshData: () => Promise.all([loadBooks(), loadBorrowedBooks()]),
  };
};