import { Redis } from "@upstash/redis";
import { encrypt, decrypt } from "./crypto";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

const TTL_SECONDS = 13 * 30 * 24 * 60 * 60; // ~13 months

export async function storeToken(
  uuid: string,
  itemId: string,
  accessToken: string
): Promise<void> {
  const key = `${uuid}:${itemId}`;
  const encrypted = encrypt(accessToken);
  await getRedis().set(key, encrypted, { ex: TTL_SECONDS });
}

export async function getTokens(uuid: string): Promise<string[]> {
  const pattern = `${uuid}:*`;
  const keys = await getRedis().keys(pattern);
  if (!keys.length) return [];

  const values = await getRedis().mget<string[]>(...keys);
  return values
    .filter((v): v is string => v !== null)
    .map((v) => decrypt(v));
}

export async function deleteToken(uuid: string, itemId: string): Promise<void> {
  const key = `${uuid}:${itemId}`;
  await getRedis().del(key);
}
