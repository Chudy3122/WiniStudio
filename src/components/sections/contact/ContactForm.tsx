'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactSchema, type ContactFormData } from '@/lib/validations';
import { useLang } from '@/context/LangContext';

export function ContactForm() {
  const { t } = useLang();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-0 py-3 text-sm bg-transparent border-b focus:outline-none transition-colors duration-300 placeholder-transparent';

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="font-cormorant font-light tracking-wider"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'var(--color-text)' }}
          >
            {t('contact.title')}
          </h1>
          <p
            className="mt-4 text-sm tracking-wide"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('contact.description')}
          </p>
          <div
            className="h-px mt-8 mb-12"
            style={{ backgroundColor: 'var(--color-border)' }}
          />
        </motion.div>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <CheckCircle size={48} style={{ color: 'var(--color-accent)' }} />
            <p className="text-lg" style={{ color: 'var(--color-text)' }}>
              {t('contact.success')}
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="text-sm underline mt-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Wyślij kolejną wiadomość
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Name & Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label
                  className="text-xs tracking-widest uppercase block mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('contact.name')}
                </label>
                <input
                  {...register('name')}
                  placeholder={t('contact.namePlaceholder')}
                  className="w-full px-0 py-3 text-sm bg-transparent border-b focus:outline-none transition-colors duration-300"
                  style={{
                    borderColor: errors.name ? 'var(--color-accent)' : 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                {errors.name && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-accent)' }}>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="text-xs tracking-widest uppercase block mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('contact.email')}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder={t('contact.emailPlaceholder')}
                  className="w-full px-0 py-3 text-sm bg-transparent border-b focus:outline-none transition-colors duration-300"
                  style={{
                    borderColor: errors.email ? 'var(--color-accent)' : 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                {errors.email && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-accent)' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="text-xs tracking-widest uppercase block mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {t('contact.subject')}
              </label>
              <input
                {...register('subject')}
                placeholder={t('contact.subjectPlaceholder')}
                className="w-full px-0 py-3 text-sm bg-transparent border-b focus:outline-none transition-colors duration-300"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div>
              <label
                className="text-xs tracking-widest uppercase block mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {t('contact.message')}
              </label>
              <textarea
                {...register('message')}
                rows={6}
                placeholder={t('contact.messagePlaceholder')}
                className="w-full px-0 py-3 text-sm bg-transparent focus:outline-none transition-colors duration-300 resize-none border-b"
                style={{
                  borderColor: errors.message
                    ? 'var(--color-accent)'
                    : 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              {errors.message && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-accent)' }}>
                  {errors.message.message}
                </p>
              )}
            </div>

            {status === 'error' && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--color-accent)' }}
              >
                <AlertCircle size={16} /> {t('contact.error')}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-3 px-8 py-3 text-sm tracking-widest uppercase border transition-all duration-300 disabled:opacity-50 hover:scale-105"
              style={{
                borderColor: 'var(--color-accent)',
                color: 'var(--color-accent)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading') {
                  const btn = e.currentTarget;
                  btn.style.backgroundColor = 'var(--color-accent)';
                  btn.style.color = 'var(--color-bg)';
                }
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--color-accent)';
              }}
            >
              <Send size={14} />
              {status === 'loading' ? t('contact.sending') : t('contact.send')}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
