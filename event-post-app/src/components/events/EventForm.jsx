'use client';

import { useState } from "react";

export default function EventForm({ initialData, onSubmit, buttonText }) {
    const [formData, setFormData] = useState(initialData);
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, imageFile);
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 rounded shadow-md bg-white w-full max-w-lg space-y-6 mt-6">
            <div>
                <label className="text-xl block mb-2" htmlFor="title">タイトル:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-xl block mb-2" htmlFor="date">日時:</label>
                <input
                    type="text"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-xl block mb-2" htmlFor="location">場所:</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-xl block mb-2" htmlFor="image">画像:</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-xl block mb-2" htmlFor="description">概要:</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                    rows="4"
                />
            </div>
            <div>
                <label className="text-xl block mb-2" htmlFor="price">金額:</label>
                <input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <button
                className="w-full inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
                type="submit"
            >
                {buttonText}
            </button>
        </form>
    );
}