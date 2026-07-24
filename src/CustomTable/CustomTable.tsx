import * as React from "react";
import {useState, useEffect} from "react";
import {
    Table,
        TableBody,
        TableCaption,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface CustomTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T, inded?: number) => string | number;
    emptyMessage?: string;
    onDelete?: (item: T) => void;
    onEdit?: (item: T) => void;
}

export function CustomTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage= "No data found",
    onDelete,
    onEdit }: CustomTableProps<T>) {

    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const hasAction = Boolean(onEdit || onDelete);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemPerPage, setItemPerPage] = useState<number>(5);


    const currentItems = data.slice((currentPage - 1) * 5, currentPage * 5);
    const totalPages = Math.ceil(data.length / itemPerPage) || 1;

    useEffect(() => {
        if(currentPage > totalPages && currentPage > 1){
            setCurrentPage(totalPages);
        }
    }, [data.length, totalPages, currentPage]);


    return (
        <>
            <div className="rounded-md overflow-x-hidden border border-slate-100">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                            {columns.map((col, index) => (
                                <TableHead
                                    key={index}
                                    className={'font-semibold text-slate-700 ${col.className || ""}'}>
                                    {col.header}
                                </TableHead>
                            ))}
                            {hasAction && (
                                <TableHead className={"text-right font-semibold text-slate-700"}>
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}
                                           className={"text-center py-6 text-slate-600"}>
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentItems.map((item) => (
                                <TableRow key={keyExtractor(item)}
                                          className={"hover:bg-slate50/80 transiton-colors"}
                                >
                                    {columns.map((col, index) => (
                                        <TableCell key={index}
                                                   className={`py-3.5 text-slate-600 ${col.className}`}
                                        >
                                            {col.cell
                                                ? col.cell(item) : col.accessorKey
                                                    ? String(item[col.accessorKey] ?? "") : null}
                                        </TableCell>
                                    ))}

                                    {hasAction && (
                                        <TableCell className={"text-right py-3.5"}>
                                            <div className={"flex justify-end gap-2"}>
                                                {onEdit && (
                                                    <button type={"button"}
                                                            onClick={() => onEdit(item)}
                                                            className={"bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-xs transition font-medium"}>
                                                        Edit
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button type={"button"}
                                                            onClick={() => setItemToDelete(item)}
                                                            className={"bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-xs transition font-medium"}>
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-center gap-4 items-center w-full">
                <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}
                        className="disabled:cursor-not-allowed disabled:opacity-50 bg-amber-400 hover:bg-amber-4-500 rounded px-4 py-2 text-white text-sm shadow">
                    Previous Page
                </button>
                <p className="text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                </p>
                <button onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="disabled:cursor-not-allowed disabled:opacity-50 bg-amber-400 hover:bg-amber-500 rounded px-4 py-2 text-white text-sm shadow">
                    Next Page
                </button>
            </div>

            <AlertDialog
                open={!!itemToDelete}
                onOpenChange={() => setItemToDelete(null)}
            >
                <AlertDialogContent className={"bg-white"}>
                    <AlertDialogHeader className={"text-center"}>
                        <AlertDialogTitle>Are You Sure</AlertDialogTitle>

                        <AlertDialogDescription>
                            This action can not be undone. Are you sure you want to delete it?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                        className={"bg-red-600 hover:bg-red-700 text-white"}
                        onClick={() => {
                            if(itemToDelete && onDelete) {
                                onDelete(itemToDelete)
                                setItemToDelete(null)}
                        }}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog></>
    )
}