import AdminLayout from '@/components/admin/admin-layout';
import IncidentsTable from '@/components/admin/incidents-table';

export default function AdminIncidents() {
  return (
    <AdminLayout>
      <IncidentsTable />
    </AdminLayout>
  );
}