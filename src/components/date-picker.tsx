import * as React from "react";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
    date?: Date;
    setDate: (date?: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            setDate(new Date(value));
        } else {
            setDate(undefined);
        }
    };

    return (
        <Input
            type="date"
            value={formattedDate}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className="w-full border-gray-300 rounded-lg text-sm py-1.5 h-9 bg-slate-100"
        />
    );
}