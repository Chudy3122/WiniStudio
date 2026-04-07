'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { portfolioItemSchema, type PortfolioItemFormData } from '@/lib/validations';
import { ImageUploader } from './ImageUploader';
import type { PortfolioItem } from '@prisma/client';

interface Props {
  item?: PortfolioItem;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  backgroundColor: '#0d0d1a',
  border: '1px solid #2a2a3a',
  color: '#e0e0f0',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  letterSpacing: '0.2em',
  color: '#6868a0',
  textTransform: 'uppercase',
  marginBottom: '0.375rem',
};

function tabBtn(active: boolean): React.CSSProperties {
  return {
    padding: '0.4rem 1rem',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    border: `1px solid ${active ? '#9090c0' : '#2a2a3a'}`,
    color: active ? '#9090c0' : '#6868a0',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  };
}

// Subcomponent: image field with upload/URL tabs
function ImageField({
  label,
  value,
  onChange,
  onBlobKey,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onBlobKey?: (key: string) => void;
}) {
  const hasValue = !!value;
  // Determine initial tab: if existing value looks like a blob URL → upload tab, otherwise url tab
  const [tab, setTab] = useState<'upload' | 'url'>(
    hasValue && !value.includes('blob.vercel') ? 'url' : 'upload'
  );
  const [urlInput, setUrlInput] = useState(tab === 'url' ? value : '');
  const [urlPreview, setUrlPreview] = useState(tab === 'url' ? value : '');

  const handleUrlBlur = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setUrlPreview(trimmed);
      onChange(trimmed);
    }
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '0.75rem' }}>
        <button type="button" onClick={() => setTab('upload')} style={tabBtn(tab === 'upload')}>
          Prześlij plik
        </button>
        <button type="button" onClick={() => setTab('url')} style={{ ...tabBtn(tab === 'url'), marginLeft: '-1px' }}>
          Wklej URL
        </button>
      </div>

      {tab === 'upload' ? (
        <ImageUploader
          currentUrl={tab === 'upload' ? value : ''}
          label=""
          onUpload={(url, pathname) => {
            onChange(url);
            if (onBlobKey) onBlobKey(pathname);
          }}
        />
      ) : (
        <div>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onBlur={handleUrlBlur}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUrlBlur(); } }}
            placeholder="https://przyklad.com/zdjecie.jpg"
            style={inputStyle}
          />
          <p style={{ fontSize: '0.65rem', color: '#4a4a6a', marginTop: '0.25rem' }}>
            Wklej bezpośredni link do zdjęcia. Naciśnij Enter lub kliknij poza polem aby podejrzeć.
          </p>
          {urlPreview && (
            <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlPreview}
                alt="Podgląd"
                style={{ maxWidth: '200px', maxHeight: '133px', objectFit: 'cover', display: 'block', border: '1px solid #2a2a3a' }}
                onError={() => setUrlPreview('')}
              />
              <button
                type="button"
                onClick={() => { setUrlPreview(''); setUrlInput(''); onChange(''); }}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  backgroundColor: 'rgba(0,0,0,0.8)', border: 'none',
                  color: '#cc3333', cursor: 'pointer', width: '20px', height: '20px',
                  fontSize: '0.8rem',
                }}
              >×</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PortfolioForm({ item }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<PortfolioItemFormData>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      title: item?.title ?? '',
      titleEn: item?.titleEn ?? '',
      description: item?.description ?? '',
      descriptionEn: item?.descriptionEn ?? '',
      category: item?.category ?? 'PHOTOGRAPHY',
      imageUrl: item?.imageUrl ?? '',
      blobKey: item?.blobKey ?? '',
      videoUrl: item?.videoUrl ?? '',
      thumbnail: item?.thumbnail ?? '',
      tags: item?.tags ?? [],
      featured: item?.featured ?? false,
      published: item?.published ?? false,
      sortOrder: item?.sortOrder ?? 0,
    },
  });

  const category = watch('category');
  const [tagsInput, setTagsInput] = useState(item?.tags?.join(', ') ?? '');

  const onSubmit = async (data: PortfolioItemFormData) => {
    setSaving(true);
    setError('');
    try {
      const url = item ? `/api/portfolio/${item.id}` : '/api/portfolio';
      const method = item ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Błąd zapisu');
      router.push('/wini-admin/portfolio');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm('Na pewno usunąć tę pozycję? Tej operacji nie można cofnąć.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/portfolio/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Błąd usuwania');
      router.push('/wini-admin/portfolio');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '800px' }}>

      {/* Titles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Tytuł (PL) *</label>
          <input {...register('title')} style={inputStyle} />
          {errors.title && <p style={{ color: '#cc3333', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.title.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Tytuł (EN)</label>
          <input {...register('titleEn')} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Opis (PL)</label>
          <textarea {...register('description')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>Opis (EN)</label>
          <textarea {...register('descriptionEn')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Kategoria *</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select {...field} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="PHOTOGRAPHY">Fotografia</option>
              <option value="VIDEO">Wideo</option>
              <option value="THREE_D">Projekty 3D</option>
            </select>
          )}
        />
      </div>

      {/* Image — upload or URL */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageField
              label="Zdjęcie główne"
              value={field.value || ''}
              onChange={(url) => field.onChange(url)}
              onBlobKey={(key) => setValue('blobKey', key)}
            />
          )}
        />
      </div>

      {/* Video URL */}
      {(category === 'VIDEO' || category === 'THREE_D') && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Link do wideo (YouTube lub bezpośredni URL)</label>
          <input
            {...register('videoUrl')}
            placeholder="https://www.youtube.com/watch?v=..."
            style={inputStyle}
          />
          <p style={{ fontSize: '0.65rem', color: '#4a4a6a', marginTop: '0.25rem' }}>
            Film będzie odtwarzany bezpośrednio na stronie po kliknięciu.
          </p>
        </div>
      )}

      {/* Custom thumbnail for VIDEO */}
      {category === 'VIDEO' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Controller
            name="thumbnail"
            control={control}
            render={({ field }) => (
              <ImageField
                label="Miniatura (opcjonalna — domyślnie pobierana z YouTube)"
                value={field.value || ''}
                onChange={(url) => field.onChange(url)}
              />
            )}
          />
        </div>
      )}

      {/* Tags */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Tagi (oddzielone przecinkami)</label>
        <input
          value={tagsInput}
          onChange={(e) => {
            setTagsInput(e.target.value);
            const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
            setValue('tags', tags);
          }}
          placeholder="portret, plener, ślub"
          style={inputStyle}
        />
      </div>

      {/* Sort order */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '200px' }}>
        <label style={labelStyle}>Kolejność wyświetlania</label>
        <input
          {...register('sortOrder', { valueAsNumber: true })}
          type="number"
          min="0"
          style={inputStyle}
        />
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#e0e0f0', fontSize: '0.85rem' }}>
          <Controller name="featured" control={control} render={({ field }) => (
            <input type="checkbox" checked={field.value} onChange={field.onChange}
              style={{ accentColor: '#9090c0', width: '16px', height: '16px' }} />
          )} />
          Wyróżnione
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#e0e0f0', fontSize: '0.85rem' }}>
          <Controller name="published" control={control} render={({ field }) => (
            <input type="checkbox" checked={field.value} onChange={field.onChange}
              style={{ accentColor: '#9090c0', width: '16px', height: '16px' }} />
          )} />
          Opublikowane (widoczne publicznie)
        </label>
      </div>

      {error && <p style={{ color: '#cc3333', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="submit" disabled={saving}
          style={{ padding: '0.75rem 2rem', backgroundColor: '#9090c0', color: '#0a0a0c', border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.75rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Zapisywanie...' : item ? 'Zapisz zmiany' : 'Dodaj pozycję'}
        </button>
        <button type="button" onClick={() => router.back()}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #3a3a5a',
            color: '#6868a0', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Anuluj
        </button>
        {item && (
          <button type="button" onClick={handleDelete} disabled={deleting}
            style={{ marginLeft: 'auto', padding: '0.75rem 1.5rem', backgroundColor: 'transparent',
              border: '1px solid #cc3333', color: '#cc3333', cursor: deleting ? 'not-allowed' : 'pointer',
              fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: deleting ? 0.7 : 1 }}>
            {deleting ? 'Usuwanie...' : 'Usuń pozycję'}
          </button>
        )}
      </div>
    </form>
  );
}
