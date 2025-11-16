import React from 'react';
import type { Package } from '../types';
import { CheckIcon } from './Icons';

interface PackageCardProps {
  pkg: Package;
  isCurrent: boolean;
  onSelect: () => void;
  isSelected?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, isCurrent, onSelect, isSelected }) => {
  const isHighlighted = isCurrent || isSelected;

  return (
    <div 
      className={`border-2 rounded-xl p-6 flex flex-col transition-all duration-300 ${isCurrent ? '' : 'cursor-pointer'} ${isHighlighted ? 'theme-gradient-border shadow-lg shadow-[var(--shadow-color)]/20' : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary-start)]'}`}
      onClick={!isCurrent ? onSelect : undefined}
    >
      <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">{pkg.name}</h3>
      <p className="text-[var(--color-text-muted)] mt-2 mb-4 h-10">{pkg.description}</p>
      <div className="my-4">
        <span className="text-4xl font-extrabold text-[var(--color-text-heading)]">${pkg.price}</span>
        <span className="text-base font-medium text-[var(--color-text-muted)]">/{pkg.billing_period}</span>
      </div>
      <ul className="space-y-3 text-[var(--color-text-base)] flex-grow">
        <li className="flex items-center"><CheckIcon /> <span className="ml-2.5">{pkg.max_questions_per_contest} questions/contest</span></li>
        <li className="flex items-center"><CheckIcon /> <span className="ml-2.5">{pkg.max_simultaneous_contests} active contests</span></li>
        <li className="flex items-center"><CheckIcon /> <span className="ml-2.5">{pkg.display_impressions.toLocaleString()} impressions</span></li>
        <li className="flex items-center"><CheckIcon /> <span className="ml-2.5 text-xs">{pkg.allowed_question_types.join(', ')}</span></li>
      </ul>
      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full mt-8 py-2.5 px-4 rounded-md font-semibold transition-colors text-sm ${
            isCurrent ? 'bg-slate-200 dark:bg-slate-700 text-[var(--color-text-muted)] cursor-not-allowed' 
            : isSelected ? 'theme-gradient-bg text-white' 
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-[var(--color-text-base)]'}`}
      >
        {isCurrent ? 'Current Plan' : isSelected ? 'Selected' : 'Choose Plan'}
      </button>
    </div>
  );
};

export default PackageCard;