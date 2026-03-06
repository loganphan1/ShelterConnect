export type AnswerOption = {
  value: string;
  emoji: string;
  label: string;
};

export type Question = {
  id: string;
  title: string;
  subtitle: string;
  type: 'choice';
  options: AnswerOption[];
  defaultIndex: number;
};

export const OWNER_QUESTIONS: Question[] = [
  {
    id: 'petType',
    title: 'What type of pet\nare you looking for?',
    subtitle: 'We\'ll tailor your matches accordingly',
    type: 'choice',
    options: [
      { value: 'dog', emoji: '🐕', label: 'Dog' },
      { value: 'cat', emoji: '🐈', label: 'Cat' },
      { value: 'either', emoji: '🐾', label: 'Either one!' },
    ],
    defaultIndex: 0,
  },
  {
    id: 'size',
    title: 'What size do\nyou prefer?',
    subtitle: 'Think about your living space',
    type: 'choice',
    options: [
      { value: 'small', emoji: '🐩', label: 'Small' },
      { value: 'medium', emoji: '🐕', label: 'Medium' },
      { value: 'large', emoji: '🦮', label: 'Large' },
      { value: 'any', emoji: '🤷', label: 'No preference' },
    ],
    defaultIndex: 0,
  },
  {
    id: 'hasYoungKids',
    title: 'Do you have children\nat home?',
    subtitle: 'Helps us find pet-friendly companions',
    type: 'choice',
    options: [
      { value: 'under5', emoji: '👶', label: 'Yes, under 5' },
      { value: '5to12', emoji: '🧒', label: 'Yes, ages 5–12' },
      { value: 'teens', emoji: '🧑', label: 'Yes, teenagers' },
      { value: 'none', emoji: '🙅', label: 'No children' },
    ],
    defaultIndex: 3,
  },
  {
    id: 'otherPets',
    title: 'Do you have other\npets at home?',
    subtitle: 'Some animals get along better with others',
    type: 'choice',
    options: [
      { value: 'dogs', emoji: '🐕', label: 'Other dogs' },
      { value: 'cats', emoji: '🐈', label: 'Cats' },
      { value: 'both', emoji: '🐾', label: 'Dogs & cats' },
      { value: 'none', emoji: '🚫', label: 'No other pets' },
    ],
    defaultIndex: 3,
  },
  {
    id: 'activityLevel',
    title: 'How active is\nyour lifestyle?',
    subtitle: 'We\'ll match your energy with your pet\'s',
    type: 'choice',
    options: [
      { value: 'low', emoji: '🛋️', label: 'Homebody' },
      { value: 'medium', emoji: '🚶', label: 'Moderate' },
      { value: 'high', emoji: '🏃', label: 'Very active' },
    ],
    defaultIndex: 1,
  },
  {
    id: 'livingSituation',
    title: 'What\'s your\nliving situation?',
    subtitle: 'Some pets need more outdoor space',
    type: 'choice',
    options: [
      { value: 'apartment', emoji: '🏢', label: 'Apartment' },
      { value: 'house', emoji: '🏡', label: 'House with yard' },
      { value: 'large', emoji: '🌾', label: 'Large property' },
    ],
    defaultIndex: 0,
  },
  {
    id: 'dailyTime',
    title: 'How much time can\nyou give daily?',
    subtitle: 'For play, walks, and cuddles',
    type: 'choice',
    options: [
      { value: 'low', emoji: '⏰', label: 'Under 2 hours' },
      { value: 'medium', emoji: '🕐', label: '2–4 hours' },
      { value: 'high', emoji: '⏳', label: '4+ hours' },
    ],
    defaultIndex: 1,
  },
  {
    id: 'experience',
    title: 'What\'s your pet\nownership experience?',
    subtitle: 'No wrong answers here!',
    type: 'choice',
    options: [
      { value: 'none', emoji: '🌟', label: 'First time owner' },
      { value: 'some', emoji: '📖', label: 'Some experience' },
      { value: 'experienced', emoji: '🏆', label: 'Very experienced' },
    ],
    defaultIndex: 0,
  },
  {
    id: 'shedding',
    title: 'How do you feel\nabout pet hair?',
    subtitle: 'Be honest — your furniture will thank you',
    type: 'choice',
    options: [
      { value: 'ok', emoji: '🙌', label: 'Love the fluff!' },
      { value: 'minimal', emoji: '😊', label: 'Some is ok' },
      { value: 'hypoallergenic', emoji: '🌿', label: 'Hypoallergenic only' },
    ],
    defaultIndex: 0,
  },
  {
    id: 'agePreference',
    title: 'Any age preference\nfor your new pet?',
    subtitle: 'Each age has its own magic',
    type: 'choice',
    options: [
      { value: 'young', emoji: '🐣', label: 'Puppy / Kitten' },
      { value: 'adult', emoji: '🐾', label: 'Adult' },
      { value: 'senior', emoji: '🧓', label: 'Senior' },
      { value: 'any', emoji: '🤷', label: 'No preference' },
    ],
    defaultIndex: 3,
  },
];
