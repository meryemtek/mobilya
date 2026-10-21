import React from 'react';
import { Armchair } from 'lucide-react';

interface PlaceholderImageProps {
  text?: string;
  className?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  text = 'ABC Mobilya',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 text-stone-400 p-6 text-center select-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fbf9f5 0%, #eee8df 100%)',
        color: '#8c827a',
      }}
    >
      <Armchair size={36} strokeWidth={1.5} style={{ marginBottom: '8px', color: '#c59b27' }} />
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.05em' }}>
        {text}
      </span>
    </div>
  );
};
