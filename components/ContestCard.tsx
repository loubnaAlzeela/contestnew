
import React from 'react';
import { Link } from 'react-router-dom';
import type { Contest } from '../types';
import { MOCK_COMPANIES } from '../constants';
import { CalendarIcon, ClockIcon } from './Icons';

interface ContestCardProps {
  contest: Contest;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  const company = MOCK_COMPANIES.find(c => c.id === contest.company_id);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Active</div>;
      case 'ended':
        return <div className="absolute top-4 right-4 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Ended</div>;
      default:
        return null;
    }
  };

  const endDate = new Date(contest.end_datetime);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/contest/${contest.id}`} className="block">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={contest.media_url} alt={contest.title} />
          {getStatusChip(contest.status)}
        </div>
        <div className="p-6">
          <div className="flex items-center mb-2">
            <img className="w-8 h-8 rounded-full mr-3" src={company?.logo_url} alt={company?.name} />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{company?.name}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">{contest.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{contest.description}</p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <ClockIcon />
            <span className="ml-1">Ends on {endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContestCard;
