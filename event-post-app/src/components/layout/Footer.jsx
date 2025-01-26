import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='flex flex-col items-center bg-slate-500 h-56 py-8'>
      <h1 className='text-xl text-white'>お問い合わせ</h1>
      <p className='text-xl text-white'>ヘルプ</p>
      <Link href="/users" className="text-white text-xl font-bold hover:cursor">
              ユーザー管理
            </Link>
    </div>
  )
}

export default Footer