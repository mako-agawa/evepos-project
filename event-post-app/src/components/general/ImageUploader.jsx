import React, { useState } from "react";
import imageCompression from "browser-image-compression";

const ImageUploader = () => {
  const [imageFile, setImageFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 画像圧縮のオプション設定
    const options = {
      maxSizeMB: 1,               // 1MB以下に圧縮
      maxWidthOrHeight: 800,      // 最大幅または高さを800pxに制限
      useWebWorker: true,         // Web Workerを使用して非同期処理
    };

    try {
      // 圧縮実行
      const compressed = await imageCompression(file, options);
      setCompressedFile(compressed);

      // 圧縮後のファイル情報を表示（サイズ確認）
      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Compressed size: ${(compressed.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.error("画像圧縮エラー:", error);
    }
  };

  const handleUpload = async () => {
    if (!compressedFile) return;

    const formData = new FormData();
    formData.append("image", compressedFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("アップロード失敗");

      console.log("アップロード成功!");
    } catch (error) {
      console.error("アップロードエラー:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        画像をアップロード
      </button>
    </div>
  );
};

export default ImageUploader;