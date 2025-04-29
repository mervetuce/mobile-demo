export interface VisaService {
  id: number;
  type: 'tourist' | 'business' | 'student' | 'work';
  title: string;
  description: string;
  image: string;
  price: string;
  requirements?: string[];
  processingTime?: string;
  eligibility?: string[];
}