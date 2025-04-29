import { VisaService } from '@/types/visa';

export const visaServices: VisaService[] = [
  {
    id: 1,
    type: 'tourist',
    title: 'Tourist Visa',
    description: 'Plan your perfect vacation with our tourist visa services',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    price: 'From $149',
    requirements: [
      'Valid passport',
      'Proof of accommodation',
      'Return ticket',
      'Bank statements',
    ],
    processingTime: '5-7 business days',
    eligibility: [
      'Minimum 6 months passport validity',
      'Proof of sufficient funds',
      'Clean travel history',
    ],
  },
  {
    id: 2,
    type: 'business',
    title: 'Business Visa',
    description: 'Streamlined business visa processing for professionals',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    price: 'From $249',
    requirements: [
      'Business registration documents',
      'Invitation letter',
      'Company sponsorship letter',
      'Bank statements',
    ],
    processingTime: '7-10 business days',
    eligibility: [
      'Valid business registration',
      'Proof of business relationship',
      'Financial stability',
    ],
  },
  {
    id: 3,
    type: 'student',
    title: 'Student Visa',
    description: 'Supporting your educational journey abroad',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    price: 'From $199',
    requirements: [
      'Acceptance letter from institution',
      'Academic transcripts',
      'Proof of funds',
      'Language proficiency certificate',
    ],
    processingTime: '10-15 business days',
    eligibility: [
      'Acceptance to recognized institution',
      'Proof of financial support',
      'Language requirements met',
    ],
  },
  {
    id: 4,
    type: 'work',
    title: 'Work Visa',
    description: 'Professional assistance for work permit applications',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    price: 'From $299',
    requirements: [
      'Job offer letter',
      'Employment contract',
      'Educational certificates',
      'Professional qualifications',
    ],
    processingTime: '15-20 business days',
    eligibility: [
      'Valid job offer',
      'Required qualifications',
      'Work experience',
    ],
  },
];