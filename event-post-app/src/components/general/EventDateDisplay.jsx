"use client";

// 日付データ取得 (月/日)
export function getEventDate(dateString) {
  const dateObj = new Date(dateString);
  const options = {
    timeZone: "Asia/Tokyo",
    month: "2-digit",
    day: "2-digit",
  };
  return dateObj.toLocaleString("ja-JP", options); // "01/30"
}

// 曜日データ取得
export function getEventWeekday(dateString) {
  const dateObj = new Date(dateString);
  const options = {
    timeZone: "Asia/Tokyo",
    weekday: "short", // 短い形式 (例: 月, 火)
  };
  return dateObj.toLocaleString("ja-JP", options); // "木"
}

// 時刻データ取得 (hh:mm)
export function getEventTime(dateString) {
  const dateObj = new Date(dateString);
  const options = {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24時間制
  };
  return dateObj.toLocaleString("ja-JP", options); // "15:20"
}