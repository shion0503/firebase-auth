'use client';

import React, { useState, ChangeEvent, useRef } from 'react';
import firebase_app from "../../../firebase-config"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Form = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    try {
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'files'), {
        fileName: file.name,
        fileUrl: downloadURL,
        createdAt: new Date(),
      });

      router.push('/');
    } catch (error) {
      console.error('ファイルのアップロードに失敗しました:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    <div style={styles.container}>
      <input
        type="file"
        accept=".pptx"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={styles.fileInput}
        id="pptx-upload"
      />
      <label htmlFor="pptx-upload" style={styles.label}>
        <button style={styles.button}>
          PPTXファイルを選択
        </button>
      </label>

      {file && (
        <div style={styles.fileInfo}>
          <p>選択されたファイル: {file.name}</p>
        </div>
      )}
      </div>
      <div>
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          ...styles.uploadButton,
          backgroundColor: uploading ? '#ccc' : '#1976d2',
        }}
      >
        {uploading ? 'アップロード中...' : 'アップロード'}
      </button>
    </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    marginTop: '50px',
    borderRadius: '10px',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontFamily: '"Roboto", sans-serif',
    position: 'relative', // 修正: 親コンテナに相対位置を設定
  },
  label: {
    display: 'inline-block',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',  // ボタンのみにクリックエリアを限定
  },
  button: {
    padding: '12px 24px',
    border: '2px solid #1976d2',
    backgroundColor: 'white',
    color: '#1976d2',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  fileInfo: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#333',
    textAlign: 'left',
  },
  uploadButton: {
    marginTop: '20px',
    padding: '12px 24px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
    outline: 'none',
  },
};

export default Form;
