
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ReimbursementRequest } from "@/types/reimbursement";
import { CheckCircle2, Eye, XCircle } from "lucide-react";

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
        jobNo: "6991",
        status: "pending"
      }
    ],
    status: "pending",
    createdAt: "2024-03-16"
  },
  {
    id: "4",
    name: "Sarah Williams",
    periodStart: "2024-03-01",
    periodEnd: "2024-03-31",
    entries: [
      {
        id: 1,
        date: "2024-03-18",
        payee: "Print Shop",
        description: "Marketing Materials",
        expenses: 250.00,
        income: 0,
        balance: 250.00,
        jobNo: "6991",
        status: "pending"
      },
      {
        id: 2,
        date: "2024-03-19",
        payee: "Office Depot",
        description: "Office Supplies",
        expenses: 125.50,
        income: 0,
        balance: 125.50,
        jobNo: "6991",
        status: "pending"
      }
    ],
    status: "pending",
    createdAt: "2024-03-19"
  }
].filter(request => request.status === 'pending');

const HRDashboard = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ReimbursementRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleApprove = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
    toast({
      title: "Request Approved",
      description: "The reimbursement request has been approved."
    });
  };

  const handleDeny = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
    toast({
      title: "Request Denied",
      description: "The reimbursement request has been denied."
    });
  };

  const handleViewDetail = (request: ReimbursementRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">HR Dashboard</h1>
          <p className="mt-2 text-gray-600">Review pending reimbursement requests.</p>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total Amount</TableHead>
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
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(request)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeny(request.id)}
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

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Reimbursement Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Period</p>
                    <p className="mt-1">
                      {new Date(selectedRequest.periodStart).toLocaleDateString()} - 
                      {new Date(selectedRequest.periodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Payee</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Expenses</TableHead>
                        <TableHead>Income</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Job No.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRequest.entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                          <TableCell>{entry.payee}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>${entry.expenses.toFixed(2)}</TableCell>
                          <TableCell>${entry.income.toFixed(2)}</TableCell>
                          <TableCell>${entry.balance.toFixed(2)}</TableCell>
                          <TableCell>{entry.jobNo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold">
                    Total Amount: ${selectedRequest.entries.reduce((sum, entry) => sum + entry.balance, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HRDashboard;
