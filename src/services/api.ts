import type {Book} from '@/types/book';
import {Category} from "@/types/category";


const bookApiUrl = "http://localhost:8080/api/books";
const categoryApiUrl = "http://localhost:8080/api/categories";

export async function getBooksApi(): Promise<Book[]> {
    try {
        const response = await fetch(bookApiUrl);
         if (!response.ok) {
             throw new Error("Failed to fetch books");
         }
         const data: Book[] = await response.json();
         return data;
    } catch (error){
        console.error("API Error: ", error);
        return [];
    }
}

export async function getCategoryApi(): Promise<Category[]> {
    try {
        const response = await fetch(categoryApiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch category");
        }
        const data: Category[] = await response.json();
        return data;
    } catch (error){
        console.error("API Error: ", error);
        return [];
    }
}

export async function createBookApi(bookData: Book): Promise<boolean> {
    try {
        const response = await fetch(bookApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });

        return response.ok;
    } catch (error) {
        console.error("API Error:", error);
        return false;
    }
}

export async function createCategoryApi(categoryData: Category): Promise<boolean> {
    try {
        const response = await fetch(categoryApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData)
        });

        return response.ok;
    } catch (error) {
        console.error("API Error:", error);
        return false;
    }
}

export async function updateBookApi(id: number , bookData: Book): Promise<boolean> {
    try{
        const response = await fetch(`${bookApiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });

        return response.ok;
    } catch (error) {
        console.error(" API Error: ", error);
        return false;
    }
}

export async function updateCategoryApi(id: number , categoryData: Category): Promise<boolean> {
    try{
        const response = await fetch(`${categoryApiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData)
        });

        return response.ok;
    } catch (error) {
        console.error(" API Error: ", error);
        return false;
    }
}

export async function deleteBookApi(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${bookApiUrl}/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("API Error: ", error);
        return false;
    }
}

export async function deleteCategoryApi(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${categoryApiUrl}/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("API Error: ", error);
        return false;
    }
}

type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'success'): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastConfig = {
        success: {
            bg: 'bg-emerald-500',
            icon: '🗸'
        },
        error: {
            bg: 'bg-red-500',
            icon: '𐄂'
        },
        info: {
            bg: 'bg-blue-500',
            icon: 'ℹ️'
        }
    };

    const config = toastConfig[type];

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center space-x-3 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0 ${config.bg}`;

    toast.innerHTML = `
        <span class="font-bold text-lg">${config.icon}</span>
        <span class="text-sm font-medium">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

