import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_COMPANIES, MOCK_USERS } from '../constants';
import type { Question, Winner } from '../types';
import { useAuth, useData } from '../App';
import { TrophyIcon } from '../components/Icons';

const QuestionComponent: React.FC<{ question: Question }> = ({ question }) => {
  const [answer, setAnswer] = useState<string | string[]>([]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {question.media_url && (
        <div className="mb-4 aspect-video">
          <video
            src={question.media_url}
            controls
            className="w-full h-full object-cover rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <p className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">{question.order_index}. {question.prompt}</p>
      {question.type === 'text' && (
        <input type="text" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      )}
      {question.type === 'single_choice' && (
        <div className="space-y-2">
          {question.options?.map(option => (
            <label key={option} className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <input type="radio" name={`q${question.id}`} value={option} className="form-radio h-5 w-5 text-indigo-600" />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      )}
      {question.type === 'multi_choice' && (
        <div className="space-y-2">
          {question.options?.map(option => (
            <label key={option} className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <input type="checkbox" value={option} className="form-checkbox h-5 w-5 text-indigo-600 rounded" />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      )}
      {(question.type === 'image_upload' || question.type === 'video_upload') && (
        <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
      )}
    </div>
  );
};

const ContestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { contests } = useData();
  const contest = contests.find(c => c.id === parseInt(id || '0'));
  
  if (!contest) {
    return <div className="text-center text-red-500">Contest not found.</div>;
  }

  const company = MOCK_COMPANIES.find(c => c.id === contest.company_id);
  const isEnded = contest.status === 'ended';
  const canParticipate = user && user.role === 'participant' && !isEnded;

  const WinnerDisplay: React.FC<{ winner: Winner }> = ({ winner }) => {
    const winnerUser = MOCK_USERS.find(u => u.id === winner.user_id);
    const colors = {
        1: 'text-yellow-400',
        2: 'text-gray-400',
        3: 'text-yellow-600'
    };
    const positionText = {
        1: '1st Place',
        2: '2nd Place',
        3: '3rd Place'
    }

    return (
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center">
                <TrophyIcon className={`w-6 h-6 mr-3 ${colors[winner.position as keyof typeof colors]}`} />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{winnerUser?.display_name || 'Unknown User'}</span>
            </div>
            <span className={`font-bold text-gray-600 dark:text-gray-300 ${colors[winner.position as keyof typeof colors]}`}>{positionText[winner.position as keyof typeof positionText]}</span>
        </div>
    );
  };


  return (
    <div className="max-w-4xl mx-auto">
      <img src={contest.media_url} alt={contest.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <div className="flex items-center mb-4">
        <img src={company?.logo_url} alt={company?.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{contest.title}</h1>
          <p className="text-md text-gray-500 dark:text-gray-400">by {company?.name}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-8">{contest.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b pb-2">Questions</h2>
            {contest.questions.sort((a,b) => a.order_index - b.order_index).map(q => (
              <QuestionComponent key={q.id} question={q} />
            ))}
        </div>
        <aside className="md:col-span-1 space-y-6">
            {contest.prizes && contest.prizes.length > 0 && (
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Prizes</h2>
                     <ul className="space-y-3">
                        {contest.prizes.map(prize => (
                            <li key={prize.position} className="flex items-start">
                                <TrophyIcon className="w-5 h-5 mt-0.5 text-yellow-500 mr-2 flex-shrink-0" />
                                <div>
                                    <span className="font-bold text-gray-700 dark:text-gray-200">{prize.position}{prize.position === 1 ? 'st' : prize.position === 2 ? 'nd' : 'rd'} Place:</span>
                                    <p className="text-gray-600 dark:text-gray-400">{prize.description}</p>
                                </div>
                            </li>
                        ))}
                     </ul>
                 </div>
            )}
            {isEnded && contest.winners && contest.winners.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                     <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Winners</h2>
                     <div className="space-y-3">
                        {contest.winners.sort((a,b) => a.position - b.position).map(winner => (
                            <WinnerDisplay key={winner.user_id} winner={winner} />
                        ))}
                     </div>
                 </div>
            )}
        </aside>
      </div>

      <div className="mt-8 text-center">
        {canParticipate ? (
          <button className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
            Submit Entry
          </button>
        ) : isEnded ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-700 dark:text-gray-300">This contest has ended.</div>
        ) : (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-lg text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">
                You must be logged in as a participant to enter. <Link to="/auth" className="font-bold underline">Login here</Link>.
            </div>
        )}
      </div>
    </div>
  );
};

export default ContestPage;