
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Reimbursement Request System</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Submit and manage your reimbursement requests efficiently.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/employee">Employee Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/hr">HR Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
