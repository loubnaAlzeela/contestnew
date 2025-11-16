
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
      className={`border rounded-lg p-6 flex flex-col transition-all duration-200 ${isCurrent ? '' : 'cursor-pointer'} ${isHighlighted ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200 dark:border-gray-700'}`}
      onClick={!isCurrent ? onSelect : undefined}
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">{pkg.description}</p>
      <div className="mb-6">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${pkg.price}</span>
        <span className="text-base font-medium text-gray-500 dark:text-gray-400">/{pkg.billing_period}</span>
      </div>
      <ul className="space-y-3 text-gray-600 dark:text-gray-300 flex-grow">
        <li className="flex items-center"><CheckIcon /> <span className="ml-2">{pkg.max_questions_per_contest} questions/contest</span></li>
        <li className="flex items-center"><CheckIcon /> <span className="ml-2">{pkg.max_simultaneous_contests} active contests</span></li>
        <li className="flex items-center"><CheckIcon /> <span className="ml-2">{pkg.display_impressions.toLocaleString()} impressions</span></li>
        <li className="flex items-center"><CheckIcon /> <span className="ml-2">{pkg.allowed_question_types.join(', ')}</span></li>
      </ul>
      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={`w-full mt-8 py-2 px-4 rounded-md font-semibold transition-colors ${
            isCurrent ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' 
            : isSelected ? 'bg-indigo-700 text-white' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {isCurrent ? 'Current Plan' : isSelected ? 'Selected' : 'Choose Plan'}
      </button>
    </div>
  );
};

export default PackageCard;
