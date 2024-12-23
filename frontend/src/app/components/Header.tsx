'use client';

import { useState } from 'react';
import firebase_app from "../../../firebase-config";
import { getAuth, signOut } from 'firebase/auth';
import { FirebaseError } from '@firebase/util';
import { useRouter } from 'next/navigation';

export default function Header() {
  const auth = getAuth(firebase_app);
  const [error, setError] = useState<FirebaseError | undefined>(undefined);
  const router = useRouter();

  // ログアウト処理
  const logout = async () => {
    try {
      await signOut(auth); 
      router.push('/signin');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e); 
      }
    }
  };

  return (
    <header className="w-full bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">My Application</h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          ログアウト
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-4 text-center">
          エラー: {error.message}
        </p>
      )}
    </header>
  );
}
