// app/page.tsx
"use client";
import UploadForm from "@/app/components/UploadForm";
import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import firebase_app from "../../firebase-config";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const auth = getAuth(firebase_app);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <UploadForm />
    </div>
  );
}