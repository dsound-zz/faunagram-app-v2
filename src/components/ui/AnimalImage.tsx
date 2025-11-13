import { useState } from 'react';
import { cn } from '../../lib/utils';

interface AnimalImageProps {
  src?: string;
  alt: string;
  className?: string;
  animalName?: string;
}

export function AnimalImage({ src, alt, className, animalName }: AnimalImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate placeholder based on animal name
  const getPlaceholderEmoji = (name?: string) => {
    if (!name) return '🐾';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hawk') || lowerName.includes('eagle') || lowerName.includes('owl')) return '🦅';
    if (lowerName.includes('coyote') || lowerName.includes('fox') || lowerName.includes('wolf')) return '🦊';
    if (lowerName.includes('raccoon')) return '🦝';
    if (lowerName.includes('deer')) return '🦌';
    if (lowerName.includes('bat')) return '🦇';
    if (lowerName.includes('whale') || lowerName.includes('seal')) return '🐋';
    if (lowerName.includes('turtle')) return '🐢';
    if (lowerName.includes('salamander') || lowerName.includes('frog')) return '🐸';
    if (lowerName.includes('bird') || lowerName.includes('sparrow') || lowerName.includes('goose')) return '🐦';
    if (lowerName.includes('rat') || lowerName.includes('mouse')) return '🐭';
    if (lowerName.includes('crab')) return '🦀';
    return '🐾';
  };

  const placeholderEmoji = getPlaceholderEmoji(animalName || alt);

  if (!src || imageError) {
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center',
          className
        )}
      >
        <div className="text-center">
          <div className="text-6xl mb-2">{placeholderEmoji}</div>
          <p className="text-xs text-gray-600 font-medium">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={cn(
            'bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse',
            className
          )}
        >
          <div className="text-4xl">{placeholderEmoji}</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(isLoading && 'hidden', className)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}

