export interface MetalPrices {
  goldPerGram: number; // USD per gram
  silverPerGram: number; // USD per gram
  fetchedAt: number;
}

let cache: MetalPrices | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getMetalPrices(): Promise<MetalPrices> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return cache;
  }

  try {
    // metals.live returns prices per troy ounce in USD
    const res = await fetch("https://metals.live/api/v1/latest", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("metals.live request failed");

    const data = await res.json();
    // data is an array of objects: [{ gold: number, silver: number, ... }]
    const entry = Array.isArray(data) ? data[0] : data;
    const TROY_OZ_TO_GRAM = 31.1035;

    cache = {
      goldPerGram: entry.gold / TROY_OZ_TO_GRAM,
      silverPerGram: entry.silver / TROY_OZ_TO_GRAM,
      fetchedAt: Date.now(),
    };
  } catch {
    // Fallback to approximate values if API fails
    cache = {
      goldPerGram: 60.0,
      silverPerGram: 0.75,
      fetchedAt: Date.now(),
    };
  }

  return cache!;
}
