export type PetMedia = {
  type: 'image' | 'video';
  uri: string;
};

export type Pet = {
  id: string;
  name: string;
  breed: string;
  type: 'dog' | 'cat';
  size: 'small' | 'medium' | 'large';
  age: 'young' | 'adult' | 'senior';
  ageDisplay: string;
  energyLevel: 'low' | 'medium' | 'high';
  goodWithKids: boolean;
  goodWithPets: boolean;
  hypoallergenic: boolean;
  needsYard: boolean;
  media: PetMedia[];
  bio: string;
  shelterId: string;
  score?: number;
};

export type Shelter = {
  id: string;
  name: string;
  phone: string;
  address: string;
  about: string;
  hours: string;
  animalTypes: string[];
  adoptionFee: string;
  requiresHomeVisit: string;
  vaccinationPolicy: string;
  photoUri?: string;
};

export const MOCK_SHELTERS: Shelter[] = [
  {
    id: 's1',
    name: 'Happy Paws Rescue',
    phone: '(415) 555-0123',
    address: '123 Market St, San Francisco, CA 94102',
    about: 'A no-kill shelter dedicated to finding loving homes for every animal since 2008.',
    hours: 'Mon–Sat 10am–6pm, Sun 11am–5pm',
    animalTypes: ['dogs', 'cats'],
    adoptionFee: '$150 – $250',
    requiresHomeVisit: 'Case by case',
    vaccinationPolicy: 'Full records provided',
  },
  {
    id: 's2',
    name: 'Bay Area Animal Haven',
    phone: '(510) 555-0187',
    address: '456 Broadway Ave, Oakland, CA 94607',
    about: 'Community-driven shelter helping animals thrive since 2012.',
    hours: 'Tue–Sun 9am–5pm',
    animalTypes: ['dogs', 'cats', 'rabbits'],
    adoptionFee: '$75 – $175',
    requiresHomeVisit: 'Always required',
    vaccinationPolicy: 'Full records provided',
  },
  {
    id: 's3',
    name: 'Golden Gate Pets',
    phone: '(415) 555-0244',
    address: '789 Van Ness Ave, San Francisco, CA 94109',
    about: 'Rescue focused on senior animals and special-needs pets.',
    hours: 'Daily 10am–4pm',
    animalTypes: ['dogs', 'cats'],
    adoptionFee: 'Free – $100',
    requiresHomeVisit: 'Not required',
    vaccinationPolicy: 'Partial records',
  },
];

