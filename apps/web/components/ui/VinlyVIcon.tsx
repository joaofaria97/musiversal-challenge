import React from 'react';

interface VinlyVIconProps extends React.SVGProps<SVGSVGElement> {
  // You can add specific size props if needed, or control via className/style
}

export const VinlyVIcon: React.FC<VinlyVIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100" // Base viewBox for the V shape
      aria-hidden="true"
      {...props} // Spread other SVG props like className, width, height
    >
      <defs>
        <linearGradient id="vinlyVGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#7C3AED' }} /> {/* violet-600 */}
          <stop offset="100%" style={{ stopColor: '#4F46E5' }} /> {/* indigo-600 */}
        </linearGradient>
      </defs>
      {/* Path for a stylized V shape */}
      {/* M top-left-outer L bottom-mid-outer L top-right-outer L top-right-inner L bottom-mid-inner L top-left-inner Z */}
      <path
        d="M20,15 L50,85 L80,15 L65,15 L50,55 L35,15 Z"
        fill="url(#vinlyVGradient)"
      />
    </svg>
  );
}; 