// components/Upload.tsx
import { useState } from 'react';
import { client } from '../utils/client';

const Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset states
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      // Validate file
      if (!validateFile(file)) {
        throw new Error('Invalid file type or size');
      }

      // Log environment variables (redacted)
      console.log('ProjectID exists:', !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
      console.log('Token exists:', !!process.env.NEXT_PUBLIC_SANITY_TOKEN);

      const result = await client.assets.upload('file', file, {
        contentType: file.type,
        filename: file.name,
      });

      console.log('Upload successful:', result?._id);
      setUploadProgress(100);
      return result;

    } catch (error: unknown) { // Explicitly type error as unknown
      console.error('Upload failed:', error);
      
      // Type guard for Error object
      if (error instanceof Error) {
        setUploadError(error.message);
      } else {
        setUploadError('Upload failed - please try again');
      }
      return null;

    } finally {
      setIsUploading(false);
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  return (
    <div>
      <input 
        type="file"
        onChange={handleUpload}
        disabled={isUploading}
      />
      {isUploading && (
        <div>Uploading: {uploadProgress}%</div>
      )}
      {uploadError && (
        <div className="error">{uploadError}</div>
      )}
    </div>
  );
};

export default Upload;