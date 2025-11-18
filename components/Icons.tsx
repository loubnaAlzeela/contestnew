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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75c0-5.056 2.383-9.555 6.084-12.436A6.75 6.75 0 0 1 9.315 7.584Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M3 8.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75ZM6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75ZM10.5 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0v-18a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
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

export const BoltIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M14.615 1.585a.75.75 0 0 1 .359.852L12.982 9.75h2.77a.75.75 0 0 1 .579.908l-7.5 12.25a.75.75 0 0 1-1.33.088l1.992-6.5h-2.77a.75.75 0 0 1-.579-.908l7.5-12.25a.75.75 0 0 1 .971-.088Z" clipRule="evenodd" />
    </svg>
);

export const ClipboardListIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657z" />
        <path fillRule="evenodd" d="M18.75 6H5.25a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-12a1.5 1.5 0 0 0-1.5-1.5zM9 12a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 12zm0 3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 9 15z" clipRule="evenodd" />
    </svg>
);

export const UsersIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM5.25 9.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3ZM14.25 11.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
        <path fillRule="evenodd" d="M1.5 15.75a.75.75 0 0 1 .75-.75h19.5a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75ZM2.25 19.5a.75.75 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5H2.25Z" clipRule="evenodd" />
    </svg>
);

export const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

export const TwitterIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

export const FacebookIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

export const LinkedInIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

export const MegaphoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.5a.75.75 0 0 0 .5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.3l.793.42a1.5 1.5 0 0 0 1.914-.585l3.25-5.25a1.5 1.5 0 0 0 0-1.664l-3.25-5.25a1.5 1.5 0 0 0-1.914-.585l-.793.42v-1.3Z" />
      <path d="M15 12a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 15 12Z" />
    </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c-1.035 0-1.875.84-1.875 1.875v9.375c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V10.5c0-1.035-.84-1.875-1.875-1.875h-.75ZM3 15.375c-1.035 0-1.875.84-1.875 1.875V21c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875v-3.75c0-1.035-.84-1.875-1.875-1.875h-.75Z" />
    </svg>
);

export const GiftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.256A4.5 4.5 0 0 1 16.5 9h-1.886a1.875 1.875 0 0 1-1.875-1.875V2.25h-1.5v4.875c0 1.036.84 1.875 1.875 1.875h1.886a3 3 0 0 0-2.998 3.118 3.755 3.755 0 0 1 .88 2.532.75.75 0 0 1-1.5 0 2.255 2.255 0 0 0-.53-1.424A3 3 0 0 0 9.39 15H3.75a3 3 0 0 0-3 3v1.5a1.5 1.5 0 0 0 1.5 1.5h19.5a1.5 1.5 0 0 0 1.5-1.5v-1.5a3 3 0 0 0-3-3h-5.64a3 3 0 0 0-2.202-2.352 2.255 2.255 0 0 0-.528-1.424.75.75 0 0 1-1.5 0 3.755 3.755 0 0 1 .88-2.532A3 3 0 0 0 14.612 9h-1.886a1.875 1.875 0 0 1-1.875-1.875V2.25a.75.75 0 0 1 .75-.75Z" />
      <path d="M3.75 16.5a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v.75a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75v-.75Z" />
    </svg>
);

export const PuzzlePieceIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
      <path fillRule="evenodd" d="M8.657 4.005a3.375 3.375 0 0 1 6.686 0l.534 1.603a.75.75 0 0 0 .584.583l1.604.534a3.375 3.375 0 0 1 0 6.686l-1.603.534a.75.75 0 0 0-.583.584l-.534 1.603a3.375 3.375 0 0 1-6.686 0l-.534-1.603a.75.75 0 0 0-.584-.583l-1.603-.534a3.375 3.375 0 0 1 0-6.686l1.603-.534a.75.75 0 0 0 .583-.584l.534-1.603Zm9.528 10.96a.75.75 0 0 0-1.06-1.06l-1.958 1.957a.75.75 0 1 0 1.06 1.06l1.958-1.957Z" clipRule="evenodd" />
      <path d="M11.625 18.75a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1 0-1.5h7.125a.75.75 0 0 1 .75.75Z" />
    </svg>
);
