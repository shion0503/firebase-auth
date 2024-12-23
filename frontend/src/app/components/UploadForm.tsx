'use client'
import { useState } from 'react';
import { fileUpload } from '../lib/file-upload';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null); 
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please choose a file first.');
      return;
    }

    setUploading(true);

    fileUpload(file)


    try {
      const downloadURL = await fileUpload(file);

      setDownloadUrl(downloadURL);

    } catch (error) {
      console.error('Error during upload:', error);
      alert('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-gray-100 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">Upload Your File</h1>

        <div className="space-y-4">
          {/* ファイル選択 */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Choose a File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* アップロードボタン */}
          <div>
            <button
              onClick={handleFileUpload}
              disabled={uploading}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>

        {downloadUrl && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-green-600">File Uploaded Successfully!</h2>
            <p className="mt-2 text-sm text-gray-500">Download URL:</p>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {downloadUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
