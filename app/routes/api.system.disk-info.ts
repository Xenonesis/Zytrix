import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';

// Check if we're in a serverless environment (Vercel, Cloudflare, etc.)
const isServerless = process.env.VERCEL || process.env.CF_PAGES || !process.platform;
const isDevelopment = process.env.NODE_ENV === 'development';

interface DiskInfo {
  filesystem: string;
  size: number;
  used: number;
  available: number;
  percentage: number;
  mountpoint: string;
  timestamp: string;
  error?: string;
}

const getDiskInfo = async (): Promise<DiskInfo[]> => {
  // Always return mock data for serverless environments like Vercel
  // Generate random percentage between 40-60%
  const percentage = Math.floor(40 + Math.random() * 20);
  const totalSize = 500 * 1024 * 1024 * 1024; // 500GB
  const usedSize = Math.floor((totalSize * percentage) / 100);
  const availableSize = totalSize - usedSize;

  return [
    {
      filesystem: 'Serverless',
      size: totalSize,
      used: usedSize,
      available: availableSize,
      percentage,
      mountpoint: '/',
      timestamp: new Date().toISOString(),
      error: isServerless ? 'Running in serverless environment - showing mock data' : undefined,
    },
  ];
};

export const loader = async ({ request: _request }: LoaderFunctionArgs) => {
  try {
    return json(await getDiskInfo());
  } catch (error) {
    console.error('Failed to get disk info:', error);
    return json(
      [
        {
          filesystem: 'Unknown',
          size: 0,
          used: 0,
          available: 0,
          percentage: 0,
          mountpoint: '/',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
      { status: 500 },
    );
  }
};

export const action = async ({ request: _request }: ActionFunctionArgs) => {
  try {
    return json(await getDiskInfo());
  } catch (error) {
    console.error('Failed to get disk info:', error);
    return json(
      [
        {
          filesystem: 'Unknown',
          size: 0,
          used: 0,
          available: 0,
          percentage: 0,
          mountpoint: '/',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
      { status: 500 },
    );
  }
};
