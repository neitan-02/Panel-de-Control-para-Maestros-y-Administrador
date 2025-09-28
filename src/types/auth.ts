  export type UserRole = 'Maestro' | 'admin';

  export interface Maestro {
  id: string;
  username: string;
  email: string;
  cct?: string;
  grado?: string;
  role: UserRole;
  codigo_ninos?: string;
  codigo_expira?: Date;
  createdAt: Date;
  }

  export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  grado: string;
  codigo_maestro?: string;
  maestro?: string;
  }

export interface Student {
  id: string;
  name: string;
  teacherId: string;
  grade: string;
  progress: {
    block1: number;
    block2: number;
    block3: number;
    block4: number;
    block5: number;
    block6: number;
  };
  lastUpdated: Date;
}

export interface MathBlock {
  id: number;
  name: string;
  topics: string[];
  color: string;
}

export interface SupportTicket {
  id: string;
  type: 'student_issue' | 'teacher_request' | 'technical_support' | 'general_inquiry';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  reportedBy: {
    id: string;
    name: string;
    role: 'teacher' | 'admin';
    email: string;
  };
  studentAffected?: {
    id: string;
    name: string;
    grade: string;
  };
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  adminNotes?: string;
  resolution?: string;
}