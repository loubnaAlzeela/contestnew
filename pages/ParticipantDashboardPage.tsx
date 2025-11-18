
import React from 'react';
import { useAuth, useContests } from '../App';
import { Link } from 'react-router-dom';
import { TrophyIcon } from '../components/Icons';

const ParticipantDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { contests, loading } = useContests();

  // Mocked data for entered contests - using an item from the global context
  const enteredContests = contests.length > 2 ? [contests[2]] : [];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] mb-2">Welcome Back,</h1>
      <p className="text-4xl md:text-6xl font-extrabold theme-gradient-text mb-10">{user.display_name}!</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-[var(--color-bg-card)] p-6 rounded-xl border border-[var(--color-border)] shadow-lg shadow-[var(--shadow-color)]/5">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-heading)]">My Contest History</h2>
          <div className="space-y-4">
            {loading ? (
                <div className="text-center py-10 text-[var(--color-text-muted)]">Loading contest history...</div>
            ) : enteredContests.length > 0 ? (
              enteredContests.map(contest => (
                <div key={contest.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <Link to={`/contest/${contest.id}`} className="font-bold text-lg text-teal-600 dark:text-teal-400 hover:underline">{contest.title}</Link>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Status: <span className="font-medium capitalize text-[var(--color-text-base)]">{contest.status}</span></p>
                  </div>
                  <div className="flex items-center mt-3 sm:mt-0 font-bold text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 px-4 py-2 rounded-full text-sm">
                      <TrophyIcon className="w-5 h-5 mr-2" />
                      <span>Winner - 1st Place!</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border)] rounded-lg">
                  <p className="font-medium">You haven't entered any contests yet.</p>
                  <Link to="/" className="mt-4 inline-block theme-gradient-bg theme-gradient-bg-hover text-white font-semibold px-5 py-2.5 rounded-md text-sm">Find a Contest</Link>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1 bg-[var(--color-bg-card)] p-6 rounded-xl border border-[var(--color-border)] shadow-lg shadow-[var(--shadow-color)]/5">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-heading)]">My Profile</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3"><span className="font-semibold text-[var(--color-text-muted)]">Name:</span> <span className="text-[var(--color-text-base)] font-medium">{user.display_name}</span></div>
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3"><span className="font-semibold text-[var(--color-text-muted)]">Email:</span> <span className="text-[var(--color-text-base)] font-medium">{user.email}</span></div>
            <div className="flex justify-between items-center"><span className="font-semibold text-[var(--color-text-muted)]">Joined:</span> <span className="text-[var(--color-text-base)] font-medium">{new Date(user.created_at).toLocaleDateString()}</span></div>
          </div>
          <button className="w-full mt-6 bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold uppercase tracking-wider py-3 rounded-lg text-sm transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboardPage;
