"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import InputDateTime from "../general/InputDateTime";
import "react-clock/dist/Clock.css";

export default function EventForm({ initialData, onSubmit, buttonText }) {
    const { control, setValue, handleSubmit, register } = useForm({
        defaultValues: initialData,
    });

    const [date, setDate] = useState(initialData?.date || null);
    const [time, setTime] = useState(new Date()); // `Date` オブジェクトを初期値に
    const [imageFile, setImageFile] = useState(null); // 画像の状態管理
    const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null); // 画像のプレビューURL

    useEffect(() => {
        if (date && time) {
            const formattedTime = format(time, "HH:mm");
            const combinedDateTime = `${format(new Date(date), "yyyy-MM-dd")}T${formattedTime}:00`;
            setValue("date", combinedDateTime);
        }
    }, [date, time, setValue]);

    // 画像が変更された時の処理
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // フォーム送信処理
    const onSubmitForm = (data) => {
        onSubmit(data, imageFile);
    };

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 rounded shadow-md bg-white w-full max-w-lg pb-12">
            <div>
                <Label htmlFor="title">タイトル:</Label>
                <input
                    type="text"
                    id="title"
                    {...register("title")}
                    className="w-full border rounded p-2"
                    required
                />
            </div>

            <div className="flex gap-2">
                <div className="my-4 w-1/2">
                    <Label htmlFor="date">日付:</Label>
                    <Controller
                        name="date"
                        control={control}
                        render={() => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        {date ? format(new Date(date), "yyyy/MM/dd") : "日付を選択"}
                                        <CalendarIcon className="ml-auto h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(selectedDate) => setDate(selectedDate)}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>

                <div className="my-4 w-1/2">
                    <Label htmlFor="time">開始時間:</Label>
                    <InputDateTime selectedTime={time} onChange={setTime} />
                </div>
            </div>

            <div className="my-4">
                <Label htmlFor="image">イベント画像:</Label>
                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
                {imagePreview && (
                    <div className="mt-2 flex justify-center">
                        <Image src={imagePreview} alt="選択した画像" width={300} height={200} className="rounded-lg object-cover" />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="location">場所:</Label>
                <input type="text" id="location" {...register("location")} className="w-full border rounded p-2" required />
            </div>

            <div>
                <Label htmlFor="description">概要:</Label>
                <textarea id="description" {...register("description")} className="w-full border rounded p-2" rows="4" required />
            </div>

            <div>
                <Label htmlFor="price">金額:</Label>
                <input id="price" {...register("price")} className="w-full border rounded p-2" required />
            </div>

            <Button type="submit" className="w-full mt-8 bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-md">
                {buttonText}
            </Button>
        </form>
    );
}