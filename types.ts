export type UserRole = 'participant' | 'company_admin' | 'company_member' | 'admin';
export type QuestionType = 'text' | 'single_choice' | 'multi_choice' | 'video_upload' | 'image_upload';
export type ContestStatus = 'draft' | 'scheduled' | 'active' | 'ended' | 'archived';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  display_name: string;
  created_at: string;
  last_login?: string;
  company_id?: number;
}

export interface Company {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  created_at: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  max_questions_per_contest: number;
  allowed_question_types: QuestionType[];
  max_simultaneous_contests: number;
  display_impressions: number;
  price: number;
  billing_period: 'monthly' | 'yearly' | 'one_time';
}

export interface CompanySubscription {
  id: number;
  company_id: number;
  package_id: number;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  usage_questions?: number;
  usage_impressions?: number;
}

export interface Question {
  id: number;
  contest_id: number;
  type: QuestionType;
  prompt: string;
  media_url?: string;
  options?: string[];
  correct_answer?: string | string[];
  time_limit_seconds?: number;
  order_index: number;
}

export interface Prize {
  position: 1 | 2 | 3;
  description: string;
}

export interface Winner {
  user_id: number;
  position: 1 | 2 | 3;
}

export interface Contest {
  id: number;
  company_id: number;
  title: string;
  slug: string;
  description: string;
  media_url: string;
  start_datetime: string;
  end_datetime: string;
  status: ContestStatus;
  questions: Question[];
  prizes?: Prize[];
  winners?: Winner[];
}

export interface ContestEntry {
  id: number;
  contest_id: number;
  participant_id: number;
  submitted_at: string;
  score: number;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
}