import React from "react";
import sanitizeHtml from "sanitize-html"; // XSS防止用

/**
 * サニタイズしたHTMLの表示
 * @param {string} text ユーザーが入力したテキスト
 * @returns JSX
 */
const RenderDescription = ({ text }) => {
  // リンクを検出し、リンクタグとしてフォーマット
  const withLinks = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>'
  );

  // サニタイズして安全なHTMLを生成
  const sanitizedHtml = sanitizeHtml(withLinks, {
    allowedTags: ["a"], // 許可するタグ
    allowedAttributes: {
      a: ["href", "target", "rel", "class"], // 許可する属性
    },
  });

  return (
    <div
      className="prose text-sm" // Tailwind CSSの`prose`で見た目を整える
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default RenderDescription;