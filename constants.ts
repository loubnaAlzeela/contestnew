import type { User, Company, Package, CompanySubscription, Contest, Question } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@company.com', password_hash: 'password123', role: 'company_admin', display_name: 'Company Admin', created_at: '2023-01-01T00:00:00Z', company_id: 1 },
  { id: 2, email: 'participant1@test.com', password_hash: 'password123', role: 'participant', display_name: 'Alex Participant', created_at: '2023-02-01T00:00:00Z' },
  { id: 3, email: 'participant2@test.com', password_hash: 'password123', role: 'participant', display_name: 'Beth Tester', created_at: '2023-03-01T00:00:00Z' },
  { id: 4, email: 'loubnalounb@gmail.com', password_hash: '12345', role: 'company_admin', display_name: 'Loubna Corp Admin', created_at: '2024-01-01T00:00:00Z', company_id: 2 },
];

export const MOCK_COMPANIES: Company[] = [
  { id: 1, user_id: 1, name: 'Innovate Corp', slug: 'innovate-corp', description: 'Driving innovation through technology.', logo_url: 'https://picsum.photos/seed/company1/200', website: 'https://innovate.corp', created_at: '2023-01-01T00:00:00Z' },
  { id: 2, user_id: 4, name: 'Loubna Corp', slug: 'loubna-corp', description: 'A premium company for contests.', logo_url: 'https://picsum.photos/seed/company2/200', website: 'https://loubna.corp', created_at: '2024-01-01T00:00:00Z' },
];

export const MOCK_PACKAGES: Package[] = [
  {
    id: 1, name: 'Basic', description: 'For small teams getting started.', max_questions_per_contest: 5,
    allowed_question_types: ['text', 'single_choice'], max_simultaneous_contests: 1, display_impressions: 1000, price: 29, billing_period: 'monthly'
  },
  {
    id: 2, name: 'Standard', description: 'For growing businesses.', max_questions_per_contest: 15,
    allowed_question_types: ['text', 'single_choice', 'multi_choice', 'image_upload'], max_simultaneous_contests: 5, display_impressions: 10000, price: 99, billing_period: 'monthly'
  },
  {
    id: 3, name: 'Premium', description: 'For large enterprises with advanced needs.', max_questions_per_contest: 50,
    allowed_question_types: ['text', 'single_choice', 'multi_choice', 'image_upload', 'video_upload'], max_simultaneous_contests: 20, display_impressions: 100000, price: 249, billing_period: 'monthly'
  },
];

export const MOCK_SUBSCRIPTIONS: CompanySubscription[] = [
  { id: 1, company_id: 1, package_id: 2, start_date: '2023-01-01T00:00:00Z', end_date: '2025-01-01T00:00:00Z', status: 'active', usage_impressions: 500, usage_questions: 10 },
  { id: 2, company_id: 2, package_id: 3, start_date: '2024-01-01T00:00:00Z', end_date: '2025-01-01T00:00:00Z', status: 'active', usage_impressions: 0, usage_questions: 0 },
];

const MOCK_QUESTIONS: Question[] = [
    { 
      id: 1, 
      contest_id: 1, 
      type: 'single_choice', 
      prompt: 'Based on the video, what is the capital of France?', 
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'], 
      order_index: 1,
      media_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    },
    { id: 2, contest_id: 1, type: 'text', prompt: 'Who wrote "To Kill a Mockingbird"?', order_index: 2 },
    { id: 3, contest_id: 2, type: 'image_upload', prompt: 'Upload your best nature photograph.', order_index: 1 },
    { id: 4, contest_id: 2, type: 'text', prompt: 'Describe the story behind your photo in 100 words.', order_index: 2 },
    { id: 5, contest_id: 3, type: 'multi_choice', prompt: 'Which of these are primary colors?', options: ['Red', 'Green', 'Blue', 'Yellow'], order_index: 1 },
];


export const MOCK_CONTESTS: Contest[] = [
  {
    id: 1, company_id: 1, title: 'Summer Trivia Challenge', slug: 'summer-trivia-challenge',
    description: 'Test your knowledge on a variety of topics and win amazing prizes!',
    media_url: 'https://picsum.photos/seed/contest1/800/400',
    start_datetime: '2024-07-01T00:00:00Z', end_datetime: '2024-08-31T23:59:59Z',
    status: 'active',
    questions: MOCK_QUESTIONS.filter(q => q.contest_id === 1),
    prizes: [
      { position: 1, description: 'A brand new tablet' },
      { position: 2, description: '$100 Gift Card' },
      { position: 3, description: 'Company Merchandise' },
    ],
  },
  {
    id: 2, company_id: 1, title: 'Innovate Corp Photo Contest', slug: 'innovate-photo-contest',
    description: 'Share your best photos with us. The theme is "Innovation in Daily Life".',
    media_url: 'https://picsum.photos/seed/contest2/800/400',
    start_datetime: '2024-08-01T00:00:00Z', end_datetime: '2024-09-15T23:59:59Z',
    status: 'active',
    questions: MOCK_QUESTIONS.filter(q => q.contest_id === 2),
  },
  {
    id: 3, company_id: 1, title: 'Art & Color Theory Quiz', slug: 'art-color-quiz',
    description: 'A quick quiz for all the art lovers out there. Show us what you know!',
    media_url: 'https://picsum.photos/seed/contest3/800/400',
    start_datetime: '2024-06-01T00:00:00Z', end_datetime: '2024-06-30T23:59:59Z',
    status: 'ended',
    questions: MOCK_QUESTIONS.filter(q => q.contest_id === 3),
    prizes: [
        { position: 1, description: '$100 Amazon Gift Card' },
        { position: 2, description: '$50 Amazon Gift Card' },
        { position: 3, description: 'ContestCraft AI T-Shirt' },
    ],
    winners: [
        { user_id: 2, position: 1 },
        { user_id: 3, position: 2 },
    ]
  },
];