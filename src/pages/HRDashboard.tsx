
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { ReimbursementRequest } from "@/types/reimbursement";
import { CheckCircle2, XCircle } from "lucide-react";

// Mock data for demonstration
const mockRequests: ReimbursementRequest[] = [
  {
    id: "1",
    name: "John Doe",
    periodStart: "2024-03-01",
    periodEnd: "2024-03-31",
    entries: [
      {
        id: 1,
        date: "2024-03-15",
        payee: "Office Supplies Co",
        description: "Stationery",
        expenses: 150.00,
        income: 0,
        balance: 150.00,
        jobNo: "J001",
        status: "pending"
      }
    ],
    status: "pending",
    createdAt: "2024-03-16"
  }
];

const HRDashboard = () => {
  const [requests, setRequests] = useState(mockRequests);

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
    toast({
      title: "Request Approved",
      description: "The reimbursement request has been approved."
    });
  };

  const handleDeny = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'denied' as const } : req
    ));
    toast({
      title: "Request Denied",
      description: "The reimbursement request has been denied."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">HR Dashboard</h1>
          <p className="mt-2 text-gray-600">Review and manage reimbursement requests.</p>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>
                    {new Date(request.periodStart).toLocaleDateString()} - 
                    {new Date(request.periodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ${request.entries.reduce((sum, entry) => sum + entry.balance, 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'denied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        disabled={request.status !== 'pending'}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeny(request.id)}
                        disabled={request.status !== 'pending'}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;
