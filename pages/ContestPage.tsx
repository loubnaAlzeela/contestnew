
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_COMPANIES, MOCK_USERS } from '../constants';
import type { Question, Winner } from '../types';
import { useAuth, useContests } from '../App';
import { TrophyIcon } from '../components/Icons';

const QuestionComponent: React.FC<{ question: Question, canParticipate: boolean }> = ({ question, canParticipate }) => {
  const [answer, setAnswer] = useState<string | string[]>([]);

  return (
    <div className="bg-[var(--color-bg-card)] p-6 rounded-lg border border-[var(--color-border)]">
      {question.media_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <video
            src={question.media_url}
            controls
            className="w-full h-96 object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <p className="font-semibold text-lg text-[var(--color-text-heading)] mb-4">{question.order_index}. {question.prompt}</p>
      {question.type === 'text' && (
        <input type="text" disabled={!canParticipate} className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-bg-body)] text-[var(--color-text-base)]" />
      )}
      {question.type === 'single_choice' && (
        <div className="space-y-2">
          {question.options?.map(option => (
            <label key={option} className={`flex items-center p-3 rounded-md transition-colors ${canParticipate ? 'hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer' : 'opacity-70'}`}>
              <input type="radio" disabled={!canParticipate} name={`q${question.id}`} value={option} className="form-radio h-5 w-5 text-[var(--color-primary-start)] bg-transparent border-[var(--color-border)]" />
              <span className="ml-3 text-[var(--color-text-base)]">{option}</span>
            </label>
          ))}
        </div>
      )}
      {question.type === 'multi_choice' && (
        <div className="space-y-2">
          {question.options?.map(option => (
            <label key={option} className={`flex items-center p-3 rounded-md transition-colors ${canParticipate ? 'hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer' : 'opacity-70'}`}>
              <input type="checkbox" disabled={!canParticipate} value={option} className="form-checkbox h-5 w-5 text-[var(--color-primary-start)] bg-transparent border-[var(--color-border)] rounded" />
              <span className="ml-3 text-[var(--color-text-base)]">{option}</span>
            </label>
          ))}
        </div>
      )}
      {(question.type === 'image_upload' || question.type === 'video_upload') && (
        <input type="file" disabled={!canParticipate} className="text-sm text-[var(--color-text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900/50 dark:file:text-teal-300 dark:hover:file:bg-teal-900"/>
      )}
    </div>
  );
};

const ContestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { contests, loading, error } = useContests();
  
  if (loading) {
    return <div className="text-center text-[var(--color-text-muted)]">Loading contest...</div>;
  }
  
  const contest = contests.find(c => c.id === parseInt(id || '0'));
  
  if (error || !contest) {
    return <div className="text-center text-red-500">{error || 'Contest not found.'}</div>;
  }

  const company = MOCK_COMPANIES.find(c => c.id === contest.company_id);
  const isEnded = contest.status === 'ended';
  const canParticipate = user && user.role === 'participant' && !isEnded;

  const WinnerDisplay: React.FC<{ winner: Winner }> = ({ winner }) => {
    const winnerUser = MOCK_USERS.find(u => u.id === winner.user_id);
    const colors = {
        1: 'text-yellow-400',
        2: 'text-slate-400',
        3: 'text-yellow-600'
    };
    const positionText = {
        1: '1st Place',
        2: '2nd Place',
        3: '3rd Place'
    }

    return (
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center">
                <TrophyIcon className={`w-6 h-6 mr-3 ${colors[winner.position as keyof typeof colors]}`} />
                <span className="font-semibold text-[var(--color-text-heading)]">{winnerUser?.display_name || 'Unknown User'}</span>
            </div>
            <span className={`font-bold text-[var(--color-text-muted)] ${colors[winner.position as keyof typeof colors]}`}>{positionText[winner.position as keyof typeof positionText]}</span>
        </div>
    );
  };


  return (
    <div className="max-w-5xl mx-auto">
      <img src={contest.media_url} alt={contest.title} className="w-full h-72 object-cover rounded-xl mb-6" />
      <div className="flex items-center mb-4">
        <img src={company?.logo_url} alt={company?.name} className="w-16 h-16 rounded-full mr-4 border-4 border-[var(--color-bg-card)] -mt-12" />
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text-heading)]">{contest.title}</h1>
          <p className="text-md text-[var(--color-text-muted)]">by {company?.name}</p>
        </div>
      </div>
      <p className="text-[var(--color-text-base)] mb-8">{contest.description}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-[var(--color-text-heading)] border-b border-[var(--color-border)] pb-2">Questions</h2>
            {contest.questions.sort((a,b) => a.order_index - b.order_index).map(q => (
              <QuestionComponent key={q.id} question={q} canParticipate={!!canParticipate} />
            ))}
        </div>
        <aside className="lg:col-span-1 space-y-6">
            {contest.prizes && contest.prizes.length > 0 && (
                 <div className="bg-[var(--color-bg-card)] p-6 rounded-lg border border-[var(--color-border)]">
                     <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">Prizes</h2>
                     <ul className="space-y-3">
                        {contest.prizes.map(prize => (
                            <li key={prize.position} className="flex items-start">
                                <TrophyIcon className="w-5 h-5 mt-0.5 text-yellow-500 mr-3 flex-shrink-0" />
                                <div>
                                    <span className="font-bold text-[var(--color-text-base)]">{prize.position}{prize.position === 1 ? 'st' : prize.position === 2 ? 'nd' : 'rd'} Place:</span>
                                    <p className="text-[var(--color-text-muted)]">{prize.description}</p>
                                </div>
                            </li>
                        ))}
                     </ul>
                 </div>
            )}
            {isEnded && contest.winners && contest.winners.length > 0 && (
                <div className="bg-[var(--color-bg-card)] p-6 rounded-lg border border-[var(--color-border)]">
                     <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">Winners</h2>
                     <div className="space-y-3">
                        {contest.winners.sort((a,b) => a.position - b.position).map(winner => (
                            <WinnerDisplay key={winner.user_id} winner={winner} />
                        ))}
                     </div>
                 </div>
            )}
        </aside>
      </div>

      <div className="mt-10 mb-10 text-center">
        {canParticipate ? (
          <button className="theme-gradient-bg theme-gradient-bg-hover text-white font-bold py-3 px-12 rounded-lg transition-all text-lg shadow-lg shadow-[var(--shadow-color)]/20">
            Submit Entry
          </button>
        ) : isEnded ? (
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-[var(--color-text-muted)]">This contest has ended.</div>
        ) : (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">
                You must be logged in as a participant to enter. <Link to="/auth" className="font-bold underline hover:text-yellow-600 dark:hover:text-yellow-100">Login here</Link>.
            </div>
        )}
      </div>
    </div>
  );
};

export default ContestPage;
