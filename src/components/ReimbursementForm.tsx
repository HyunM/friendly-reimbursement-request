
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { ReimbursementEntry, ReimbursementRequest } from "@/types/reimbursement";

interface ReimbursementFormProps {
  initialData?: ReimbursementRequest;
}

export const ReimbursementForm = ({ initialData }: ReimbursementFormProps) => {
  const [name, setName] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [entries, setEntries] = useState<Partial<ReimbursementEntry>[]>([{ id: 1 }]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPeriodStart(initialData.periodStart);
      setPeriodEnd(initialData.periodEnd);
      setEntries(initialData.entries);
    }
  }, [initialData]);

  const handleAddRow = () => {
    setEntries([...entries, { id: entries.length + 1 }]);
  };

  const handleRemoveRow = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
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

    // Here we would typically send the data to a backend
    toast({
      title: initialData ? "Request Updated" : "Request Submitted",
      description: initialData 
        ? "Your reimbursement request has been updated successfully."
        : "Your reimbursement request has been submitted successfully."
    });

    // Reset form if it's not an edit
    if (!initialData) {
      setName("");
      setPeriodStart("");
      setPeriodEnd("");
      setEntries([{ id: 1 }]);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 min-w-[200px]"
            />
          </div>
          <div>
            <Label htmlFor="periodStart">Period Start</Label>
            <div className="relative">
              <Input
                id="periodStart"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="mt-1 min-w-[200px]"
              />
              <CalendarIcon className="absolute right-3 top-[60%] transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
          <div>
            <Label htmlFor="periodEnd">Period End</Label>
            <div className="relative">
              <Input
                id="periodEnd"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="mt-1 min-w-[200px]"
              />
              <CalendarIcon className="absolute right-3 top-[60%] transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mt-4">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left w-12">No.</th>
                <th className="px-4 py-2 text-left w-36">Date</th>
                <th className="px-4 py-2 text-left w-48">Payee</th>
                <th className="px-4 py-2 text-left w-60">Description</th>
                <th className="px-4 py-2 text-left w-32">Expenses</th>
                <th className="px-4 py-2 text-left w-32">Income</th>
                <th className="px-4 py-2 text-left w-32">Balance</th>
                <th className="px-4 py-2 text-left w-24">Job No.</th>
                <th className="px-4 py-2 text-left w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="px-4 py-2">{entry.id}</td>
                  <td className="px-4 py-2">
                    <Input
                      type="date"
                      value={entry.date || ""}
                      onChange={(e) => handleEntryChange(entry.id!, 'date', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={entry.payee || ""}
                      onChange={(e) => handleEntryChange(entry.id!, 'payee', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={entry.description || ""}
                      onChange={(e) => handleEntryChange(entry.id!, 'description', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={entry.expenses || ""}
                      onChange={(e) => handleEntryChange(entry.id!, 'expenses', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      type="number"
                      value={entry.income || ""}
                      onChange={(e) => handleEntryChange(entry.id!, 'income', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    ${entry.balance?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={entry.jobNo || ""}
                      onChange={(e) => handleEntryChange(entry.id!, 'jobNo', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
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

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRow}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Row
          </Button>
          <Button type="submit">
            {initialData ? "Update Request" : "Submit Request"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
