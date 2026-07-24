import React, { useState, useEffect, type ChangeEvent} from "react";
import type { Category } from "../types/category";
import {createCategoryApi, updateCategoryApi, showToast} from "../services/api";

interface CategoryFormProps {
    editingCategory: Category | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

const emptyForm: Category = {
    id:0,
    category:""
};

export function CategoryForm({editingCategory, onSuccess, onCancelEdit }: CategoryFormProps) {
    const [formData, setFormData] = useState<Category>(emptyForm);

    useEffect(() => {
        if (editingCategory) {
            setFormData(editingCategory);
        } else {
            setFormData(emptyForm);
        }
    },[editingCategory]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingCategory && editingCategory.id){
            const isSuccess = await updateCategoryApi(editingCategory.id, formData);
            if (isSuccess){
                showToast("Successfully updated category!", "success");
                onCancelEdit();
                onSuccess();
            }
        }else{
            const isSuccess = await createCategoryApi(formData);
            if (isSuccess){
                showToast("Successfully created category!", "success");
                setFormData(emptyForm);
                onSuccess();
            }
        }
    };

    return (
        <form id="category-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                <label htmlFor="category" className="text-sm font-medium text-slate-600">Category:</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Add Category"
                       />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="id" className="text-sm font-medium text-slate-600">Id:</label>
                <input type="number" id="id"
                       placeholder="Add id"
                       className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                       name="id"
                       value={formData.id}
                       onChange={handleChange}/>
            </div>

            <div className="flex justify-center pt-2">
                <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition shadow-sm text-sm w-full">
                    {editingCategory ? "Update Category" : "Add Category"}
                </button>
            </div>
        </form>
    )
}