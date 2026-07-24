import {useState, useEffect} from "react";
import type {Book} from "../types/book";
import {getBooksApi, deleteBookApi, showToast} from "../services/api";
import {Column, CustomTable} from "@/CustomTable/CustomTable";

interface BookTableProps {
    onEdit: (book: Book) => void,
    onDelete?: (book: Book) => void
    refreshKey?: number;
}

export function BookTable({onEdit, onDelete, refreshKey}: BookTableProps) {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        loadBooks();
    }, [refreshKey]);

    const loadBooks = async () => {
        const data = await getBooksApi();
        setBooks(data);
    };

    const handleDelete = async (book: Book) => {
        if (!book?.book_id) return;

        const isSuccess = await deleteBookApi(book.book_id);
        if (isSuccess) {
            showToast("Book successfully deleted", "error");
            loadBooks();
        } else {
            showToast("Failed to delete book", "info");
        }
    };


    const bookColumns: Column<Book>[] = [
        {header: "Book Title", accessorKey: "title", className: "text-left font-semibold text-slate-700"},
        {header: "Author", accessorKey: "author", className: "text-left font-semibold text-slate-700"},
        {header: "Publisher", accessorKey: "publisher", className: "text-left font-semibold text-slate-700"},
        {header: "Page Count", accessorKey: "pageCount", className: "text-center font-semibold text-slate-700"},
        {header: "Publish Date", accessorKey: "publishDate", className: "text-left font-semibold text-slate-700"},
        {header: "Category", accessorKey: "category_id", className: "text-center font-semibold text-slate-700"},
    ]


    return (
        <CustomTable data={books}
                     columns={bookColumns}
                     keyExtractor={(book, index) => book.book_id ? String(book.book_id) : `book-${index}`}
                     onEdit={onEdit}
                     onDelete={handleDelete}
                     emptyMessage={"There is no book"}
        />
    );
}