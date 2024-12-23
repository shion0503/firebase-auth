import firebase_app from "../../../firebase-config"
import { Auth, getAuth, getIdToken } from 'firebase/auth';
import { getInstallations, getToken } from "firebase/installations"


export async function fetchWithFirebaseHeaders(request: Request) {
    const auth = getAuth(firebase_app);
    const installations = getInstallations(firebase_app);
    const headers = new Headers(request.headers);
    const [authIdToken, installationToken] = await Promise.all([
      getAuthIdToken(auth),
      getToken(installations),
    ]);
    headers.append("Firebase-Instance-ID-Token", installationToken);
    if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
    const newRequest = new Request(request, { headers });
    return await fetch(newRequest);
  }
  
  async function getAuthIdToken(auth: Auth) {
    await auth.authStateReady();
    if (!auth.currentUser) return;
      return await getIdToken(auth.currentUser);
  }
