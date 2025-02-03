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
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { pageModeAtom } from "@/atoms/authAtom";

import InputDateTime from "../general/InputDateTime";
import { compressAndConvertToPNG } from "@/utils/ImageProcessor"; // 画像圧縮ユーティリティをインポート
import "react-clock/dist/Clock.css";

export default function EventCreate() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [, setPageMode] = useAtom(pageModeAtom);
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { control, setValue, handleSubmit, register } = useForm({
        defaultValues: {
            title: "",
            date: "",
            location: "",
            description: "",
            price: "",
        },
    });

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        if (date && time) {
            const formattedTime = format(time, "HH:mm");
            const combinedDateTime = `${format(new Date(date), "yyyy-MM-dd")}T${formattedTime}:00`;
            setValue("date", combinedDateTime);
        }
    }, [date, time, setValue]);

    // 画像選択時に圧縮・変換を実行
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const processedFile = await compressAndConvertToPNG(file);
            setImageFile(processedFile);
            setImagePreview(URL.createObjectURL(processedFile));
            console.log("Processed file (PNG):", processedFile);
        } catch (error) {
            setMessage("画像の圧縮または変換に失敗しました。");
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("date", data.date);
        formData.append("location", data.location);
        formData.append("description", data.description);
        formData.append("price", data.price);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        console.log("===== SENT FORM DATA =====");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("認証エラー: ログインしてください");
                return;
            }

            const response = await fetch(`${API_URL}/events`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("イベントの作成に失敗しました");

            setMessage("イベントが正常に作成されました！");
            setPageMode("index");
            router.push("/");
        } catch (error) {
            console.error("Error:", error);
            setMessage("イベントの作成に失敗しました。もう一度お試しください。");
        }
    };

    return (
        <div className="flex flex-col h-screen px-4 py-8">
            <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">Create Event</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded shadow-md bg-white w-full max-w-lg pb-12">
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
                        <InputDateTime
                            selectedTime={time}
                            onChange={setTime}
                        />
                    </div>
                </div>

                <div className="my-4">
                    <Label htmlFor="image">イベント画像:</Label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded"
                    />
                    {imagePreview && (
                        <div className="mt-2 flex justify-center">
                            <Image
                                src={imagePreview}
                                alt="選択した画像"
                                width={300}
                                height={200}
                                className="rounded-lg object-cover"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="location">場所:</Label>
                    <input
                        type="text"
                        id="location"
                        {...register("location")}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="description">概要:</Label>
                    <textarea
                        id="description"
                        {...register("description")}
                        className="w-full border rounded p-2"
                        rows="4"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="price">金額:</Label>
                    <input
                        id="price"
                        {...register("price")}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <Button
                    className="w-full mt-8 text-white bg-orange-400 hover:bg-orange-500 rounded-md px-6 py-3 text-lg shadow-md transition-all duration-300"
                    type="submit"
                >
                    投稿する
                </Button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}