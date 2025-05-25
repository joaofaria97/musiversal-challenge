import Link from 'next/link';

interface LogoProps {
  className?: string; // For the Link container
  textClassName?: string; // For additional text styling
  size?: 'small' | 'medium' | 'large' | 'xlarge'; // Added 'xlarge'
}

export default function Logo({ className, textClassName, size = 'medium' }: LogoProps) {
  let textSizeClass = 'text-3xl'; // Default medium size
  if (size === 'small') textSizeClass = 'text-2xl';
  if (size === 'large') textSizeClass = 'text-4xl'; // Adjusted large size slightly for potentially better balance
  if (size === 'xlarge') textSizeClass = 'text-5xl md:text-6xl'; // Larger, responsive for very large

  return (
    <Link href="/" className={`flex items-center ${className || ''}`}>
      {/* Optional: If you have an SVG logo, you can add it here */}
      {/* <img src="/logo.svg" alt="Vinly Logo" className="h-8 w-8" /> */}
      <h1 
        className={`
          font-bold font-cursive 
          text-slate-900 // Changed to solid black (or very dark slate)
          select-none cursor-default 
          ${textSizeClass} 
          ${textClassName || ''}
        `}
      >
        Vinly
      </h1>
    </Link>
  );
} 