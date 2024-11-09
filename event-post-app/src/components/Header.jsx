import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center bg-orange-400 h-20 px-24 '>
    <Link href="/users" className="text-white text-3xl font-bold hover:cursor">いべぽす</Link>
    <p className='text-2xl text-white'>menu</p>
    </div>
  )
}

export default Header