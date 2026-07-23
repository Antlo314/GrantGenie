'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BRAND } from '../lib/brand';

type Props = {
  src?: string;
  size?: number;
  float?: boolean;
  className?: string;
  alt?: string;
};

export default function GenieAvatar({
  src = BRAND.assets.widget,
  size = 56,
  float = false,
  className = '',
  alt = 'Grant Genie',
}: Props) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const img = (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain drop-shadow-md ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );

  if (!float || reduce) return img;

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      className="inline-flex"
    >
      {img}
    </motion.div>
  );
}
