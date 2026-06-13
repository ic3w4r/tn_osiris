import { NextResponse } from 'next/server';

import { flowRadarDataset } from '@/lib/tn-flowradar-data';

export async function GET() {
  return NextResponse.json(flowRadarDataset, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
