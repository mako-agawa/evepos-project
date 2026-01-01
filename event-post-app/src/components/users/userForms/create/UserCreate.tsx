'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom';
import { compressAndConvertToPNG } from '@/utils/compressAndConvertToPNG'; // 追加
import Image from 'next/image';
import { pageModeAtom } from '@/atoms/authAtom';
import { fetchAPI } from '@/utils/fetchAPI';

export default function UserCreate() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    description: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [auth, setAuth] = useAtom(authAtom);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [, setPageMode] = useAtom(pageModeAtom);


  // 入力変更ハンドラー
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 画像選択時のハンドラー
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const processedFile = await compressAndConvertToPNG(file); // ユーティリティ関数を呼び出す
      setThumbnail(processedFile);
      setThumbnailPreview(URL.createObjectURL(processedFile));
      console.log('Processed file (PNG):', processedFile);
    } catch (error) {
      setMessage('画像の圧縮または変換に失敗しました。');
    }
  };

  // ユーザー登録時のハンドラー
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userPayload = new FormData();
    userPayload.append('user[name]', formData.name);
    userPayload.append('user[email]', formData.email);
    userPayload.append('user[password]', formData.password);
    userPayload.append(
      'user[password_confirmation]',
      formData.password_confirmation
    );
    userPayload.append('user[description]', formData.description);

    if (thumbnail) {
      userPayload.append('user[thumbnail]', thumbnail);
    }

    try {
      const res = await fetchAPI('/users', {
        method: 'POST',
        body: userPayload,
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setAuth({
          isLoggedIn: true,
          currentUser: data.user,
          token: data.token,
        });
        setPageMode('index');
        setMessage('登録に成功しました！');
        router.push('/');
        router.refresh();
      } else {
        const errorResponse = await res.json();
        setMessage(
          errorResponse.errors
            ? errorResponse.errors.join(', ')
            : '登録に失敗しました。'
        );
      }
    } catch (error) {
      console.error('登録エラー:', error);
      setMessage('登録中にエラーが発生しました。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  h-full mx-auto px-4 py-16">
      <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">
        Register
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 mx-auto rounded shadow-md w-full max-w-lg"
      >
        {/* 各入力フィールド */}
        <div className="mb-3">
          <label htmlFor="name">名前:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email">Eメール:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password_confirmation">パスワード(確認用):</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="thumbnail">プロフィール画像:</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
          {thumbnailPreview ? (
            <div className="mt-2 flex justify-center">
              <Image
                src={thumbnailPreview}
                alt="選択した画像"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          ) : (
            <div className="mt-2 flex justify-center">
              <Image
                src="/user.svg"
                alt="デフォルト画像"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="description">メッセージ:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>
        <button
          className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl"
          type="submit"
        >
          登録する
        </button>
      </form>
      {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
    </div>
  );
}
