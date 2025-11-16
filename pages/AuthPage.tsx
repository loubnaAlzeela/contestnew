import React, { useState } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { MOCK_PACKAGES } from '../constants';
import PackageCard from '../components/PackageCard';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<'participant' | 'company'>('participant');
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  // Payment fields state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [error, setError] = useState('');
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password.');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('Email and password fields are required.');
      return;
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    if (role === 'company') {
      if (!companyName) {
        setError('Company name is required.');
        return;
      }
      if (!selectedPackageId) {
        setError('Please select a subscription plan.');
        return;
      }
      if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
        setError('Please enter your payment details.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
        setError('Please enter a valid expiry date (MM/YY).');
        return;
      }
    }
  
    register({
      email,
      password_hash: password,
      role,
      companyName: role === 'company' ? companyName : undefined,
      packageId: role === 'company' ? selectedPackageId : undefined,
    });
  };

  const handleSubmit = isLogin ? handleLogin : handleRegister;

  React.useEffect(() => {
    if (user) {
        const dashboardPath = user.role.startsWith('company') ? '/company/dashboard' : '/participant/dashboard';
        navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCompanyName('');
    setRole('participant');
    setSelectedPackageId(null);
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setError('');
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatCardExpiry = (value: string) => {
    let v = value.replace(/[^0-9]/g, '');
    if (v.length > 2) {
      v = v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };
  
  const inputClasses = "relative block w-full appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg-body)] px-3 py-2 text-[var(--color-text-base)] placeholder-[var(--color-text-muted)] focus:z-10 focus:border-[var(--color-border-focus)] sm:text-sm";


  return (
    <div className="flex items-center justify-center min-h-full py-12">
      <div className="w-full max-w-lg p-8 space-y-8 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-xl shadow-[var(--shadow-color)]/10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-[var(--color-text-heading)]">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg">
          <button onClick={() => { setIsLogin(true); resetForm(); }} className={`w-1/2 py-2.5 text-center text-sm font-medium rounded-md transition-colors ${isLogin ? 'bg-[var(--color-bg-card)] text-[var(--color-text-heading)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]'}`}>
            Sign In
          </button>
          <button onClick={() => { setIsLogin(false); resetForm(); }} className={`w-1/2 py-2.5 text-center text-sm font-medium rounded-md transition-colors ${!isLogin ? 'bg-[var(--color-bg-card)] text-[var(--color-text-heading)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]'}`}>
            Sign Up
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="pb-4">
              <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">I am a...</label>
              <div className="flex rounded-md">
                <button type="button" onClick={() => setRole('participant')} className={`w-full px-4 py-2 text-sm font-medium border border-[var(--color-border)] ${role === 'participant' ? 'theme-gradient-bg text-white z-10' : 'bg-transparent text-[var(--color-text-base)]'} rounded-l-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none`}>
                  Participant
                </button>
                <button type="button" onClick={() => setRole('company')} className={`w-full -ml-px px-4 py-2 text-sm font-medium border border-[var(--color-border)] ${role === 'company' ? 'theme-gradient-bg text-white z-10' : 'bg-transparent text-[var(--color-text-base)]'} rounded-r-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none`}>
                  Company
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && role === 'company' && (
              <div>
                <label htmlFor="company-name" className="sr-only">Company Name</label>
                <input id="company-name" name="companyName" type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClasses} placeholder="Company Name" />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="Password" />
            </div>
            {!isLogin && (
                 <div>
                 <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                 <input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} placeholder="Confirm Password" />
               </div>
            )}
          </div>

          {!isLogin && role === 'company' && (
            <div className="pt-4 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-center text-[var(--color-text-heading)] mb-4">Choose your plan</h3>
                <div className="grid grid-cols-1 gap-4">
                  {MOCK_PACKAGES.map(pkg => (
                    <PackageCard 
                      key={pkg.id} 
                      pkg={pkg}
                      isCurrent={false}
                      isSelected={pkg.id === selectedPackageId}
                      onSelect={() => setSelectedPackageId(pkg.id)}
                    />
                  ))}
                </div>
              </div>

              {selectedPackageId && (
                <div>
                  <h3 className="text-lg font-medium text-center text-[var(--color-text-heading)] mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Cardholder Name" required value={cardName} onChange={e => setCardName(e.target.value)} className={inputClasses} />
                    <input type="text" placeholder="Card Number" required value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} maxLength={19} className={inputClasses} />
                    <div className="flex gap-4">
                      <input type="text" placeholder="MM/YY" required value={cardExpiry} onChange={e => setCardExpiry(formatCardExpiry(e.target.value))} maxLength={5} className={`w-1/2 ${inputClasses}`} />
                      <input type="text" placeholder="CVC" required value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))} maxLength={4} className={`w-1/2 ${inputClasses}`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm text-center text-red-500 pt-4">{error}</p>}
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white theme-gradient-bg theme-gradient-bg-hover disabled:opacity-70"
              disabled={!isLogin && role === 'company' && !selectedPackageId}
            >
              {isLogin ? 'Sign in' : 'Create Account & Subscribe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;