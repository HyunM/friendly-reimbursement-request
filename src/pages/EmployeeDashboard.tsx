
import { useState } from "react";
import { ReimbursementForm } from "@/components/ReimbursementForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReimbursementRequest } from "@/types/reimbursement";
import { Edit2, Plus } from "lucide-react";

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
  },
  {
    id: "2",
    name: "John Doe",
    periodStart: "2024-02-01",
    periodEnd: "2024-02-29",
    entries: [
      {
        id: 1,
        date: "2024-02-15",
        payee: "Travel Agency",
        description: "Business Trip",
        expenses: 500.00,
        income: 0,
        balance: 500.00,
        jobNo: "J002",
        status: "approved"
      }
    ],
    status: "approved",
    createdAt: "2024-02-16"
  }
];

const EmployeeDashboard = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReimbursementRequest | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEdit = (request: ReimbursementRequest) => {
    setSelectedRequest(request);
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">My Reimbursement Requests</h1>
            <p className="mt-2 text-gray-600">View and manage your reimbursement requests.</p>
          </div>
          <Button onClick={() => setIsNewRequestOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
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
                    {request.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(request)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* New Request Modal */}
        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>New Reimbursement Request</DialogTitle>
            </DialogHeader>
            <ReimbursementForm />
          </DialogContent>
        </Dialog>

        {/* Edit Request Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Reimbursement Request</DialogTitle>
            </DialogHeader>
            {selectedRequest && <ReimbursementForm initialData={selectedRequest} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
