
import { ReimbursementForm } from "@/components/ReimbursementForm";

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Reimbursement Request</h1>
          <p className="mt-2 text-gray-600">Submit your expense reimbursement request below.</p>
        </div>
        <ReimbursementForm />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
