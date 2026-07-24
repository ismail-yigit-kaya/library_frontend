import React, { useState, useEffect, type ChangeEvent} from "react";
import type { Book } from "../types/book";
import {createBookApi, updateBookApi, showToast} from "../services/api";
import { DatePicker } from "./date-picker";
import { format, parse } from "date-fns";

interface BookFormProps {
    editingBook: Book | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

const emptyForm: Book = {
    title:"",
    author:"",
    publisher:"",
    pageCount:0,
    publishDate:"",
    category_id:0
};

export function BookForm({editingBook, onSuccess, onCancelEdit }: BookFormProps) {
    const [formData, setFormData] = useState<Book>(emptyForm);

    useEffect(() => {
        if (editingBook) {
            setFormData(editingBook);
        } else {
            setFormData(emptyForm);
        }
    },[editingBook]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingBook && editingBook.book_id){
            const isSuccess = await updateBookApi(editingBook.book_id, formData);
            if (isSuccess){
                showToast("Successfully updated book!", "success");
                onCancelEdit();
                onSuccess();
            }
        }else{
            const isSuccess = await createBookApi(formData);
            if (isSuccess){
                showToast("Successfully created book!", "success");
                setFormData(emptyForm);
                onSuccess();
            }
        }
    };

    return (
        <form id="book-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                <label htmlFor="title" className="text-sm font-medium text-slate-600">Book Title:</label>
                <input type="text" id="title"
                       placeholder="Add book title"
                       className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                       name="title"
                       value={formData.title}
                       onChange={handleChange}/>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="author" className="text-sm font-medium text-slate-600">Author:</label>
                <input type="text" id="author"
                       placeholder="Add author name"
                       className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                       name="author"
                       value={formData.author}
                       onChange={handleChange}/>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="publisher" className="text-sm font-medium text-slate-600">Publisher:</label>
                <input type="text" id="publisher"
                       placeholder="Add publisher name"
                       className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                       name="publisher"
                       value={formData.publisher}
                       onChange={handleChange}/>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="pageCount" className="text-sm font-medium text-slate-600">Page Count:</label>
                <input type="number" id="pageCount"
                       placeholder="Add page count"
                       className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                       name="pageCount"
                       value={formData.pageCount}
                       onChange={handleChange}/>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="publishDate" className="text-sm font-medium text-slate-600">
                    Publish Date:
                </label>
                <DatePicker
                    date={formData.publishDate ? new Date(formData.publishDate) : undefined}
                    setDate={(selectedDate) => {
                        setFormData((prev) => ({
                            ...prev,
                            publishDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
                        }));
                    }}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="categoryId" className="text-sm font-medium text-slate-600">Category:</label>
                <input type="number" id="categoryId"
                       placeholder="Add categoryId"
                       className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                       name="category_id"
                       value={formData.category_id}
                       onChange={handleChange}/>
            </div>

            <div className="flex justify-center pt-2">
                <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition shadow-sm text-sm w-full">
                    {editingBook ? "Update Book" : "Add Book"}
                </button>
            </div>
        </form>
    )
}