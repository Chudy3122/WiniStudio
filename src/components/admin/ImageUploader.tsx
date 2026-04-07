'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface Props {
  currentUrl?: string;
  onUpload: (url: string, pathname: string) => void;
  label?: string;
}

export function ImageUploader({ currentUrl, onUpload, label = 'Zdjęcie' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl || '');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      setProgress(80);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      setProgress(100);
      setPreview(data.url);
      onUpload(data.url, data.pathname);
    } catch (e: any) {
      setError(e.message || 'Błąd przesyłania pliku');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#6868a0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        {label}
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1px dashed #3a3a5a',
          borderRadius: '2px',
          padding: '1.5rem',
          cursor: 'pointer',
          textAlign: 'center',
          backgroundColor: '#0d0d1a',
          transition: 'border-color 0.2s',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#9090c0')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#3a3a5a')}
      >
        {/* Progress bar */}
        {uploading && progress > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            width: `${progress}%`,
            backgroundColor: '#9090c0',
            transition: 'width 0.3s ease',
          }} />
        )}

        {uploading ? (
          <p style={{ color: '#9090c0', fontSize: '0.8rem' }}>Przesyłanie... {progress}%</p>
        ) : (
          <p style={{ color: '#6868a0', fontSize: '0.8rem' }}>
            Przeciągnij plik lub <span style={{ color: '#9090c0', textDecoration: 'underline' }}>kliknij aby wybrać</span>
            <br />
            <span style={{ fontSize: '0.7rem', color: '#4a4a6a' }}>JPG, PNG, WebP, AVIF — max 50MB</span>
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/avif"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <p style={{ color: '#cc3333', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>
      )}

      {/* Preview */}
      {preview && (
        <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
          <Image
            src={preview}
            alt="Preview"
            width={200}
            height={133}
            style={{ objectFit: 'cover', display: 'block', border: '1px solid #2a2a3a' }}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setPreview(''); onUpload('', ''); }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: 'none',
              color: '#cc3333',
              cursor: 'pointer',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
