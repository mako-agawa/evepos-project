import Image from 'next/image';

const Thumbnail = ({ imageUrl }) => {
  return (
    <Image 
      src={imageUrl}  // 例: "http://api.evepos.net/rails/active_storage/blobs/redirect/xxx/image.png"
      width={500}
      height={300}
      alt="ユーザーのサムネイル"
      priority  // 重要な画像なら優先的にロード
    />
  );
};

export default Thumbnail;