import firebase_app from "../../../firebase-config";
import { getStorage } from 'firebase/storage';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "firebase/auth";



export async function fileUpload(file: File) {
    const auth = getAuth();
    const storage = getStorage(firebase_app)

    if (!auth.currentUser) {
        throw new Error("User is not authenticated");
    }

    try {
        const storageRef = ref(storage, 'uploads/' + uuidv4() + '-' + file.name);

        const metadata = {
            customMetadata: {
                ownerUid: auth.currentUser.uid,
            },
        };

        const data = await file.arrayBuffer();
        const uploadTask = uploadBytesResumable(storageRef, data, metadata);

        return new Promise<string>((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,  // snapshot
                (error) => {
                    console.error('Upload failed:', error);
                    reject('File upload failed');
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject('Failed to get download URL');
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Internal Server Error');
    }
}

