'use client';

import { useEffect, useState, use } from "react"; // useを追加
import { useRouter } from "next/navigation"; // useRouterを使ってidを取得

export default function EditUser({ params }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        thumbnail: '',
        description: '',
    });
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [message, setMessage] = useState('');
    const [error, setError] = useState(null); // エラーステートを追加
    const [loading, setLoading] = useState(true); // ローディングステートを追加
    const router = useRouter(); // useRouterを使用してリダイレクトを行うためのルーター

    // paramsを非同期にアンラップ
    const resolvedParams = use(params);
    const userId = resolvedParams.id;

    // ユーザー情報を取得してフォームに初期値として設定
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await fetch(`${API_URL}/users/${userId}`); // userIdを使ってAPIからユーザー情報を取得
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setFormData({
                name: data.name,
                email: data.email,
                password: '', // パスワードはセキュリティのため空にしておく
                password_confirmation: '', // パスワードはセキュリティのため空にしておく
                thumbnail: data.thumbnail,
                description: data.description,
            });
            setLoading(false); // データが取得できたらローディングをfalseに
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
    
        fetchUser();
    }, [userId, API_URL]);

    // ユーザー編集時の送信処理
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userPayload = {
            user: { // パラメータをuserオブジェクト内にネスト
                name: formData.name,
                email: formData.email,
                password: formData.password, // パスワードが空であれば更新されない場合もある
                password_confirmation: formData.password_confirmation, // パスワードが空であれば更新されない場合もある
                thumbnail: formData.thumbnail,
                description: formData.description,
            }
        };

        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT', // PUTリクエストでユーザー情報を更新
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPayload), // userオブジェクトを送信
        });

        if (res.ok) {
            setMessage('User updated successfully!');
            router.push('/users'); // 更新成功後にリダイレクト
        } else {
            const data = await res.json();
            setMessage(`Update failed: ${data.message}`);
        }
    };

    // ローディングやエラーの処理
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold p-8">ユーザー編集</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Leave empty to keep unchanged"
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="password_confirmation">Password_confirmation:</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        placeholder="Leave empty to keep unchanged"
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="thumbnail">Thumbnail URL:</label>
                    <input
                        type="text"
                        id="thumbnail"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                        rows="4"
                    />
                </div>
                <button className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded p-3 text-xl" type="submit">編集する</button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}