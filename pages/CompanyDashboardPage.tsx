
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, useData } from '../App';
import { MOCK_PACKAGES, MOCK_SUBSCRIPTIONS } from '../constants';
import type { Contest, Package, Question, QuestionType, Prize } from '../types';
import PackageCard from '../components/PackageCard';
import { generateContestIdea } from '../services/geminiService';
import { SparklesIcon, TrashIcon, ArchiveBoxIcon } from '../components/Icons';

type DashboardView = 'contests' | 'form' | 'subscription' | 'analytics' | 'profile';

const CompanyDashboardPage: React.FC = () => {
  const [activeView, setActiveView] = useState<DashboardView>('contests');
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleStartEdit = (contest: Contest) => {
    setEditingContest(contest);
    setActiveView('form');
  };

  const handleFormSave = (message: string) => {
    setNotification(message);
    setEditingContest(null);
    setActiveView('contests');
  };
  
  const handleFormCancel = () => {
    setEditingContest(null);
    setActiveView('contests');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Dashboard Menu</h2>
          <nav className="space-y-2">
            <NavItem text="My Contests" view="contests" activeView={activeView} setActiveView={setActiveView} />
            <NavItem text="Create Contest" view="form" activeView={activeView} setActiveView={(view) => {
              setEditingContest(null);
              setActiveView(view as DashboardView);
            }} />
            <NavItem text="Subscription" view="subscription" activeView={activeView} setActiveView={setActiveView} />
            <NavItem text="Analytics" view="analytics" activeView={activeView} setActiveView={setActiveView} />
            <NavItem text="Profile" view="profile" activeView={activeView} setActiveView={setActiveView} />
          </nav>
        </div>
      </aside>
      <main className="flex-grow">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow min-h-[500px]">
          {activeView === 'contests' && <ContestsView onEdit={handleStartEdit} notification={notification} />}
          {activeView === 'form' && <ContestFormView contestToEdit={editingContest} onSave={handleFormSave} onCancel={handleFormCancel} />}
          {activeView === 'subscription' && <SubscriptionView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'profile' && <ProfileView />}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ text: string, view: DashboardView, activeView: DashboardView, setActiveView: (view: DashboardView) => void }> = ({ text, view, activeView, setActiveView }) => (
  <button
    onClick={() => setActiveView(view)}
    className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm font-medium ${activeView === view ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
  >
    {text}
  </button>
);

const ContestsView: React.FC<{onEdit: (contest: Contest) => void; notification: string}> = ({ onEdit, notification }) => {
    const { user } = useAuth();
    const { contests, deleteContest, updateContest } = useData();
    const myContests = contests.filter(c => c.company_id === user?.company_id && c.status !== 'archived');

    const subscription = MOCK_SUBSCRIPTIONS.find(s => s.company_id === user?.company_id);
    const userPackage = MOCK_PACKAGES.find(p => p.id === subscription?.package_id);
    const activeContestsCount = myContests.filter(c => c.status === 'active').length;

    const handleArchive = (contest: Contest) => {
        if (window.confirm(`Are you sure you want to archive "${contest.title}"?`)) {
            updateContest({ ...contest, status: 'archived' });
        }
    };

    const handleDelete = (contestId: number, contestTitle: string) => {
        if (window.confirm(`Are you sure you want to permanently delete "${contestTitle}"? This action cannot be undone.`)) {
            deleteContest(contestId);
        }
    };

    return (
        <div>
            {notification && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                    <span className="block sm:inline">{notification}</span>
                </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Contests</h2>
                {userPackage && (
                     <div className="text-sm">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Active Contests: </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeContestsCount} / {userPackage.max_simultaneous_contests}</span>
                     </div>
                )}
            </div>
            <div className="space-y-4">
                {myContests.map(contest => {
                    const isEditable = new Date(contest.start_datetime) > new Date();
                    const isEnded = contest.status === 'ended';

                    return (
                        <div key={contest.id} className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-700">
                         <div>
                           <h3 className="font-bold text-indigo-600 dark:text-indigo-400">{contest.title}</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Status: {contest.status} | Starts: {new Date(contest.start_datetime).toLocaleDateString()} | Ends: {new Date(contest.end_datetime).toLocaleDateString()}</p>
                         </div>
                         <div className="flex items-center gap-2">
                             <button 
                                onClick={() => onEdit(contest)} 
                                disabled={!isEditable}
                                className="text-sm bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
                                title={!isEditable ? "Cannot edit a contest that has already started" : "Edit contest"}
                             >
                                Edit
                             </button>
                             {isEditable && (
                                <button
                                    onClick={() => handleDelete(contest.id, contest.title)}
                                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                                    title="Delete contest"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                            {isEnded && (
                                <button
                                    onClick={() => handleArchive(contest)}
                                    className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                    title="Archive contest"
                                >
                                    <ArchiveBoxIcon className="w-4 h-4" />
                                </button>
                            )}
                         </div>
                       </div>
                    );
                })}
            </div>
        </div>
    );
};

const defaultPrizes = [
    { position: 1 as const, description: '' },
    { position: 2 as const, description: '' },
    { position: 3 as const, description: '' },
];
const formatDateTimeLocal = (isoString: string | undefined) => isoString ? new Date(isoString).toISOString().slice(0, 16) : '';

const ContestFormView: React.FC<{
    contestToEdit: Contest | null;
    onSave: (message: string) => void;
    onCancel: () => void;
}> = ({ contestToEdit, onSave, onCancel }) => {
    
    const [contest, setContest] = useState<Partial<Contest>>({});
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { addContest, updateContest, contests } = useData();
    const { user } = useAuth();
    
    const isEditing = useMemo(() => !!contestToEdit, [contestToEdit]);

    useEffect(() => {
        if (contestToEdit) {
            setContest(contestToEdit);
        } else {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + 30);
            setContest({ 
                title: '', 
                description: '', 
                questions: [], 
                prizes: defaultPrizes,
                start_datetime: startDate.toISOString(),
                end_datetime: endDate.toISOString(),
            });
        }
    }, [contestToEdit]);

    const subscription = MOCK_SUBSCRIPTIONS.find(s => s.company_id === user?.company_id);
    const userPackage = MOCK_PACKAGES.find(p => p.id === subscription?.package_id);

    const handleGenerate = async () => {
        if (!topic) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const idea = await generateContestIdea(topic);
            setContest(prev => ({...prev, ...idea}));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldChange = (field: keyof Contest, value: any) => {
        setContest(prev => ({...prev, [field]: value}));
    };

    const handleDateChange = (field: 'start_datetime' | 'end_datetime', value: string) => {
        setContest(prev => ({...prev, [field]: new Date(value).toISOString()}));
    };

    const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...(contest.questions || [])];
        const questionToUpdate = { ...newQuestions[index], [field]: value };

        if (field === 'type' && (value === 'single_choice' || value === 'multi_choice') && !questionToUpdate.options) {
            questionToUpdate.options = [''];
        }
        if (field === 'type' && !['single_choice', 'multi_choice'].includes(value)) {
            delete questionToUpdate.options;
        }

        newQuestions[index] = questionToUpdate;
        setContest({ ...contest, questions: newQuestions });
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...(contest.questions || [])];
        const newOptions = [...(newQuestions[qIndex].options || [])];
        newOptions[oIndex] = value;
        newQuestions[qIndex].options = newOptions;
        setContest({ ...contest, questions: newQuestions });
    };
    
    const addOption = (qIndex: number) => {
        const newQuestions = [...(contest.questions || [])];
        const newOptions = [...(newQuestions[qIndex].options || []), ''];
        newQuestions[qIndex].options = newOptions;
        setContest({ ...contest, questions: newQuestions });
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...(contest.questions || [])];
        const newOptions = (newQuestions[qIndex].options || []).filter((_, index) => index !== oIndex);
        newQuestions[qIndex].options = newOptions;
        setContest({ ...contest, questions: newQuestions });
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            contest_id: contest.id || 0,
            prompt: '',
            type: 'text',
            order_index: (contest.questions?.length || 0) + 1,
        };
        setContest({ ...contest, questions: [...(contest.questions || []), newQuestion] });
    };

    const removeQuestion = (index: number) => {
        const newQuestions = (contest.questions || []).filter((_, i) => i !== index);
        setContest({ ...contest, questions: newQuestions });
    };
    
    const handlePrizeChange = (position: 1 | 2 | 3, description: string) => {
        const newPrizes = contest.prizes ? [...contest.prizes] : [...defaultPrizes];
        const prizeIndex = newPrizes.findIndex(p => p.position === position);
        if (prizeIndex > -1) {
            newPrizes[prizeIndex] = { ...newPrizes[prizeIndex], description };
        } else {
            newPrizes.push({ position, description });
        }
        setContest({...contest, prizes: newPrizes });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contest.title || !contest.description) {
            setError("Please provide a title and description.");
            return;
        }
        if (!user?.company_id) {
            setError("Could not identify your company. Please log in again.");
            return;
        }
        if (!userPackage) {
            setError("Could not find your subscription package.");
            return;
        }
        
        const finalContest: Contest = {
            id: contest.id || Date.now(),
            company_id: user.company_id,
            title: contest.title,
            slug: contest.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
            description: contest.description,
            media_url: contest.media_url || `https://picsum.photos/seed/contest${contest.id || Date.now()}/800/400`,
            start_datetime: contest.start_datetime!,
            end_datetime: contest.end_datetime!,
            status: new Date(contest.start_datetime!) > new Date() ? 'scheduled' : 'active',
            questions: (contest.questions || []).map((q, index) => ({
                ...q,
                id: q.id || Date.now() + index,
                contest_id: contest.id || 0,
            })),
            prizes: (contest.prizes || []).filter(p => p.description.trim() !== ''),
        };

        if (isEditing) {
            updateContest(finalContest);
            onSave("Contest updated successfully!");
        } else {
            const activeContestsCount = contests.filter(c => c.company_id === user.company_id && c.status === 'active').length;
            if (activeContestsCount >= userPackage.max_simultaneous_contests) {
                setError(`You have reached your limit of ${userPackage.max_simultaneous_contests} active contests. Please end one or upgrade your plan.`);
                return;
            }
            addContest(finalContest);
            onSave("Contest created successfully!");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{isEditing ? 'Edit Contest' : 'Create New Contest'}</h2>
            
            {!isEditing && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-6 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-start">
                        <SparklesIcon className="w-8 h-8 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">Stuck for ideas? Let AI help!</h3>
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">Enter a topic and our AI will generate a title, description, and questions to get you started.</p>
                            <div className="flex items-center gap-2">
                                 <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'Sustainable Living'" className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                 <button onClick={handleGenerate} disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                                    {isLoading ? 'Generating...' : 'Generate'}
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                        <input type="datetime-local" value={formatDateTimeLocal(contest.start_datetime)} onChange={e => handleDateChange('start_datetime', e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                        <input type="datetime-local" value={formatDateTimeLocal(contest.end_datetime)} onChange={e => handleDateChange('end_datetime', e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contest Title</label>
                    <input type="text" value={contest.title || ''} onChange={e => handleFieldChange('title', e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea value={contest.description || ''} onChange={e => handleFieldChange('description', e.target.value)} rows={3} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Prizes</h3>
                    <div className="space-y-2">
                        <input type="text" placeholder="1st Place Prize Description" value={contest.prizes?.find(p=>p.position===1)?.description || ''} onChange={e => handlePrizeChange(1, e.target.value)} className="block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="text" placeholder="2nd Place Prize Description" value={contest.prizes?.find(p=>p.position===2)?.description || ''} onChange={e => handlePrizeChange(2, e.target.value)} className="block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="text" placeholder="3rd Place Prize Description" value={contest.prizes?.find(p=>p.position===3)?.description || ''} onChange={e => handlePrizeChange(3, e.target.value)} className="block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Questions</h3>
                    <div className="space-y-4">
                        {(contest.questions || []).map((q, qIndex) => (
                           <div key={q.id || qIndex} className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex justify-between items-start mb-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-full">
                                        Question {qIndex + 1}
                                        <input type="text" placeholder="Enter your question prompt" value={q.prompt} onChange={(e) => handleQuestionChange(qIndex, 'prompt', e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </label>
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="ml-4 mt-6 text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove question"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                                {userPackage?.allowed_question_types.includes('video_upload') && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Optional Media URL (Video or Image)
                                            <input type="text" placeholder="https://example.com/video.mp4" value={q.media_url || ''} onChange={(e) => handleQuestionChange(qIndex, 'media_url', e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </label>
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Type
                                        <select value={q.type} onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value as QuestionType)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            {userPackage?.allowed_question_types.map(type => (<option key={type} value={type}>{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>))}
                                        </select>
                                    </label>
                                </div>
                                {(q.type === 'single_choice' || q.type === 'multi_choice') && (
                                    <div className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-2 pt-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                                        {(q.options || []).map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-grow p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" />
                                                <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove option"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOption(qIndex)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">+ Add Option</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={addQuestion} className="mt-4 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors font-semibold">+ Add Question</button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex items-center gap-4 pt-4">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-bold">{isEditing ? 'Update Contest' : 'Save Contest'}</button>
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 font-medium">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const SubscriptionView: React.FC = () => {
    const { user, companies } = useAuth();
    // Fix: Use `companies` from `useAuth` context instead of MOCK_COMPANIES.
    const company = companies.find(c => c.id === user?.company_id);
    const subscription = MOCK_SUBSCRIPTIONS.find(s => s.company_id === company?.id);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PACKAGES.map(pkg => (
                    <PackageCard 
                        key={pkg.id} 
                        pkg={pkg}
                        isCurrent={pkg.id === subscription?.package_id}
                        onSelect={() => alert(`Switching to ${pkg.name} plan.`)}
                    />
                ))}
            </div>
        </div>
    );
};

const AnalyticsView: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">Analytics dashboard is coming soon. You'll see detailed reports on contest performance, participant engagement, and more!</p>
        </div>
    );
};

const ProfileView: React.FC = () => {
    const { user, users, companies, updateUserProfile, updateCompanyProfile } = useAuth();
    const myCompany = companies.find(c => c.id === user?.company_id);

    const [companyName, setCompanyName] = useState(myCompany?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    if (!user || !myCompany) return <div>Loading profile...</div>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Update company name
        if (companyName !== myCompany.name) {
            updateCompanyProfile(myCompany.id, { name: companyName });
        }
        
        // Update user profile (email and password)
        const userUpdates: Partial<typeof user> = {};
        if (email !== user.email) {
            // Check if new email is already taken
            if (users.some(u => u.email === email && u.id !== user.id)) {
                setMessage({ type: 'error', text: 'This email address is already in use.' });
                return;
            }
            userUpdates.email = email;
        }

        if (newPassword) {
            if (newPassword !== confirmPassword) {
                setMessage({ type: 'error', text: 'New passwords do not match.' });
                return;
            }
            if (currentPassword !== user.password_hash) {
                setMessage({ type: 'error', text: 'Incorrect current password.' });
                return;
            }
            userUpdates.password_hash = newPassword;
        }

        if (Object.keys(userUpdates).length > 0) {
            updateUserProfile(user.id, userUpdates);
        }

        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };


    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Company Profile</h2>
            {message.text && (
                 <div className={`p-4 mb-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`} role="alert">
                    {message.text}
                 </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                    <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Change Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Leave fields blank to keep your current password.</p>
                    <div className="space-y-4">
                        <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
                <div>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-bold">Save Changes</button>
                </div>
            </form>
        </div>
    );
}

export default CompanyDashboardPage;