import React from 'react';

export const LogoIcon: React.FC = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--color-primary-start)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-primary-end)', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path fill="url(#logoGradient)" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
    </svg>
);

export const CalendarIcon: React.FC = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

export const ClockIcon: React.FC = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

export const CheckIcon: React.FC = () => (
  <svg className="w-5 h-5 text-[var(--color-primary-start)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
  </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.772.117-1.606-.44-2.162A1 1 0 0 0 9.207.224L8.793 1.25l-.414-.414a1 1 0 0 0-1.414 0l-1.414 1.414a1 1 0 0 0 0 1.414l.414.414-1.027.414a1 1 0 0 0-.224 1.213c.243.562.775.98 1.487 1.134.712.153 1.44-.04 1.962-.562l.414-.414.414.414c.522.522 1.25.715 1.962.562.712-.154 1.244-.572 1.487-1.134.324-.772.117-1.606-.44-2.162L11.207 2.224l.414-.414a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.414.414 1.027-.414ZM18 10a1 1 0 0 1-1 1h-1.068a1 1 0 1 0 0 2h1.068a1 1 0 1 1 0 2h-1.068a1 1 0 1 0 0 2h1.068a1 1 0 1 1 0 2h-1.068a1 1 0 0 0 0 2h1.068a1 1 0 1 0 0-2h-1.068a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1ZM3 10a1 1 0 0 1-1 1h-1.068a1 1 0 1 0 0 2h1.068a1 1 0 1 1 0 2H1a1 1 0 1 0 0 2h1.068a1 1 0 1 1 0 2H1a1 1 0 1 0 0-2h1.068a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75V4.5h8V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4.5A1.25 1.25 0 0 1 8.75 3.25V3h2.5v.25A1.25 1.25 0 0 1 10 4.5ZM.75 5.75A.75.75 0 0 0 0 6.5v.25a.75.75 0 0 0 .75.75h18.5a.75.75 0 0 0 .75-.75V6.5a.75.75 0 0 0-.75-.75H.75ZM1.5 8.5v6.5A2.5 2.5 0 0 0 4 17.5h12a2.5 2.5 0 0 0 2.5-2.5V8.5h-17Z" clipRule="evenodd" />
    </svg>
);

export const TrophyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M15.5 2.25a.75.75 0 0 0-1.5 0v2.543a.75.75 0 0 0 1.5 0V2.25Z" />
        <path d="M4.5 2.25a.75.75 0 0 1 1.5 0v2.543a.75.75 0 0 1-1.5 0V2.25Z" />
        <path fillRule="evenodd" d="M11.832 2.132a.75.75 0 0 1-.664.922l-1.332.266a.75.75 0 0 1-.826-.826l.266-1.332a.75.75 0 0 1 .922-.664l1.332-.266a.75.75 0 0 1 .826.826l-.266 1.332Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M8.168 2.132a.75.75 0 0 0 .664.922l1.332.266a.75.75 0 0 0 .826-.826l-.266-1.332a.75.75 0 0 0-.922-.664l-1.332-.266a.75.75 0 0 0-.826.826l.266 1.332Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10 5.25a.75.75 0 0 1 .75.75v.033c.422.038.83.13 1.218.272a.75.75 0 0 1 .432 1.312c-1.33.824-2.266 2.25-2.4 3.901H10a.75.75 0 0 1 0-1.5h-.001a2.25 2.25 0 0 0-2.18-2.033.75.75 0 0 1 .68-1.432 3.76 3.76 0 0 1 1.5-.272V6a.75.75 0 0 1 .75-.75Zm-3.75 3a.75.75 0 0 0-1.5 0v5.337c0 .966.784 1.75 1.75 1.75h.5a.75.75 0 0 0 1.5 0h1.5a.75.75 0 0 0 1.5 0h1.5a.75.75 0 0 0 1.5 0h.5c.966 0 1.75-.784 1.75-1.75V8.25a.75.75 0 0 0-1.5 0v5.337a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25V8.25Z" clipRule="evenodd" />
    </svg>
);

export const ArchiveBoxIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
      <path d="M3.5 3A1.5 1.5 0 0 0 2 4.5v2.256a.75.75 0 0 0 1.5 0V4.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v2.256a.75.75 0 0 0 1.5 0V4.5A1.5 1.5 0 0 0 16.5 3h-13Z" />
      <path d="M2 8.605a.75.75 0 0 0 0 1.5h16a.75.75 0 0 0 0-1.5H2Z" />
      <path d="M2 11.855a1.5 1.5 0 0 0-1.5 1.5v2.896A1.5 1.5 0 0 0 2 17.75h16a1.5 1.5 0 0 0 1.5-1.5v-2.895a1.5 1.5 0 0 0-1.5-1.5H2Zm8.5 2.395a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0v-.5Z" />
    </svg>
);

export const PencilIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
    </svg>
);
