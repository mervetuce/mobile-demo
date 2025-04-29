export interface VisaApplication {
  id: string;
  userId: string;
  visaType: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  submissionDate: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
}