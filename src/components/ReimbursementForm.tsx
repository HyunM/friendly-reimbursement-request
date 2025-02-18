
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, PlusCircle, Trash2, Paperclip } from "lucide-react";
import { ReimbursementEntry } from "@/types/reimbursement";

interface ReimbursementFormProps {
  initialData?: {
    name: string;
    date: string;
    entries: ReimbursementEntry[];
  };
}

export const ReimbursementForm = ({ initialData }: ReimbursementFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [entries, setEntries] = useState<Partial<ReimbursementEntry>[]>(
    initialData?.entries || [{ id: 1 }]
  );

  const handleAddRow = () => {
    setEntries([...entries, { id: entries.length + 1 }]);
  };

  const handleRemoveRow = (id: number) => {
    if (entries.length === 1) {
      toast({
        title: "Cannot Remove Row",
        description: "At least one row must remain in the form.",
        variant: "destructive"
      });
      return;
    }
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleEntryChange = (id: number, field: keyof ReimbursementEntry, value: string | File) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        let updatedEntry = { ...entry };
        
        if (field === 'attachmentFile' && value instanceof File) {
          updatedEntry.attachmentFile = value;
          updatedEntry.attachmentName = value.name;
        } else if (typeof value === 'string') {
          updatedEntry = { ...entry, [field]: value };
          if (field === 'expenses' || field === 'income') {
            const expenses = parseFloat(updatedEntry.expenses?.toString() || '0');
            const income = parseFloat(updatedEntry.income?.toString() || '0');
            updatedEntry.balance = expenses - income;
          }
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: initialData ? "Request Updated" : "Request Submitted",
      description: "Your reimbursement request has been processed successfully."
    });
  };

  const handleFileChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleEntryChange(id, 'attachmentFile', e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-16">No.</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-40">Date</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-48">Payee</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-64">Description</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-32">Expenses</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-32">Income</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-32">Balance</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-32">Job No.</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-40">Attachment</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500 whitespace-nowrap w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100">
                <td className="py-2 px-6 text-sm">{entry.id}</td>
                <td className="py-2 px-6">
                  <Input
                    type="date"
                    value={entry.date || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'date', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-6">
                  <Input
                    value={entry.payee || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'payee', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-6">
                  <Input
                    value={entry.description || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'description', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-6">
                  <Input
                    type="number"
                    value={entry.expenses || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'expenses', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-6">
                  <Input
                    type="number"
                    value={entry.income || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'income', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-6 text-sm">
                  ${entry.balance?.toFixed(2) || "0.00"}
                </td>
                <td className="py-2 px-6">
                  <Input
                    value={entry.jobNo || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'jobNo', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-6">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(entry.id!, e)}
                      className="hidden"
                      id={`file-${entry.id}`}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center gap-2"
                      onClick={() => document.getElementById(`file-${entry.id}`)?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      {entry.attachmentName || "Attach File"}
                    </Button>
                  </div>
                </td>
                <td className="py-2 px-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRow(entry.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddRow}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Row
        </Button>
        <div className="flex-1" />
        <Button type="submit">
          {initialData ? "Update Request" : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};
