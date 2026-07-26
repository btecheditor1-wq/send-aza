import React, { useState } from 'react';

interface ItemLogoProps {
  id: string;
  name: string;
  fallbackImage?: string;
  className?: string;
}

export const ItemLogo: React.FC<ItemLogoProps> = ({ id, name, fallbackImage, className = 'w-full h-full' }) => {
  const [imgError, setImgError] = useState(false);
  const cleanId = id ? id.toLowerCase() : '';

  // Moniepoint primary logo
  if (cleanId === 'moniepoint' && !imgError) {
    return (
      <img
        src="/assets/moniepoint.png"
        alt="Moniepoint"
        className={`${className} object-contain`}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.endsWith('/assets/moniepoint.png')) {
            target.src = '/moniepoint.png';
          } else {
            setImgError(true);
          }
        }}
      />
    );
  }

  // Stanbic IBTC primary logo
  if (cleanId === 'stanbic' && !imgError) {
    return (
      <img
        src="/assets/logo.png"
        alt="Stanbic IBTC"
        className={`${className} object-contain`}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.endsWith('/assets/logo.png')) {
            target.src = '/logo.png';
          } else {
            setImgError(true);
          }
        }}
      />
    );
  }

  // Attempt PNG image from assets if not errored
  const candidateImg = fallbackImage || `/assets/${cleanId}.png`;
  if (!imgError && candidateImg) {
    return (
      <img
        src={candidateImg}
        alt={name}
        className={`${className} object-contain`}
        onError={() => setImgError(true)}
      />
    );
  }

  switch (cleanId) {
    case 'nigeria':
      return (
        <svg className={className} viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="40" rx="4" fill="white" />
          <rect width="20" height="40" rx="2" fill="#008751" />
          <rect x="40" width="20" height="40" rx="2" fill="#008751" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
        </svg>
      );

    case 'usa':
      return (
        <svg className={className} viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="40" rx="4" fill="#B22234" />
          <rect y="3.07" width="60" height="3.07" fill="white" />
          <rect y="9.23" width="60" height="3.07" fill="white" />
          <rect y="15.38" width="60" height="3.07" fill="white" />
          <rect y="21.53" width="60" height="3.07" fill="white" />
          <rect y="27.69" width="60" height="3.07" fill="white" />
          <rect y="33.84" width="60" height="3.07" fill="white" />
          <rect width="24" height="21.53" rx="2" fill="#3C3B6E" />
          <circle cx="4" cy="4" r="1" fill="white" />
          <circle cx="12" cy="4" r="1" fill="white" />
          <circle cx="20" cy="4" r="1" fill="white" />
          <circle cx="8" cy="8.5" r="1" fill="white" />
          <circle cx="16" cy="8.5" r="1" fill="white" />
          <circle cx="4" cy="13" r="1" fill="white" />
          <circle cx="12" cy="13" r="1" fill="white" />
          <circle cx="20" cy="13" r="1" fill="white" />
          <circle cx="8" cy="17.5" r="1" fill="white" />
          <circle cx="16" cy="17.5" r="1" fill="white" />
        </svg>
      );

    case 'uk':
      return (
        <svg className={className} viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="40" rx="4" fill="#012169" />
          <path d="M0 0L60 40M60 0L0 40" stroke="white" strokeWidth="8" />
          <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
          <path d="M30 0V40M0 20H60" stroke="white" strokeWidth="12" />
          <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="7" />
        </svg>
      );

    case 'southafrica':
      return (
        <svg className={className} viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="40" rx="4" fill="#002395" />
          <rect width="60" height="20" fill="#E03C31" />
          <path d="M0 0L25 17H60V23H25L0 40" stroke="white" strokeWidth="10" />
          <path d="M0 0L25 17H60V23H25L0 40" stroke="#007A4D" strokeWidth="6" />
          <path d="M0 4L20 20L0 36Z" fill="#FFB81C" />
          <path d="M0 7L16 20L0 33Z" fill="#000000" />
        </svg>
      );

    case 'paypal':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#003087" />
          <path
            d="M20 16H31C35.5 16 38.5 18 38 22.5C37.5 27 34 29.5 29.5 29.5H23.5L21.5 42H16L20 16Z"
            fill="#0079C1"
          />
          <path
            d="M25 21H35C39 21 42 23 41.5 27C41 31.5 37.5 34 33 34H27.5L25.5 45H21L25 21Z"
            fill="#00457C"
            opacity="0.5"
          />
          <path
            d="M25 21H35C39 21 41.5 23 41 27C40.5 31 37.5 33.5 33 33.5H27.5L25.5 45H21.5L25 21Z"
            fill="#0079C1"
          />
        </svg>
      );

    case 'cashapp':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#00D632" />
          <text
            x="30"
            y="43"
            fontSize="38"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            fill="white"
            textAnchor="middle"
          >
            $
          </text>
        </svg>
      );

    case 'gcash':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#005CE6" />
          <circle cx="30" cy="30" r="18" fill="none" stroke="white" strokeWidth="4" />
          <text
            x="30"
            y="37"
            fontSize="20"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            fill="white"
            textAnchor="middle"
          >
            G
          </text>
        </svg>
      );

    case 'wallets':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#1E1B4B" />
          <circle cx="23" cy="25" r="10" fill="#F7931A" />
          <text x="23" y="30" fontSize="13" fontWeight="bold" fill="white" textAnchor="middle">₿</text>
          <circle cx="37" cy="35" r="10" fill="#627EEA" />
          <text x="37" y="40" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">Ξ</text>
        </svg>
      );

    case 'access':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#002D62" />
          <g transform="translate(10, 8) scale(0.68)">
            <path d="M18 25L30 7L42 25L30 43L18 25Z" fill="none" stroke="#E07A5F" strokeWidth="4" />
            <path d="M23 25L30 15L37 25L30 35L23 25Z" fill="none" stroke="#E07A5F" strokeWidth="3" />
            <path d="M27 25L30 21L33 25L30 29L27 25Z" fill="#E07A5F" />
          </g>
          <text x="30" y="52" fontSize="9" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.5">ACCESS</text>
        </svg>
      );

    case 'gtbank':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#DD4B1A" />
          <rect x="36" y="10" width="14" height="14" fill="white" />
          <text x="30" y="42" fontSize="14" fontWeight="900" fontFamily="sans-serif" fill="white" textAnchor="middle">GTBank</text>
        </svg>
      );

    case 'uba':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#D32F2F" />
          <text x="30" y="38" fontSize="20" fontWeight="900" fill="white" textAnchor="middle">UBA</text>
        </svg>
      );

    case 'zenith':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#E11D48" />
          <text x="30" y="41" fontSize="28" fontWeight="900" fill="white" textAnchor="middle">Z</text>
        </svg>
      );

    case 'firstbank':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#0A2540" />
          <circle cx="30" cy="24" r="11" fill="#D97706" />
          <path d="M25 24C25 21 28 19 30 19C33 19 35 22 34 25C33 27 31 29 27 29H35" stroke="#0A2540" strokeWidth="2.5" strokeLinecap="round" />
          <text x="30" y="50" fontSize="8" fontWeight="bold" fill="#D97706" textAnchor="middle">FirstBank</text>
        </svg>
      );

    case 'opay':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#10B981" />
          <circle cx="30" cy="30" r="16" fill="white" />
          <circle cx="30" cy="30" r="8" fill="#10B981" />
        </svg>
      );

    case 'palmpay':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#6C2BD9" />
          <circle cx="30" cy="30" r="15" fill="#FACC15" />
          <text x="30" y="37" fontSize="20" fontWeight="900" fill="#6C2BD9" textAnchor="middle">P</text>
        </svg>
      );

    case 'moniepoint':
      return (
        <img
          src="/assets/moniepoint.png"
          alt="Moniepoint"
          className={`${className} object-contain`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/moniepoint.png';
          }}
        />
      );

    case 'fidelity':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#002D62" />
          <path d="M15 18H45V25H15V18Z" fill="#00A859" />
          <text x="30" y="48" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">Fidelity</text>
        </svg>
      );

    case 'stanbic':
      return (
        <img
          src="/assets/logo.png"
          alt="Stanbic IBTC"
          className={`${className} object-contain`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/logo.png';
          }}
        />
      );

    case 'kuda':
      return (
        <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="14" fill="#401967" />
          <text x="30" y="40" fontSize="26" fontWeight="900" fill="#40D3A6" textAnchor="middle">K</text>
        </svg>
      );

    default:
      if (fallbackImage) {
        return (
          <img
            src={fallbackImage}
            alt={name}
            className={`${className} object-contain`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      }
      return (
        <div className={`w-full h-full rounded-xl bg-gradient-to-br from-slate-800 to-indigo-900 text-white font-extrabold text-xs flex items-center justify-center uppercase shadow-xs ${className}`}>
          {name ? name.substring(0, 2) : 'AZ'}
        </div>
      );
  }
};
