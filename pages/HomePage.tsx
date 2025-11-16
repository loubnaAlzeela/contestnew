import React from 'react';
import { useData } from '../App';
import ContestCard from '../components/ContestCard';

const HomePage: React.FC = () => {
  const { contests } = useData();
  const activeContests = contests.filter(c => c.status === 'active');

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-text-heading)] leading-tight">
          Discover & Compete in
          <br/>
          <span className="theme-gradient-text">AI-Powered Contests</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--color-text-muted)]">
          Join exciting challenges from top companies, showcase your skills, and win amazing prizes.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {activeContests.map(contest => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;