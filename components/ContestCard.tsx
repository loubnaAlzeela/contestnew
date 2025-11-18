import React from 'react';
import { Link } from 'react-router-dom';
import type { Contest } from '../types';
import { MOCK_COMPANIES } from '../constants';
import { ClockIcon } from './Icons';

interface ContestCardProps {
  contest: Contest;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  const company = MOCK_COMPANIES.find(c => c.id === contest.company_id);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="absolute top-4 right-4 bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-teal-900/50 dark:text-teal-300">Active</div>;
      case 'ended':
        return <div className="absolute top-4 right-4 bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-slate-700 dark:text-slate-300">Ended</div>;
      default:
        return null;
    }
  };

  const endDate = new Date(contest.end_datetime);

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:shadow-[var(--shadow-color)]/10 transition-all duration-300 group hover:-translate-y-2">
      <Link to={`/contest/${contest.id}`} className="block">
        <div className="relative">
          <img className="w-full h-48 object-cover rounded-t-xl" src={contest.media_url} alt={contest.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-xl"></div>
          {getStatusChip(contest.status)}
        </div>
        <div className="p-5">
          <div className="flex items-center mb-3">
            <img className="w-8 h-8 rounded-full mr-3 border-2 border-white dark:border-slate-600" src={company?.logo_url} alt={company?.name} />
            <span className="text-sm font-semibold text-[var(--color-text-muted)]">{company?.name}</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-2 truncate group-hover:theme-gradient-text">{contest.title}</h3>
          <p className="text-[var(--color-text-base)] text-sm mb-4 line-clamp-2">{contest.description}</p>
          <div className="flex items-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3">
            <ClockIcon />
            <span className="ml-1.5">Ends on {endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContestCard;