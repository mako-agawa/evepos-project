import React from "react";
import sanitizeHtml from "sanitize-html"; // XSS防止用

/**
 * サニタイズしたHTMLの表示
 * @param {string} text ユーザーが入力したテキスト
 * @returns JSX
 */
const RenderDescription = ({ text }) => {
  // 1. 改行を <br> に変換
  let formattedText = text.replace(/\n/g, '<br />');

  // 2. リンクを検出し、リンクタグに変換
  formattedText = formattedText.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>'
  );

  // 3. サニタイズして安全なHTMLを生成
  const sanitizedHtml = sanitizeHtml(formattedText, {
    allowedTags: ["br", "a"], // 許可するタグに <br> も追加
    allowedAttributes: {
      a: ["href", "target", "rel", "class"], // 許可する属性
    },
  });

  return (
    <div
      className="prose text-xs" // Tailwind CSSの`prose`で見た目を整える
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} // 正しい形式
    />
  );
};

export default RenderDescription;