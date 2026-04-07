'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginFormData } from '@/lib/validations';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/wini-admin/dashboard');
      } else {
        setError('Nieprawidłowe dane logowania.');
      }
    } catch {
      setError('Błąd połączenia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        width: '100%',
        maxWidth: '360px',
        padding: '2rem',
        backgroundColor: '#141420',
        border: '1px solid #2a2a3a',
        borderRadius: '4px',
      }}
    >
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            color: '#6868a0',
            textTransform: 'uppercase',
          }}
        >
          Dostęp zastrzeżony
        </p>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          {...register('username')}
          placeholder="Użytkownik"
          autoComplete="username"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'transparent',
            border: '1px solid #2a2a3a',
            color: '#e0e0f0',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          {...register('password')}
          type="password"
          placeholder="Hasło"
          autoComplete="current-password"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'transparent',
            border: '1px solid #2a2a3a',
            color: '#e0e0f0',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
      {error && (
        <p style={{ color: '#cc3333', fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#9090c0',
          color: '#0a0a0c',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Logowanie...' : 'Zaloguj'}
      </button>
    </form>
  );
}
