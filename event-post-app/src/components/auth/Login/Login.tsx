'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/hooks/useAuth';
import Link from 'next/link';
import { TextInput } from '../../utils/TextInput';
import { SubmitButton } from '../../utils/SubmitButton';
import { Message } from '../../utils/Message';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { auth, login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      if (auth) {
        setMessage('ログインに成功しました');
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to log in');
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="p-8 rounded shadow-md bg-white w-full max-w-lg space-y-6 mt-6"
      >
        <TextInput
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton label="ログインする" />
      </form>

      <Link
        href="/users/new"
        className="mt-8 inline-flex items-center justify-center py-2 px-4 text-center bg-orange-400 text-white rounded-md shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300"
      >
        はじめての方はこちら
      </Link>

      <Message message={message} />
    </>
  );
}