export const MOCK_PETS: Pet[] = [
  {
    id: 'p1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    type: 'dog',
    size: 'large',
    age: 'young',
    ageDisplay: '1 year',
    energyLevel: 'high',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: true,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800' },
    ],
    bio: 'Buddy is a playful golden retriever who loves fetch, long runs, and cuddles. He\'s great with kids and other dogs!',
    shelterId: 's1',
  },
  {
    id: 'p2',
    name: 'Luna',
    breed: 'Domestic Shorthair',
    type: 'cat',
    size: 'small',
    age: 'adult',
    ageDisplay: '3 years',
    energyLevel: 'low',
    goodWithKids: true,
    goodWithPets: false,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800' },
    ],
    bio: 'Luna is a calm, affectionate cat who loves sunny windowsills and gentle petting. Prefers to be the only pet.',
    shelterId: 's1',
  },
  {
    id: 'p3',
    name: 'Max',
    breed: 'French Bulldog',
    type: 'dog',
    size: 'small',
    age: 'adult',
    ageDisplay: '4 years',
    energyLevel: 'medium',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800' },
    ],
    bio: 'Max is a charming Frenchie who loves apartment life. He\'s great with kids and other dogs, and his energy level is just right.',
    shelterId: 's2',
  },
  {
    id: 'p4',
    name: 'Bella',
    breed: 'Labrador Mix',
    type: 'dog',
    size: 'large',
    age: 'adult',
    ageDisplay: '5 years',
    energyLevel: 'medium',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: true,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800' },
    ],
    bio: 'Bella is a loyal and gentle lab mix who loves hiking and swimming. She\'s a total family dog.',
    shelterId: 's2',
  },
  {
    id: 'p5',
    name: 'Oliver',
    breed: 'Maine Coon',
    type: 'cat',
    size: 'large',
    age: 'adult',
    ageDisplay: '6 years',
    energyLevel: 'medium',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800' },
    ],
    bio: 'Oliver is a majestic Maine Coon who gets along with everyone. He loves to chat and follow you around the house.',
    shelterId: 's3',
  },
  {
    id: 'p6',
    name: 'Daisy',
    breed: 'Poodle Mix',
    type: 'dog',
    size: 'small',
    age: 'young',
    ageDisplay: '8 months',
    energyLevel: 'high',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: true,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1591160690555-5d7ac5bde4f7?w=800' },
    ],
    bio: 'Daisy is a hypoallergenic doodle mix full of love and energy. Perfect for families and people with allergies!',
    shelterId: 's1',
  },
  {
    id: 'p7',
    name: 'Charlie',
    breed: 'Beagle',
    type: 'dog',
    size: 'medium',
    age: 'adult',
    ageDisplay: '3 years',
    energyLevel: 'high',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: true,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800' },
    ],
    bio: 'Charlie is an adventurous beagle who loves sniffing everything on long walks. A wonderful family companion.',
    shelterId: 's2',
  },
  {
    id: 'p8',
    name: 'Mochi',
    breed: 'Domestic Longhair',
    type: 'cat',
    size: 'small',
    age: 'young',
    ageDisplay: '6 months',
    energyLevel: 'high',
    goodWithKids: false,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800' },
    ],
    bio: 'Mochi is a fluffy kitten who loves to play and explore. She gets along with other cats and would love a playmate.',
    shelterId: 's3',
  },
  {
    id: 'p9',
    name: 'Rocky',
    breed: 'German Shepherd Mix',
    type: 'dog',
    size: 'large',
    age: 'adult',
    ageDisplay: '7 years',
    energyLevel: 'medium',
    goodWithKids: true,
    goodWithPets: false,
    hypoallergenic: false,
    needsYard: true,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800' },
    ],
    bio: 'Rocky is a calm and loyal shepherd mix who would thrive as the only pet in a home with a yard.',
    shelterId: 's1',
  },
  {
    id: 'p10',
    name: 'Cleo',
    breed: 'Siamese Mix',
    type: 'cat',
    size: 'small',
    age: 'senior',
    ageDisplay: '11 years',
    energyLevel: 'low',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800' },
    ],
    bio: 'Cleo is a graceful senior cat who loves being the center of attention. She\'s wise, gentle, and full of love.',
    shelterId: 's2',
  },
  {
    id: 'p11',
    name: 'Archie',
    breed: 'Corgi',
    type: 'dog',
    size: 'small',
    age: 'young',
    ageDisplay: '1.5 years',
    energyLevel: 'high',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=800' },
    ],
    bio: 'Archie the Corgi is endlessly entertaining. He herds everyone, including the cat next door. Pure joy in a little package.',
    shelterId: 's3',
  },
  {
    id: 'p12',
    name: 'Willow',
    breed: 'Border Collie Mix',
    type: 'dog',
    size: 'medium',
    age: 'adult',
    ageDisplay: '4 years',
    energyLevel: 'high',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: true,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
    ],
    bio: 'Willow is a brilliant border collie who thrives with active owners. She needs space, stimulation, and tons of love.',
    shelterId: 's2',
  },
  {
    id: 'p13',
    name: 'Nala',
    breed: 'Tabby',
    type: 'cat',
    size: 'medium',
    age: 'adult',
    ageDisplay: '4 years',
    energyLevel: 'medium',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800' },
    ],
    bio: 'Nala is a social tabby who loves attention and playing. She gets along well with other cats and calm dogs.',
    shelterId: 's1',
  },
  {
    id: 'p14',
    name: 'Bear',
    breed: 'Bernese Mountain Dog',
    type: 'dog',
    size: 'large',
    age: 'young',
    ageDisplay: '2 years',
    energyLevel: 'medium',
    goodWithKids: true,
    goodWithPets: true,
    hypoallergenic: false,
    needsYard: true,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800' },
    ],
    bio: 'Bear is a gentle giant who loves everyone. He\'s great with kids, dogs, and cats. The perfect family dog.',
    shelterId: 's3',
  },
  {
    id: 'p15',
    name: 'Hazel',
    breed: 'Dachshund',
    type: 'dog',
    size: 'small',
    age: 'senior',
    ageDisplay: '9 years',
    energyLevel: 'low',
    goodWithKids: false,
    goodWithPets: false,
    hypoallergenic: false,
    needsYard: false,
    media: [
      { type: 'image', uri: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800' },
    ],
    bio: 'Hazel is a dignified senior dachshund who deserves a quiet forever home. She loves soft blankets and gentle scratches.',
    shelterId: 's1',
  },
];
