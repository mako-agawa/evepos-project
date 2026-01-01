'use client';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { fetchAPI } from '@/utils/fetchAPI';
import { Button } from '@/components/commons/button';
import { Label } from '@/components/commons/label';
import { Calendar } from '@/components/commons/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/commons/popover';
import { CalendarIcon } from 'lucide-react';
import InputDateTimeForm from '@/components/events/utils/InputDateTimeForm';
import Image from 'next/image';
import { compressAndConvertToPNG } from '@/utils/compressAndConvertToPNG';

import 'react-clock/dist/Clock.css';

export default function EventEdit() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;
  // hooksにまとめる
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(new Date());
  // `react-hook-form` のセットアップ
  const { control, setValue, handleSubmit, register, reset } = useForm({
    defaultValues: {
      title: '',
      date: '',
      location: '',
      description: '',
      price: '',
    },
  });

  // イベントデータを取得
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await fetchAPI(`/events/${eventId}`);
        if (data) {
          reset({
            title: data.title || '',
            date: data.date || '',
            location: data.location || '',
            description: data.description || '',
            price: data.price || '',
          });
          // 日付をセット
          const eventDate = data.date ? parseISO(data.date) : null;
          setDate(eventDate);

          // 既存の時間をセット（date から時間部分だけ取得）
          if (eventDate) {
            setTime(new Date(eventDate));
          }

          setImagePreview(data.image_url || null);
        }
      } catch (error) {
        console.error('イベントの取得に失敗しました:', error);
        setMessage('イベントの取得に失敗しました');
      }
    };
    fetchEvent();
  }, [eventId, reset]);

  // `date` と `time` を結合して `formData.date` に保存
  useEffect(() => {
    if (date && time) {
      const formattedTime = format(time, 'HH:mm');
      const combinedDateTime = `${format(date, 'yyyy-MM-dd')}T${formattedTime}:00`;
      setValue('date', combinedDateTime);
    }
  }, [date, time, setValue]);

  // 画像が変更されたときの処理
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const processedFile = await compressAndConvertToPNG(file);
      setImageFile(processedFile);
      setImagePreview(URL.createObjectURL(processedFile));
    } catch (error) {
      setMessage('画像の圧縮または変換に失敗しました。');
    }
  };

  // フォーム送信処理
  // フォーム送信処理
  const onSubmit = async (data) => {
    // fetchAPI内でトークン取得は行われるので、ここでの手動チェックは必須ではありませんが
    // 念のため残してもOKです
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('認証エラー: ログインしてください');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('date', data.date);
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('price', data.price);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // 修正: fetch ではなく fetchAPI を使用する
      // fetchAPI なら BASE_URL (localhost:3001...) が自動で付与されます
      await fetchAPI(`/events/${eventId}`, {
        method: 'PATCH', // Railsのupdateは通常 PATCH または PUT
        body: formData,  // fetchAPIがFormDataを自動判別して適切なヘッダー処理をしてくれます
      });

      // fetchAPI はエラー時に throw するので、ここに来た時点で成功確定
      // if (!response.ok) ... のチェックは不要

      setMessage('イベントが正常に更新されました！');
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message || 'イベントの更新に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-gray-500 border-b-2 border-orange-400 px-6 text-2xl mb-8">
        Edit Event
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 rounded shadow-md bg-white w-full max-w-lg pb-12"
      >
        <div>
          <Label htmlFor="title">タイトル:</Label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* 日付・時間入力 */}
        <div className="flex gap-2">
          {/* 日付ピッカー */}
          <div className="my-4 w-1/2">
            <Label htmlFor="date">日付:</Label>
            <Controller
              name="date"
              control={control}
              render={() => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      {date
                        ? format(new Date(date), 'yyyy/MM/dd')
                        : '日付を選択'}
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

          {/* 開始時間ピッカー */}
          <div className="my-4 w-1/2">
            <Label htmlFor="time">開始時間:</Label>
            <InputDateTimeForm selectedTime={time} onChange={setTime} />
          </div>
        </div>

        {/* 画像アップロード */}
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
            {...register('location')}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">概要:</Label>
          <textarea
            id="description"
            {...register('description')}
            className="w-full border rounded p-2"
            rows="4"
            required
          />
        </div>

        <div>
          <Label htmlFor="price">金額:</Label>
          <input
            id="price"
            {...register('price')}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full mt-8 bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-md"
        >
          更新する
        </Button>
      </form>
      {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
    </div>
  );
}
