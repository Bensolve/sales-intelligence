'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading, signUp, signIn, logOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      setMessage('Account created successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage(`Sign Up Error: ${errorMsg}`);
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      setMessage('Signed in successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setMessage(`Sign In Error: ${errorMsg}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-900">Loading Auth status...</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-white text-slate-900 font-sans max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Sale Intel - Auth Test</h1>

      {user ? (
        <div className="space-y-4">
          <p className="p-4 bg-green-50 border border-green-300 rounded text-green-800">
            Logged in as: <strong>{user.email}</strong>
          </p>
          <button
            onClick={() => logOut()}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      ) : (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-slate-900 bg-white"
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-slate-900 bg-white"
              placeholder="••••••••"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSignUp}
              className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleSignIn}
              className="flex-1 py-2 bg-slate-800 text-white font-semibold rounded hover:bg-slate-900"
            >
              Sign In
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className="mt-4 p-3 bg-slate-100 border border-slate-300 rounded text-sm text-slate-900">
          {message}
        </p>
      )}
    </main>
  );
}