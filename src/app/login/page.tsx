'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase 환경변수가 설정되지 않았습니다.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    else router.push('/admin');
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-brand-primary py-3 font-bold text-white disabled:bg-gray-400">
          {loading ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </div>
  );
}
