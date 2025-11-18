import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../App';
import { MOCK_PACKAGES } from '../constants';
import ContestCard from '../components/ContestCard';
import PackageCard from '../components/PackageCard';
import {
  SparklesIcon,
  MegaphoneIcon,
  ChartBarIcon,
  GiftIcon,
  PuzzlePieceIcon,
  TrophyIcon,
} from '../components/Icons';

const HomePage: React.FC = () => {
  const { contests } = useData();
  const navigate = useNavigate();
  const activeContests = contests.filter(c => c.status === 'active').slice(0, 3); // Show only 3 featured contests

  const handleSelectPackage = () => {
    // For simplicity, this will just navigate to the auth page.
    // A more complex implementation could pass state to pre-select company role and package.
    navigate('/auth');
  };

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
          Discover & Compete in
          <br />
          <span className="theme-gradient-text">AI-Powered Contests</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--color-text-muted)]">
          Join exciting challenges from top companies, showcase your skills, and win amazing prizes. The ultimate platform for creative and competitive minds.
        </p>
        <div className="mt-10 flex justify-center">
          <Link to="/" className="theme-gradient-bg theme-gradient-bg-hover text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Explore Contests
          </Link>
        </div>
      </section>

      {/* Why Join Section */}
      <section>
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)]">Why Join ContestCraft AI?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-muted)]">
                Whether you're a company looking to engage your audience or an individual ready for a challenge, we have something for you.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Companies */}
            <div className="bg-[var(--color-bg-card)] p-8 rounded-xl border border-[var(--color-border)] shadow-lg shadow-[var(--shadow-color)]/5">
                <h3 className="text-2xl font-bold theme-gradient-text mb-2">For Companies</h3>
                <p className="text-lg font-semibold text-[var(--color-text-heading)] mb-6">Boost Your Brand Engagement</p>
                <ul className="space-y-4">
                    <BenefitItem icon={<SparklesIcon className="w-6 h-6"/>} title="Effortless Contest Creation" description="Use our AI assistant to generate creative contest ideas, questions, and descriptions in minutes."/>
                    <BenefitItem icon={<MegaphoneIcon className="w-6 h-6"/>} title="Reach a Wider Audience" description="Promote your brand to our vibrant community of skilled participants and potential customers."/>
                    <BenefitItem icon={<ChartBarIcon className="w-6 h-6"/>} title="Gain Valuable Insights" description="Understand your audience better through contest entries and analytics (coming soon!)."/>
                </ul>
            </div>
            {/* For Participants */}
            <div className="bg-[var(--color-bg-card)] p-8 rounded-xl border border-[var(--color-border)] shadow-lg shadow-[var(--shadow-color)]/5">
                <h3 className="text-2xl font-bold theme-gradient-text mb-2">For Participants</h3>
                <p className="text-lg font-semibold text-[var(--color-text-heading)] mb-6">Showcase Your Skills & Win</p>
                <ul className="space-y-4">
                    <BenefitItem icon={<GiftIcon className="w-6 h-6"/>} title="Win Amazing Prizes" description="Compete for cash, exclusive products, gift cards, and more from top-tier companies."/>
                    <BenefitItem icon={<PuzzlePieceIcon className="w-6 h-6"/>} title="Challenge Yourself" description="Tackle fun and diverse contests across various topics, from trivia to creative submissions."/>
                    <BenefitItem icon={<TrophyIcon className="w-6 h-6"/>} title="Get Recognized" description="Showcase your talents, build your portfolio, and get noticed by industry leaders."/>
                </ul>
            </div>
        </div>
      </section>

      {/* Featured Contests Section */}
      {activeContests.length > 0 && (
        <section>
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)]">Featured Contests</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-muted)]">
                  Check out some of our currently active contests. Join one today!
              </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activeContests.map(contest => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
          {contests.filter(c => c.status === 'active').length > 3 && (
              <div className="text-center mt-12">
                  <Link to="/" className="theme-gradient-bg theme-gradient-bg-hover text-white font-semibold px-6 py-3 rounded-lg">
                      View All Contests
                  </Link>
              </div>
          )}
        </section>
      )}

      {/* Pricing Plans Section */}
      <section>
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)]">Flexible Plans for Every Business</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-[var(--color-text-muted)]">
                Choose the subscription plan that fits your company's needs and start hosting contests today.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {MOCK_PACKAGES.map(pkg => (
                <PackageCard 
                    key={pkg.id}
                    pkg={pkg}
                    isCurrent={false}
                    onSelect={handleSelectPackage}
                />
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-[var(--color-bg-card)] rounded-xl p-12 border theme-gradient-border">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)]">Ready to Get Started?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-[var(--color-text-muted)]">
            Join thousands of companies and participants on the best platform for online contests.
          </p>
          <div className="mt-8">
            <Link to="/auth" className="theme-gradient-bg theme-gradient-bg-hover text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg">
                Join Now for Free
            </Link>
          </div>
      </section>
    </div>
  );
};

const BenefitItem: React.FC<{icon: React.ReactNode; title: string; description: string}> = ({ icon, title, description }) => (
    <li className="flex items-start">
        <div className="flex-shrink-0 p-3 rounded-full bg-slate-100 dark:bg-slate-700/50 text-[var(--color-primary-start)] mr-4">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-[var(--color-text-heading)]">{title}</h4>
            <p className="text-[var(--color-text-muted)] text-sm">{description}</p>
        </div>
    </li>
);

export default HomePage;