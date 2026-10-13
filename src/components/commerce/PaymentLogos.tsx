import React from 'react';

// ==========================================
// 1. PayHere Official Brand Logo
// ==========================================
export const PayHereLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 160 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* PayHere Icon Symbol */}
        <rect width="40" height="40" rx="9" fill="#0A3D62" />
        <path
          d="M12 14C12 12.8954 12.8954 12 14 12H23C26.3137 12 29 14.6863 29 18C29 21.3137 26.3137 24 23 24H17V28H12V14Z"
          fill="#FA8231"
        />
        <path
          d="M17 16V20H22.5C23.6046 20 24.5 19.1046 24.5 18C24.5 16.8954 23.6046 16 22.5 16H17Z"
          fill="white"
        />
        <path
          d="M21 21L29 29H23.5L18 23.5L21 21Z"
          fill="#38ADA9"
        />
        {/* Brand Text */}
        <text
          x="48"
          y="26"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="20"
          fill="#0A3D62"
          letterSpacing="-0.5px"
        >
          Pay<tspan fill="#FA8231">Here</tspan>
        </text>
      </svg>
    </div>
  );
};

// ==========================================
// 2. WEBXPAY Official Brand Logo
// ==========================================
export const WebXPayLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 170 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Green Diamond/Hex Fintech Emblem */}
        <rect width="40" height="40" rx="9" fill="#00A86B" />
        <path
          d="M13 14L17.5 26L21 17L24.5 26L29 14H25.5L23.2 21.5L20 13H18.5L15.3 21.5L13 14Z"
          fill="white"
          stroke="white"
          strokeWidth="0.5"
        />
        <circle cx="21" cy="27" r="2.5" fill="#F4D03F" />
        {/* Brand Typography */}
        <text
          x="48"
          y="26"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="20"
          fill="#1E293B"
          letterSpacing="-0.5px"
        >
          WEB<tspan fill="#00A86B">X</tspan>PAY
        </text>
      </svg>
    </div>
  );
};

// ==========================================
// 3. PayPal Official Brand Logo
// ==========================================
export const PayPalLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 150 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Distinctive PayPal Double-P */}
        <g transform="translate(4, 2) scale(0.95)">
          <path
            d="M9.8 30.5L14.2 4.2C14.5 2.5 15.9 1.2 17.6 1.2H27.9C33.8 1.2 37.8 4.2 36.9 10.3C36.1 15.4 32.5 19.4 27.5 19.4H21.5L18.8 34.6C18.6 35.6 17.7 36.4 16.6 36.4H11.2C9.9 36.4 9 35.1 9.2 33.8L9.8 30.5Z"
            fill="#003087"
          />
          <path
            d="M16.6 22.8L18.9 9.5C19.1 8.2 20.2 7.2 21.5 7.2H30.4C34.7 7.2 37.6 9.4 37 13.9C36.4 17.7 33.8 20.7 30 20.7H25.3L23.4 32.2C23.2 33.2 22.3 34 21.2 34H17.8C16.9 34 16.1 33.2 16.3 32.2L16.6 22.8Z"
            fill="#0079C1"
          />
          <path
            d="M16.6 22.8H25.3C29.1 22.8 31.7 19.8 32.3 16C31.5 20.4 28.1 22.8 23.4 22.8H18.9L16.6 22.8Z"
            fill="#002157"
          />
        </g>
        {/* Brand Text */}
        <text
          x="46"
          y="26"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="21"
          fill="#003087"
          fontStyle="italic"
        >
          Pay<tspan fill="#0079C1">Pal</tspan>
        </text>
      </svg>
    </div>
  );
};

// ==========================================
// 4. Cash on Delivery (COD) Premium Badge
// ==========================================
export const CodLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="h-8 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-sm text-gray-900 tracking-tight">CASH ON DELIVERY</span>
        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Pay at Doorstep</span>
      </div>
    </div>
  );
};

// ==========================================
// 5. Accepted Method Badges (Visa, MC, LankaQR, etc)
// ==========================================
export const VisaBadge: React.FC = () => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white font-bold text-[10px] text-[#1A1F71] tracking-wider shadow-2xs">
    VISA
  </span>
);

export const MastercardBadge: React.FC = () => (
  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-bold shadow-2xs">
    <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block -mr-1" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] inline-block opacity-85" />
    <span className="text-[9px] font-bold text-gray-800 ml-0.5">MC</span>
  </span>
);

export const AmexBadge: React.FC = () => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-blue-200 bg-[#006FCF] text-white font-extrabold text-[9px] tracking-wider shadow-2xs">
    AMEX
  </span>
);

export const LankaQrBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-red-200 bg-red-50 text-[9px] font-extrabold text-red-700 tracking-wider shadow-2xs">
    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
    LankaQR
  </span>
);

export const MobileWalletBadge: React.FC<{ label: string; color?: string }> = ({
  label,
  color = 'bg-blue-50 text-blue-700 border-blue-200',
}) => (
  <span className={`inline-flex items-center px-1.5 py-0.5 rounded border ${color} text-[9px] font-bold tracking-tight shadow-2xs`}>
    {label}
  </span>
);
