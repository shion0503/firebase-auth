'use server'
import 'server-only'
import { firebaseConfig } from "../../../firebase-config";
import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
});

const storage = admin.storage();

export async function generateSignedUrl(filePath: string): Promise<string> {
    const bucket = storage.bucket();
  
    const file = bucket.file(filePath);
  
    // 署名付きURLを生成
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + (30 * 24 * 60 * 60 * 1000), // 1ヶ月
    });
  
    return signedUrl;
}