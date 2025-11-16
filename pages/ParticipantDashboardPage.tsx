
import React from 'react';
import { useAuth, useData } from '../App';
import { Link } from 'react-router-dom';

const ParticipantDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { contests } = useData();

  // Mocked data for entered contests - using an item from the global context
  const enteredContests = contests.length > 2 ? [contests[2]] : [];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome, {user.display_name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">My Contest History</h2>
            <div className="space-y-4">
              {enteredContests.length > 0 ? (
                enteredContests.map(contest => (
                  <div key={contest.id} className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-700">
                    <div>
                      <Link to={`/contest/${contest.id}`} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{contest.title}</Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status: {contest.status}</p>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">Winner - 1st Place!</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">You haven't entered any contests yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">My Profile</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {user.display_name}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboardPage;
