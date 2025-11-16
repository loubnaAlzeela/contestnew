import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, useData } from '../App';
import { MOCK_PACKAGES, MOCK_SUBSCRIPTIONS } from '../constants';
import type { Contest, Package, Question, QuestionType, Prize } from '../types';
import PackageCard from '../components/PackageCard';
import { generateContestIdea } from '../services/geminiService';
import { SparklesIcon, TrashIcon, ArchiveBoxIcon, PencilIcon } from '../components/Icons';

type DashboardView = 'contests' | 'form' | 'subscription' | 'analytics' | 'profile';
const inputClasses = "block w-full rounded-lg border-0 bg-[var(--color-bg-body)] py-2.5 px-3.5 text-[var(--color-text-base)] ring-1 ring-inset ring-[var(--color-border)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary-start)] sm:text-sm sm:leading-6 transition-all duration-150";


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
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-28">
        <div className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)] shadow-lg shadow-[var(--shadow-color)]/5">
          <nav className="space-y-1.5">
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
      <main className="flex-grow w-full">
        <div className="bg-[var(--color-bg-card)] p-6 sm:p-8 rounded-xl border border-[var(--color-border)] min-h-[500px] shadow-lg shadow-[var(--shadow-color)]/5">
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
    className={`relative w-full text-left px-4 py-2.5 rounded-md transition-colors duration-150 text-sm font-medium ${activeView === view ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400' : 'text-[var(--color-text-muted)] hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
  >
     <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-colors ${activeView === view ? 'bg-teal-500' : 'bg-transparent'}`}></span>
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
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 dark:bg-green-900/50 dark:text-green-300" role="alert">
                    <p className="font-bold">Success</p>
                    <p>{notification}</p>
                </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-[var(--color-text-heading)]">My Contests</h2>
                {userPackage && (
                     <div className="text-sm bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                        <span className="font-semibold text-[var(--color-text-muted)]">Active: </span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">{activeContestsCount} / {userPackage.max_simultaneous_contests}</span>
                     </div>
                )}
            </div>
            <div className="space-y-3">
                {myContests.length > 0 ? myContests.map(contest => {
                    const isEditable = new Date(contest.start_datetime) > new Date();
                    const isEnded = contest.status === 'ended';

                    return (
                        <div key={contest.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border border-[var(--color-border)] rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:border-teal-400/50 dark:hover:border-teal-500/50 transition-colors">
                         <div className="md:col-span-3">
                           <h3 className="font-bold text-lg text-teal-600 dark:text-teal-400">{contest.title}</h3>
                           <p className="text-sm text-[var(--color-text-muted)] capitalize">{contest.status}</p>
                         </div>
                         <div className="md:col-span-2 text-sm text-[var(--color-text-base)]">
                            <p><strong>Starts:</strong> {new Date(contest.start_datetime).toLocaleDateString()}</p>
                            <p><strong>Ends:</strong> {new Date(contest.end_datetime).toLocaleDateString()}</p>
                         </div>
                         <div className="md:col-span-1 flex items-center gap-1 justify-self-start md:justify-self-end">
                             <button 
                                onClick={() => onEdit(contest)} 
                                disabled={!isEditable}
                                className="p-2 text-[var(--color-text-muted)] hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                title={!isEditable ? "Cannot edit a contest that has already started" : "Edit contest"}
                             >
                                <PencilIcon className="w-5 h-5" />
                             </button>
                             {isEditable && (
                                <button
                                    onClick={() => handleDelete(contest.id, contest.title)}
                                    className="p-2 text-[var(--color-text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                                    title="Delete contest"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                            {isEnded && (
                                <button
                                    onClick={() => handleArchive(contest)}
                                    className="p-2 text-[var(--color-text-muted)] hover:text-violet-600 dark:hover:text-violet-400 transition-colors rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/50"
                                    title="Archive contest"
                                >
                                    <ArchiveBoxIcon className="w-5 h-5" />
                                </button>
                            )}
                         </div>
                       </div>
                    );
                }) : (
                    <div className="text-center py-10 text-[var(--color-text-muted)] border-2 border-dashed border-[var(--color-border)] rounded-lg">
                        <p className="font-medium">You haven't created any contests yet.</p>
                    </div>
                )}
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
        setError('');
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
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-6">{isEditing ? 'Edit Contest' : 'Create New Contest'}</h2>
            
            {!isEditing && (
                <div className="p-5 rounded-lg mb-8 border-2 theme-gradient-border">
                    <div className="flex items-start">
                        <SparklesIcon className="w-8 h-8 text-teal-500 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Stuck for ideas? Let AI help!</h3>
                            <p className="text-sm text-[var(--color-text-muted)] mb-3">Enter a topic and our AI will generate a title, description, and questions to get you started.</p>
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                 <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., 'Sustainable Living'" className={`flex-grow w-full ${inputClasses}`} />
                                 <button onClick={handleGenerate} disabled={isLoading} className="theme-gradient-bg theme-gradient-bg-hover text-white px-5 py-2.5 rounded-md font-semibold disabled:opacity-70 flex items-center w-full sm:w-auto justify-center">
                                    {isLoading ? 'Generating...' : 'Generate'}
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div className="pb-6 border-b border-[var(--color-border)]">
                        <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">Contest Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">Contest Title</label>
                                <input type="text" value={contest.title || ''} onChange={e => handleFieldChange('title', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">Description</label>
                                <textarea value={contest.description || ''} onChange={e => handleFieldChange('description', e.target.value)} rows={3} className={inputClasses}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="pb-6 border-b border-[var(--color-border)]">
                         <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">Start Time</label>
                                <input type="datetime-local" value={formatDateTimeLocal(contest.start_datetime)} onChange={e => handleDateChange('start_datetime', e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">End Time</label>
                                <input type="datetime-local" value={formatDateTimeLocal(contest.end_datetime)} onChange={e => handleDateChange('end_datetime', e.target.value)} className={inputClasses} />
                            </div>
                        </div>
                    </div>
                
                    <div className="pb-6 border-b border-[var(--color-border)]">
                        <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">Prizes</h3>
                        <div className="space-y-3">
                            <input type="text" placeholder="1st Place Prize Description" value={contest.prizes?.find(p=>p.position===1)?.description || ''} onChange={e => handlePrizeChange(1, e.target.value)} className={inputClasses} />
                            <input type="text" placeholder="2nd Place Prize Description" value={contest.prizes?.find(p=>p.position===2)?.description || ''} onChange={e => handlePrizeChange(2, e.target.value)} className={inputClasses} />
                            <input type="text" placeholder="3rd Place Prize Description" value={contest.prizes?.find(p=>p.position===3)?.description || ''} onChange={e => handlePrizeChange(3, e.target.value)} className={inputClasses} />
                        </div>
                    </div>
                
                    <div>
                        <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">Questions</h3>
                        <div className="space-y-4">
                            {(contest.questions || []).map((q, qIndex) => (
                            <div key={q.id || qIndex} className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-body)]">
                                <div className="flex justify-between items-start mb-3 gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">
                                            Question {qIndex + 1}
                                        </label>
                                        <input type="text" placeholder="Enter your question prompt" value={q.prompt} onChange={(e) => handleQuestionChange(qIndex, 'prompt', e.target.value)} className={inputClasses} />
                                    </div>
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="mt-7 text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove question"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {userPackage?.allowed_question_types.includes('video_upload') && (
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">Optional Media URL
                                                <input type="text" placeholder="https://..." value={q.media_url || ''} onChange={(e) => handleQuestionChange(qIndex, 'media_url', e.target.value)} className={inputClasses} />
                                            </label>
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">Question Type
                                            <select value={q.type} onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value as QuestionType)} className={inputClasses}>
                                                {userPackage?.allowed_question_types.map(type => (<option key={type} value={type}>{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>))}
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                {(q.type === 'single_choice' || q.type === 'multi_choice') && (
                                    <div className="pl-4 border-l-2 border-teal-200 dark:border-teal-800 space-y-2 pt-2 mt-2">
                                        <label className="block text-sm font-medium text-[var(--color-text-heading)]">Options</label>
                                        {(q.options || []).map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} className={`text-sm ${inputClasses}`} />
                                                <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove option"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOption(qIndex)} className="text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium">+ Add Option</button>
                                    </div>
                                )}
                            </div>
                            ))}
                        </div>
                        <button type="button" onClick={addQuestion} className="mt-4 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-[var(--color-text-muted)] rounded-lg py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-semibold">+ Add Question</button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center -mb-4">{error}</p>}
                
                <div className="flex items-center gap-4 pt-4">
                    <button type="submit" className="theme-gradient-bg theme-gradient-bg-hover text-white px-8 py-2.5 rounded-md font-bold text-base">{isEditing ? 'Update Contest' : 'Save Contest'}</button>
                    <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-800 px-6 py-2.5 rounded-md hover:bg-slate-300 font-medium dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Cancel</button>
                </div>
            </form>
        </div>
    );
};

const SubscriptionView: React.FC = () => {
    const { user, companies } = useAuth();
    const company = companies.find(c => c.id === user?.company_id);
    const subscription = MOCK_SUBSCRIPTIONS.find(s => s.company_id === company?.id);

    return (
        <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-6">My Subscription</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_PACKAGES.map(pkg => (
                    <PackageCard 
                        key={pkg.id} 
                        pkg={pkg}
                        isCurrent={pkg.id === subscription?.package_id}
                        isSelected={pkg.id === subscription?.package_id}
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
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">Analytics</h2>
            <p className="text-[var(--color-text-muted)]">Analytics dashboard is coming soon. You'll see detailed reports on contest performance, participant engagement, and more!</p>
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

        if (companyName !== myCompany.name) {
            updateCompanyProfile(myCompany.id, { name: companyName });
        }
        
        const userUpdates: Partial<typeof user> = {};
        if (email !== user.email) {
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
            <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-8">Company Profile</h2>
            {message.text && (
                 <div className={`p-4 mb-6 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`} role="alert">
                    {message.text}
                 </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">Company Name</label>
                        <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-heading)] mb-1">Admin Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} />
                    </div>
                </div>

                <div className="border-t pt-8 border-[var(--color-border)]">
                    <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Change Password</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">Leave fields blank to keep your current password.</p>
                    <div className="space-y-4">
                        <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClasses} />
                        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClasses} />
                        <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClasses} />
                    </div>
                </div>
                <div>
                    <button type="submit" className="theme-gradient-bg theme-gradient-bg-hover text-white px-8 py-2.5 rounded-md font-bold">Save Changes</button>
                </div>
            </form>
        </div>
    );
}

export default CompanyDashboardPage;