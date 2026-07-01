export interface ResumeVersion {
  id: string;
  userId: string;
  version: string;
  fileUrl: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeStats {
  total: number;
  hasActive: boolean;
  activeVersion: string | null;
}
