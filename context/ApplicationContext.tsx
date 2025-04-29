import { createContext, useContext, useState, ReactNode } from 'react';
import { VisaApplication } from '@/types/application';

interface ApplicationContextType {
  applications: VisaApplication[];
  addApplication: (application: Omit<VisaApplication, 'id'>) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Mock applications data
const mockApplications: VisaApplication[] = [
  {
    id: '1',
    userId: '1',
    visaType: 'Tourist Visa - USA',
    status: 'in_progress',
    submissionDate: '2024-03-15',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234-567-8900',
    nationality: 'Canadian',
    passportNumber: 'AB1234567',
  },
  {
    id: '2',
    userId: '1',
    visaType: 'Business Visa - UK',
    status: 'approved',
    submissionDate: '2024-02-28',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234-567-8900',
    nationality: 'Canadian',
    passportNumber: 'AB1234567',
  },
];

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<VisaApplication[]>(mockApplications);

  const addApplication = (newApplication: Omit<VisaApplication, 'id'>) => {
    const application: VisaApplication = {
      ...newApplication,
      id: Date.now().toString(),
    };
    setApplications(prev => [...prev, application]);
  };

  return (
    <ApplicationContext.Provider value={{ applications, addApplication }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}