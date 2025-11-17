import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, useData } from '../App';
import { MOCK_PACKAGES, MOCK_SUBSCRIPTIONS } from '../constants';
import type { Contest, Question, QuestionType, Prize, ContestStatus } from '../types';
import { generateContestIdea } from '../services/geminiService';
import { SparklesIcon, TrashIcon, BoltIcon, ClipboardListIcon, UsersIcon, PencilIcon } from '../components/Icons';

const inputClasses = "block w-full rounded-lg border-0 bg-[var(--color-bg-body)] py-2.5 px-3.5 text-[var(--color-text-base)] ring-1 ring-inset ring-[var(--color-border)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary-start)] sm:text-sm sm:leading-6 transition-all duration-150";


const CompanyDashboardPage: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [editingContest, setEditingContest] = useState<Contest | null>(null);

  const handleCreateNew = () => {
    setEditingContest(null);
    setView('form');
  };

  const handleEditContest = (contest: Contest) => {
    setEditingContest(contest);
    setView('form');
  };

  const handleBackToDashboard = () => {
    setEditingContest(null);
    setView('dashboard');
  };

  const handleSave = () => {
    setEditingContest(null);
    setView('dashboard');
  };

  if (view === 'form') {
    return <ContestFormView contestToEdit={editingContest} onSave={handleSave} onCancel={handleBackToDashboard} />;
  }

  return <DashboardView onCreateNew={handleCreateNew} onEditContest={handleEditContest} />;
};


const DashboardView: React.FC<{ onCreateNew: () => void, onEditContest: (contest: Contest) => void }> = ({ onCreateNew, onEditContest }) => {
    const { user } = useAuth();
    const { contests } = useData();

    const myContests = useMemo(() => 
        contests.filter(c => c.company_id === user?.company_id), 
    [contests, user]);

    const activeContestsCount = useMemo(() => 
        myContests.filter(c => c.status === 'active').length,
    [myContests]);
    
    const totalContestsCount = myContests.length;

    const subscription = useMemo(() => MOCK_SUBSCRIPTIONS.find(s => s.company_id === user?.company_id), [user]);
    const userPackage = useMemo(() => MOCK_PACKAGES.find(p => p.id === subscription?.package_id), [subscription]);

    const totalParticipants = 1428; // Mock data from image
    
    // A simple way to get a shorter display name
    const getDisplayName = () => {
      if (!user) return "User";
      const name = user.display_name.replace('Admin', '').replace('Corp', '').trim();
      return name.split(' ')[0] || user.display_name;
    };
    const displayName = getDisplayName();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--color-text-heading)]">Welcome back, {displayName}!</h1>
                <p className="text-md text-[var(--color-text-muted)] mt-1">Here's a summary of your contest activities.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    icon={<SparklesIcon />} 
                    title="Subscription Plan" 
                    value={userPackage?.name || 'N/A'} 
                />
                <StatCard 
                    icon={<BoltIcon />} 
                    title="Active Contests" 
                    value={activeContestsCount} 
                />
                <StatCard 
                    icon={<ClipboardListIcon />} 
                    title="Total Contests" 
                    value={totalContestsCount} 
                />
                <StatCard 
                    icon={<UsersIcon />} 
                    title="Total Participants" 
                    value={totalParticipants.toLocaleString()} 
                />
            </div>

            <div className="bg-[var(--color-bg-card)] p-6 sm:p-8 rounded-xl border border-[var(--color-border)] shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-[var(--color-text-heading)]">Your Contests</h2>
                    <button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>
                        Create Contest
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--color-text-muted)]">
                        <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-medium tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 font-medium tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 font-medium tracking-wider">End Date</th>
                                <th scope="col" className="px-6 py-3 font-medium tracking-wider">Participants</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {myContests.length > 0 ? (
                                myContests.map(contest => <ContestTableRow key={contest.id} contest={contest} onEdit={onEditContest} />)
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
                                        You haven't created any contests yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number }> = ({ icon, title, value }) => {
    return (
        <div className="bg-[var(--color-bg-card)] p-5 rounded-xl border border-[var(--color-border)] flex items-center gap-4 shadow-sm">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600 dark:text-blue-400">
                {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
            </div>
            <div>
                <p className="text-sm text-[var(--color-text-muted)]">{title}</p>
                <p className="text-2xl font-bold text-[var(--color-text-heading)]">{value}</p>
            </div>
        </div>
    );
};

const ContestTableRow: React.FC<{ contest: Contest, onEdit: (contest: Contest) => void }> = ({ contest, onEdit }) => {
    const isEditable = new Date(contest.start_datetime) > new Date();
    
    const getStatusChip = (status: ContestStatus) => {
        const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-flex items-center";
        const colors = {
            active: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
            ended: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
            scheduled: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
            draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
            archived: "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300",
        };
        return <span className={`${baseClasses} ${colors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    }

    return (
        <tr className="bg-[var(--color-bg-card)] border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <th scope="row" className="px-6 py-4 font-bold text-[var(--color-text-heading)] whitespace-nowrap">
                {contest.title}
            </th>
            <td className="px-6 py-4">{getStatusChip(contest.status)}</td>
            <td className="px-6 py-4">{new Date(contest.end_datetime).toLocaleDateString()}</td>
            <td className="px-6 py-4">N/A</td>
            <td className="px-6 py-4 text-right">
                 <button 
                    onClick={() => onEdit(contest)} 
                    disabled={!isEditable}
                    className="p-2 text-[var(--color-text-muted)] hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-teal-100 dark:hover:bg-teal-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title={!isEditable ? "Cannot edit a contest that has already started" : "Edit contest"}
                 >
                    <PencilIcon className="w-4 h-4" />
                 </button>
            </td>
        </tr>
    );
}

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
        <div className="bg-[var(--color-bg-card)] p-6 sm:p-8 rounded-xl border border-[var(--color-border)] min-h-[500px] shadow-lg shadow-[var(--shadow-color)]/5">
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


export default CompanyDashboardPage;
