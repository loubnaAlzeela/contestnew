
import React from 'react';
import { useData } from '../App';
import ContestCard from '../components/ContestCard';

const HomePage: React.FC = () => {
  const { contests } = useData();
  const activeContests = contests.filter(c => c.status === 'active');

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Discover & Compete</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Join exciting contests from top companies and win amazing prizes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeContests.map(contest => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
