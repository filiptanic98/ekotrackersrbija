import { DumpDTO, ApiResponse } from '@ekotracker/shared';
import DumpList from '../components/DumpList';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

async function getDumps(): Promise<DumpDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/dumps`, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dumps');
    }
    
    const result: ApiResponse<DumpDTO[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching dumps:', error);
    return [];
  }
}

export default async function HomePage() {
  const dumps = await getDumps();

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Pregled deponija ({dumps.length})
        </h2>
        <p className="text-gray-600 text-sm">
          Deponije su sortirane po težinskom faktoru (prioritetu) opadajuće.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <DumpList dumps={dumps} />
      </div>
    </div>
  );
}