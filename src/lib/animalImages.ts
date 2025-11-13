/**
 * Utility functions for fetching animal images from external APIs
 * These can be used to enhance the seed script or fetch images on-demand
 */

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export interface ImageSearchResult {
  url: string;
  photographer?: string;
  source: 'unsplash' | 'pexels' | 'placeholder';
}

/**
 * Search for animal images using Unsplash API
 */
export async function searchUnsplashImage(
  query: string
): Promise<ImageSearchResult | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return {
        url: data.results[0].urls.regular,
        photographer: data.results[0].user.name,
        source: 'unsplash',
      };
    }
  } catch (error) {
    console.error('Unsplash API error:', error);
  }

  return null;
}

/**
 * Search for animal images using Pexels API
 */
export async function searchPexelsImage(
  query: string
): Promise<ImageSearchResult | null> {
  if (!PEXELS_API_KEY) {
    console.warn('Pexels API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      return {
        url: data.photos[0].src.large,
        photographer: data.photos[0].photographer,
        source: 'pexels',
      };
    }
  } catch (error) {
    console.error('Pexels API error:', error);
  }

  return null;
}

/**
 * Get animal image with fallback chain:
 * 1. Try Unsplash
 * 2. Try Pexels
 * 3. Return placeholder
 */
export async function getAnimalImage(
  animalName: string
): Promise<ImageSearchResult> {
  // Try Unsplash first
  const unsplashResult = await searchUnsplashImage(animalName);
  if (unsplashResult) return unsplashResult;

  // Fallback to Pexels
  const pexelsResult = await searchPexelsImage(animalName);
  if (pexelsResult) return pexelsResult;

  // Return placeholder
  return {
    url: `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${encodeURIComponent(animalName)}`,
    source: 'placeholder',
  };
}

/**
 * Generate a placeholder URL with animal emoji
 */
export function getPlaceholderImageUrl(animalName: string): string {
  const emojiMap: Record<string, string> = {
    hawk: '🦅',
    eagle: '🦅',
    owl: '🦉',
    coyote: '🦊',
    fox: '🦊',
    raccoon: '🦝',
    deer: '🦌',
    bat: '🦇',
    whale: '🐋',
    seal: '🦭',
    turtle: '🐢',
    salamander: '🐸',
    frog: '🐸',
    bird: '🐦',
    sparrow: '🐦',
    goose: '🦢',
    rat: '🐭',
    crab: '🦀',
  };

  const lowerName = animalName.toLowerCase();
  const emoji =
    Object.entries(emojiMap).find(([key]) => lowerName.includes(key))?.[1] ||
    '🐾';

  return `https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=${emoji}`;
}

