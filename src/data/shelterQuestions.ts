export type ShelterQuestion =
  | {
      id: string;
      title: string;
      subtitle: string;
      type: 'text' | 'phone';
      placeholder: string;
    }
  | {
      id: string;
      title: string;
      subtitle: string;
      type: 'choice';
      options: { value: string; emoji: string; label: string }[];
      defaultIndex: number;
    };

export const SHELTER_QUESTIONS: ShelterQuestion[] = [
  {
    id: 'name',
    title: 'What\'s the name\nof your shelter?',
    subtitle: 'This will appear on your public profile',
    type: 'text',
    placeholder: 'e.g. Happy Paws Animal Rescue',
  },
  {
    id: 'phone',
    title: 'What\'s your contact\nphone number?',
    subtitle: 'So adopters can reach you directly',
    type: 'phone',
    placeholder: 'e.g. (415) 555-0192',
  },
  {
    id: 'address',
    title: 'Where is your\nshelter located?',
    subtitle: 'Enter your full address',
    type: 'text',
    placeholder: 'e.g. 123 Main St, San Francisco, CA',
  },
  {
    id: 'animalTypes',
    title: 'What types of animals\ndo you house?',
    subtitle: 'Select all that apply',
    type: 'choice',
    options: [
      { value: 'dogs', emoji: '🐕', label: 'Dogs' },
      { value: 'cats', emoji: '🐈', label: 'Cats' },
      { value: 'both', emoji: '🐾', label: 'Dogs & Cats' },
      { value: 'other', emoji: '🦜', label: 'Other animals' },
    ],
    defaultIndex: 2,
  },
  {
    id: 'capacity',
    title: 'How many animals\nare currently available?',
    subtitle: 'Approximate number is fine',
    type: 'choice',
    options: [
      { value: '1-10', emoji: '🐾', label: '1–10 animals' },
      { value: '11-30', emoji: '🏠', label: '11–30 animals' },
      { value: '30+', emoji: '🏛️', label: '30+ animals' },
    ],
    defaultIndex: 0,
  },
  {
    id: 'requiresHomeVisit',
    title: 'Do you require a\nhome visit before adoption?',
    subtitle: 'Helps ensure the right fit',
    type: 'choice',
    options: [
      { value: 'always', emoji: '✅', label: 'Always required' },
      { value: 'sometimes', emoji: '🤔', label: 'Case by case' },
      { value: 'never', emoji: '🚫', label: 'Not required' },
    ],
    defaultIndex: 1,
  },
  {
    id: 'adoptionFee',
    title: 'What\'s your typical\nadoption fee?',
    subtitle: 'Covers spay/neuter and vaccinations',
    type: 'choice',
    options: [
      { value: 'free', emoji: '🎁', label: 'Free adoptions' },
      { value: 'under100', emoji: '💵', label: 'Under $100' },
      { value: '100-300', emoji: '💰', label: '$100 – $300' },
      { value: '300+', emoji: '💎', label: '$300+' },
    ],
    defaultIndex: 1,
  },
  {
    id: 'vaccinationPolicy',
    title: 'Do animals come with\nvaccination records?',
    subtitle: 'Health transparency matters',
    type: 'choice',
    options: [
      { value: 'full', emoji: '✅', label: 'Full records' },
      { value: 'partial', emoji: '📋', label: 'Partial records' },
      { value: 'none', emoji: '🚫', label: 'No records' },
    ],
    defaultIndex: 0,
  },
];
