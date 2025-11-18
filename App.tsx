

import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { User, Company, CompanySubscription, Contest } from './types';
import { MOCK_USERS, MOCK_COMPANIES, MOCK_SUBSCRIPTIONS, MOCK_CONTESTS } from './constants';
import HomePage from './pages/HomePage';
import ContestPage from './pages/ContestPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';
import ParticipantDashboardPage from './pages/ParticipantDashboardPage';
import AuthPage from './pages/AuthPage';
import Header from './components/Header';
import Footer from './components/Footer';

interface RegisterDetails {
  email: string;
  password_hash: string;
  role: 'participant' | 'company';
  companyName?: string;
  packageId?: number;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  companies: Company[];
  login: (email: string, password_hash: string) => boolean;
  logout: () => void;
  register: (details: RegisterDetails) => void;
  updateUserProfile: (userId: number, newProfile: Partial<User>) => void;
  updateCompanyProfile: (companyId: number, newProfile: Partial<Company>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// This hook manages contest data, simulating async fetching from a backend.
// This is the key to making the app compatible with a headless CMS like WordPress.
export const useContests = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data from a WordPress REST API
    const fetchContests = async () => {
      try {
        setLoading(true);
        // == PRODUCTION-READY: API INTEGRATION POINT ==
        // In a real app, this would be an API call to your WordPress backend.
        // Replace the mock data promise with a real fetch call like this:
        /*
        const response = await fetch('https://your-wordpress-site.com/wp-json/wp/v2/contests');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setContests(data);
        */
        // For now, we simulate the API call with mock data and a short delay.
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setContests(MOCK_CONTESTS);
        setError(null);
      } catch (e) {
        setError("Failed to load contests.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const addContest = async (newContest: Contest) => {
    // == PRODUCTION-READY: API INTEGRATION POINT ==
    // In a real app, this would be a POST request to the API.
    /*
    await fetch('https://your-wordpress-site.com/wp-json/wp/v2/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_AUTH_TOKEN' },
        body: JSON.stringify(newContest)
    });
    */
    // We simulate it by updating local state.
    setContests(prevContests => [...prevContests, newContest]);
  };
  
  const updateContest = async (updatedContest: Contest) => {
     // == PRODUCTION-READY: API INTEGRATION POINT ==
     // In a real app, this would be a PUT request to the API.
     /*
     await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/contests/${updatedContest.id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_AUTH_TOKEN' },
         body: JSON.stringify(updatedContest)
     });
     */
    setContests(prevContests => 
        prevContests.map(c => c.id === updatedContest.id ? updatedContest : c)
    );
  };
  
  const deleteContest = async (contestId: number) => {
    // == PRODUCTION-READY: API INTEGRATION POINT ==
    // In a real app, this would be a DELETE request to the API.
    /*
     await fetch(`https://your-wordpress-site.com/wp-json/wp/v2/contests/${contestId}`, {
         method: 'DELETE',
         headers: { 'Authorization': 'Bearer YOUR_AUTH_TOKEN' }
     });
    */
    setContests(prevContests => prevContests.filter(c => c.id !== contestId));
  };

  return { contests, loading, error, addContest, updateContest, deleteContest };
};


const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>(MOCK_SUBSCRIPTIONS);
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password_hash: string) => {
    const foundUser = users.find(u => u.email === email && u.password_hash === password_hash);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (details: RegisterDetails) => {
    if (users.find(u => u.email === details.email)) {
        alert("An account with this email already exists.");
        return;
    }

    if (details.role === 'participant') {
        const newUser: User = {
            id: users.length + 1,
            email: details.email,
            password_hash: details.password_hash,
            role: 'participant',
            display_name: details.email.split('@')[0],
            created_at: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
    } else if (details.role === 'company' && details.companyName && details.packageId) {
        const newUserId = users.length + 1;
        const newCompanyId = companies.length + 1;

        const newUser: User = {
            id: newUserId,
            email: details.email,
            password_hash: details.password_hash,
            role: 'company_admin',
            display_name: `${details.companyName} Admin`,
            created_at: new Date().toISOString(),
            company_id: newCompanyId,
        };

        const newCompany: Company = {
            id: newCompanyId,
            user_id: newUserId,
            name: details.companyName,
            slug: details.companyName.toLowerCase().replace(/\s+/g, '-'),
            description: 'A new and exciting company!',
            logo_url: `https://picsum.photos/seed/company${newCompanyId}/200`,
            website: '#',
            created_at: new Date().toISOString(),
        };

        const newSubscription: CompanySubscription = {
            id: subscriptions.length + 1,
            company_id: newCompanyId,
            package_id: details.packageId,
            start_date: new Date().toISOString(),
            end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            status: 'active',
            usage_impressions: 0,
            usage_questions: 0,
        };

        setUsers(prev => [...prev, newUser]);
        setCompanies(prev => [...prev, newCompany]);
        setSubscriptions(prev => [...prev, newSubscription]);
        setUser(newUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (userId: number, newProfile: Partial<User>) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...newProfile } : u));
    if (user?.id === userId) {
      setUser(prevUser => prevUser ? { ...prevUser, ...newProfile } : null);
    }
  };

  const updateCompanyProfile = (companyId: number, newProfile: Partial<Company>) => {
    setCompanies(prevCompanies => prevCompanies.map(c => c.id === companyId ? { ...c, ...newProfile } : c));
  };

  const authContextValue = useMemo(() => ({ user, users, companies, login, logout, register, updateUserProfile, updateCompanyProfile }), [user, users, companies]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <HashRouter>
        <div className="flex flex-col min-h-screen text-[var(--color-text-base)] app-fade-in">
          <Header />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contest/:id" element={<ContestPage />} />
              <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to={user.role.startsWith('company') ? "/company/dashboard" : "/participant/dashboard"} />} />
              
              <Route path="/company/dashboard" element={user && user.role.startsWith('company') ? <CompanyDashboardPage /> : <Navigate to="/auth" />} />
              <Route path="/participant/dashboard" element={user && user.role === 'participant' ? <ParticipantDashboardPage /> : <Navigate to="/auth" />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;