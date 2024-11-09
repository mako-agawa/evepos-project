import React from 'react'

const logout = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            
            <h1 className='text-4xl font-bold'>ログアウト</h1>
            <div className='py-24'>
                <h1 className='text-2xl pb-8'>name: 山田 太郎</h1>
                <h1 className='text-2xl pb-10'>email: ymadadada@ggg.com</h1>

                <p className='text-xl pb-12 text-gray-500'>※上記のアカウントでログアウトします.</p>

            <button className="w-full text-white bg-gray-400 hover:bg-gray-500 rounded p-3 text-xl" type="submit">ログインする</button>
            </div>
        </div>
    )
}

export default logout