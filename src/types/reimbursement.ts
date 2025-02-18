
export interface ReimbursementEntry {
  id: number;
  date: string;
  payee: string;
  description: string;
  expenses: number;
  income: number;
  balance: number;
  jobNo: string;
  status: 'pending' | 'approved' | 'denied';
  attachmentFile?: File;
  attachmentName?: string;
}

export interface ReimbursementRequest {
  id: string;
  name: string;
  date: string;
  entries: ReimbursementEntry[];
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}
