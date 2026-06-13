import { NextResponse } from 'next/server';

import { governanceDashboardData } from '@/lib/tn-governance-data';

export async function GET() {
  return NextResponse.json(governanceDashboardData, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
