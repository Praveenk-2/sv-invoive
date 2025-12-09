import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

export default function MasterPage() {
  return (
    // <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Item Master</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your master data and configurations</p>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Products', 'Categories', 'Users', 'Suppliers', 'Inventory', 'Warehouses'].map((item, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">{item}</h3>
                <p className="mt-2 text-sm text-gray-600">Manage {item.toLowerCase()}</p>
                <div className="mt-4 text-sm text-blue-600 font-medium">View all →</div>
              </div>
            ))}
          </div> */}
        </div>
       </DashboardLayout>
     // </ProtectedRoute> 
  );
}
