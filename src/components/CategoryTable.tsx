import React, { useState, useEffect, type ChangeEvent} from "react";
import type { Category } from "../types/category";
import {Column, CustomTable} from "@/CustomTable/CustomTable";
import {deleteCategoryApi, getCategoryApi, showToast} from "@/services/api";

interface CategoryTableProps {
    onEdit: (category: Category) => void,
    onDelete: (category: Category) => void,
}
export function CategoryTable({onEdit}: CategoryTableProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categories, setCategory] = useState<Category[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const data = await getCategoryApi();
        setCategory(data);
    };

    const handleDelete = async () => {
        if (!selectedCategory?.category_id) return;

        const isSuccess = await deleteCategoryApi(selectedCategory.category_id);
        if (isSuccess) {
            showToast("Book successfully deleted", "error");
            setSelectedCategory(null);
            loadCategories();
        } else {
            showToast("Failed to delete book", "info");
        }
    };

    const categoryColumns: Column<Category>[] = [
        {header: "Category" , accessorKey: "category" , className: "text-left font-semibold text-slate-700"},
        {header: "CategoryId" , accessorKey: "id" , className: "text-center font-semibold text-slate-700"},

    ]

    return (
        <CustomTable data={categories}
                     columns={categoryColumns}
                     keyExtractor={(category, index) => category.id ? String(category.id) : `cat-${index}`}                     onEdit={onEdit}
                     onDelete={handleDelete}
                     emptyMessage={"There is no book"}
        />
    );
}
