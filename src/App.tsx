import { useState } from "react"
import { BookTable } from "./components/BookTable"
import type { Book } from "./types/book"
import {BookForm} from "@/components/BookForm";
import {CategoryForm} from "@/components/CategoryForm";
import {CategoryTable} from "@/components/CategoryTable";
import {Category} from "@/types/category";
import { Book as BookIcon, FolderTree, Library } from "lucide-react";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger, SidebarFooter,
} from "@/components/ui/sidebar";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {deleteBookApi, deleteCategoryApi, showToast} from "@/services/api";

export function App() {
    const [editingBook, setEditingBook] = useState<Book | null> (null)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [refreshKey, setRefreshKey] = useState<number>(0)
    const [activeTab, setActiveTab] = useState<"books" | "categories">("books");
    const [isBookSheetOpen, setIsBookSheetOpen] = useState(false)
    const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false)
    const [deleteBook, setDeleteBook] = useState<Book | null>(null)
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
    const handleEditingBook = (book: Book) => {
        setEditingBook(book)
    }

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1)
    }



    return (
        <SidebarProvider>

            <Sidebar>
                <SidebarHeader className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-400 p-2 rounded-lg text-white">
                            <Library className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-base leading-none">
                                Library App
                            </span>
                            <span className="text-xs text-slate-400 mt-1">
                                Admin Panel
                            </span>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => {setActiveTab("books")}}
                                        isActive={activeTab === "books"}
                                    >
                                        <BookIcon className="h-4 w-4 mr-2" />
                                        <span>Books</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => {setActiveTab("categories")}}
                                        isActive={activeTab === "categories"}
                                    >
                                        <FolderTree className="h-4 w-4 mr-2" />
                                        <span>Categories</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter />
            </Sidebar>
            <SidebarTrigger />

            <main className="min-h-screen  text-slate-800 font-sans p-8 max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-slate-700 mb-7">
                    Library Management System
                </h1>


                {activeTab === "books" ? (
                        <>
                            <div>
                                <div className={"flex justify-between items-center mb-6"}>
                                    <h2 className="text-xl font-semibold mb-6 text-slate-700">
                                        Books
                                    </h2>

                                    <button
                                        onClick={() => {
                                            setEditingBook(null);
                                            setIsBookSheetOpen(true);
                                        }}
                                        className={" bg-amber-300 hover:bg-amber-400 text-white px-3 py-1 rounded text-xs transition font-medium"}
                                    >
                                        Add Book
                                    </button>
                                </div>

                                <div className=" w-full bg-white p-6 rounded-xl shadow-md overflow-x-auto">
                                    <BookTable
                                        onEdit={(book) => {
                                            setEditingBook(book);
                                            setIsBookSheetOpen(true);
                                        }}
                                        onDelete={(book) => {
                                            console.log("Silinecek kitap verisi ulaştı:", book);
                                            setDeleteBook(book)
                                        }}
                                        refreshKey={refreshKey}
                                    />
                                </div>
                            </div>
                            <Sheet open={isBookSheetOpen} onOpenChange={setIsBookSheetOpen}>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>
                                            {editingBook ? "Edit Book" : "Add Book"}
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-6">
                                        <BookForm
                                            editingBook={editingBook}
                                            onSuccess={() => {
                                                handleRefresh();
                                                setIsBookSheetOpen(false);
                                            }}
                                            onCancelEdit={() => {
                                                setEditingBook(null);
                                                setIsBookSheetOpen(false);
                                            }}/>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </>
                )
                    :

                    <>
                        <div>
                            <div className={"flex justify-between items-center mb-6"}>
                                <h2 className="text-xl font-semibold mb-6 text-slate-700">
                                    Categories
                                </h2>

                                <button
                                    onClick={() => {
                                        setEditingCategory(null);
                                        setIsCategorySheetOpen(true);
                                    }}
                                    className={" bg-amber-300 hover:bg-amber-400 text-white px-3 py-1 rounded text-xs transition font-medium"}
                                >
                                    Add Category
                                </button>
                            </div>

                            <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-md overflow-x-auto">

                                <CategoryTable
                                    onEdit={(category) => setEditingCategory(category)}
                                    onDelete={(category) => {
                                        setDeleteCategory(category)
                                    }}
                                />
                            </div>
                        </div>
                        <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
                            <SheetContent className={"bg-white"}>
                                <SheetHeader>
                                    <SheetTitle>
                                        {editingCategory ? "Edit Category" : "Add Category"}
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="mt-6">
                                    <CategoryForm
                                        editingCategory={editingCategory}
                                        onSuccess={() => {
                                            handleRefresh();
                                            setIsCategorySheetOpen(false);
                                        }}
                                        onCancelEdit={() => {
                                            setEditingCategory(null);
                                            setIsCategorySheetOpen(false);
                                        }}/>
                                </div>
                            </SheetContent>
                        </Sheet></>
                }

                <div id="toast-container" className="fixed top-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none" />
            </main>
        </SidebarProvider>
    )
}