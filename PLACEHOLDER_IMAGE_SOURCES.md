# Animal Photo Placeholder Sources

## Current Sources (Already in Seed Data)

1. **USFWS Digital Library** - `digitalmedia.fws.gov`
   - High-quality wildlife photos
   - Public domain
   - Great for North American wildlife

2. **Wikimedia Commons** - `upload.wikimedia.org`
   - Extensive wildlife photo collection
   - Various licenses (check per image)
   - Global coverage

3. **Cornell Lab of Ornithology** - `download.ams.birds.cornell.edu`
   - Excellent bird photos
   - Scientific accuracy
   - High resolution

## Recommended Placeholder/Image Sources

### 1. **Unsplash API** (Recommended)
- **API**: `https://api.unsplash.com`
- **Free tier**: 50 requests/hour
- **Search endpoint**: `GET /search/photos?query={animal_name}`
- **Example**: `https://api.unsplash.com/search/photos?query=coyote&client_id=YOUR_KEY`
- **Pros**: High quality, free, easy to use
- **Cons**: Requires API key, rate limits

### 2. **Pexels API** (Recommended)
- **API**: `https://api.pexels.com`
- **Free tier**: 200 requests/hour
- **Search endpoint**: `GET /v1/search?query={animal_name}`
- **Example**: `https://api.pexels.com/v1/search?query=red-tailed-hawk`
- **Pros**: Free, no attribution required, high quality
- **Cons**: Requires API key

### 3. **Placeholder Services** (For Fallbacks)

**Placeholder.com with animal emoji:**
```
https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=🦊
```

**Picsum Photos (Random nature):**
```
https://picsum.photos/400/300?random={animal_id}
```

### 4. **iNaturalist API** (Scientific Accuracy)
- **API**: `https://api.inaturalist.org`
- **Search**: `GET /v1/observations?taxon_name={scientific_name}`
- **Pros**: Real wildlife observations, scientific names
- **Cons**: More complex, may need filtering

### 5. **Animal Diversity Web (ADW)**
- **URL**: `https://animaldiversity.org`
- **Pros**: Educational, scientific
- **Cons**: No direct API, would need scraping

## Implementation Options

### Option 1: Use Unsplash/Pexels API (Best Quality)
Create a service that fetches images on-demand:

```typescript
// src/lib/animalImages.ts
export async function getAnimalImage(animalName: string): Promise<string> {
  // Try Unsplash first, fallback to Pexels, then placeholder
}
```

### Option 2: Use Placeholder Component (Current Implementation)
The `AnimalImage` component already handles:
- ✅ Fallback to emoji placeholders
- ✅ Loading states
- ✅ Error handling
- ✅ Animal-specific emojis

### Option 3: Pre-fetch and Store URLs
Update seed script to fetch from APIs and store URLs in database.

## Quick Setup for Unsplash

1. Sign up at https://unsplash.com/developers
2. Create an app
3. Get your Access Key
4. Add to `.env`:
   ```
   VITE_UNSPLASH_ACCESS_KEY=your_key_here
   ```

## Quick Setup for Pexels

1. Sign up at https://www.pexels.com/api/
2. Get your API key
3. Add to `.env`:
   ```
   VITE_PEXELS_API_KEY=your_key_here
   ```

## Current Fallback

The `AnimalImage` component provides:
- 🦅 Birds (hawks, eagles, owls)
- 🦊 Canines (coyotes, foxes)
- 🦝 Raccoons
- 🦌 Deer
- 🦇 Bats
- 🐋 Marine mammals
- 🐢 Turtles
- 🐸 Amphibians
- 🐦 General birds
- 🐭 Rodents
- 🦀 Crustaceans
- 🐾 Default

This ensures every animal has a visual representation even if the image URL fails!

