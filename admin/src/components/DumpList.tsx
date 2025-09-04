import { DumpDTO } from '@ekotracker/shared';

interface DumpListProps {
  dumps: DumpDTO[];
}

export default function DumpList({ dumps }: DumpListProps) {
  if (dumps.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No dumps found. Create one using the mobile app.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Weight
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reports
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {dumps.map((dump) => (
            <tr key={dump.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {dump.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs truncate" title={dump.description}>
                  {dump.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  dump.weight >= 6.5 ? 'bg-red-100 text-red-800' :
                  dump.weight >= 4 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {dump.weight.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  dump.status === 'ACTIVE' ? 'bg-red-100 text-red-800' :
                  dump.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                  dump.status === 'REMOVAL_PENDING_CONFIRMATION' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {dump.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {dump.reportsCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {dump.latitude.toFixed(4)}, {dump.longitude.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}