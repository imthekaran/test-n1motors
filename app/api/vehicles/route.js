import { getVehicles } from '@/lib/vehicles';

export async function GET() {
  try {
    const vehicles = await getVehicles();
    return Response.json(vehicles);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
