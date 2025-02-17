import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { ReimbursementEntry } from "@/types/reimbursement";

interface ReimbursementFormProps {
  initialData?: {
    name: string;
    periodStart: string;
    periodEnd: string;
    entries: ReimbursementEntry[];
  };
}

export const ReimbursementForm = ({ initialData }: ReimbursementFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [periodStart, setPeriodStart] = useState(initialData?.periodStart || "");
  const [periodEnd, setPeriodEnd] = useState(initialData?.periodEnd || "");
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

  const handleEntryChange = (id: number, field: keyof ReimbursementEntry, value: string) => {
    setEntries(entries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };
        if (field === 'expenses' || field === 'income') {
          const expenses = parseFloat(updatedEntry.expenses?.toString() || '0');
          const income = parseFloat(updatedEntry.income?.toString() || '0');
          updatedEntry.balance = expenses - income;
        }
        return updatedEntry;
      }
      return entry;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !periodStart || !periodEnd) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-3 gap-6">
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
          <Label htmlFor="periodStart">Period Start</Label>
          <div className="relative">
            <Input
              id="periodStart"
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="periodEnd">Period End</Label>
          <div className="relative">
            <Input
              id="periodEnd"
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">No.</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Date</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Payee</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Description</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Expenses</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Income</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Balance</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Job No.</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100">
                <td className="py-2 px-4 text-sm">{entry.id}</td>
                <td className="py-2 px-4">
                  <Input
                    type="date"
                    value={entry.date || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'date', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    value={entry.payee || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'payee', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    value={entry.description || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'description', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    value={entry.expenses || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'expenses', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    value={entry.income || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'income', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4 text-sm">
                  ${entry.balance?.toFixed(2) || "0.00"}
                </td>
                <td className="py-2 px-4">
                  <Input
                    value={entry.jobNo || ""}
                    onChange={(e) => handleEntryChange(entry.id!, 'jobNo', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4">
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
