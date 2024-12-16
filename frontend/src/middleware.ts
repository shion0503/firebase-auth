import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import firebase_app from "../firebase-config"; 
import { getAuth } from 'firebase/auth';


export async function middleware(request: NextRequest) {
    const auth = getAuth(firebase_app);
}


export const config = {
    matcher: ['/'],
  };
   