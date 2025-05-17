import imageCompression from 'browser-image-compression';

/**
 * 画像を圧縮し、PNG形式に変換する関数
 * @param {File} file - 圧縮および変換する元の画像ファイル
 * @param {Object} options - 圧縮オプション
 * @returns {Promise<File>} - 圧縮後のPNG形式の画像ファイル
 */
export const compressAndConvertToPNG = async (file, options = {}) => {
  // デフォルトオプション
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    // 画像を圧縮
    const compressedFile = await imageCompression(file, {
      ...defaultOptions,
      ...options,
    });

    // PNGに変換
    const pngFile = await convertToPNG(compressedFile);
    return pngFile;
  } catch (error) {
    console.error('画像圧縮または変換エラー:', error);
    throw error;
  }
};

/**
 * 圧縮された画像ファイルをPNG形式に変換する関数
 * @param {File} imageFile - 圧縮された画像ファイル
 * @returns {Promise<File>} - PNG形式の画像ファイル
 */
const convertToPNG = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // PNGに変換
        canvas.toBlob((blob) => {
          if (blob) {
            const pngFile = new File(
              [blob],
              `${imageFile.name.split('.')[0]}.png`,
              { type: 'image/png' }
            );
            resolve(pngFile);
          } else {
            reject(new Error('PNG変換に失敗しました'));
          }
        }, 'image/png');
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};
