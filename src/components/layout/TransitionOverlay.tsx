'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

type Phase = 'idle' | 'in' | 'out';

export function TransitionOverlay() {
  const { isTransitioning, transitionColor, onCurtainMidpoint, onCurtainComplete } = useTheme();
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    if (isTransitioning && phase === 'idle') {
      setPhase('in');
    }
  }, [isTransitioning, phase]);

  if (phase === 'idle' && !isTransitioning) return null;

  return (
    <AnimatePresence>
      {phase === 'in' && (
        <motion.div
          key="curtain-in"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            onCurtainMidpoint();
            setPhase('out');
          }}
          style={{ backgroundColor: transitionColor }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        />
      )}
      {phase === 'out' && (
        <motion.div
          key="curtain-out"
          initial={{ clipPath: 'inset(0 0% 0 0)' }}
          animate={{ clipPath: 'inset(0 0 0 100%)' }}
          transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            onCurtainComplete();
            setPhase('idle');
          }}
          style={{ backgroundColor: transitionColor }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
