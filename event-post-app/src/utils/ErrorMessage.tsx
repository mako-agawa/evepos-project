'use client';

export default function ErrorMessage({ message }) {
  return <div className="text-red-500 text-lg">エラー: {message}</div>;
}
