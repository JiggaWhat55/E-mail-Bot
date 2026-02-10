import type { FC, ButtonHTMLAttributes } from 'react';

interface LCARSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'orange' | 'purple' | 'blue' | 'red' | 'yellow';
  label: string;
}

export const LCARSButton: FC<LCARSButtonProps> = ({
  color = 'orange',
  label,
  className = '',
  ...props
}) => {
  const colorMap = {
    orange: 'bg-lcars-orange hover:bg-lcars-light-orange text-black',
    purple: 'bg-lcars-purple hover:bg-lcars-light-purple text-black',
    blue: 'bg-lcars-blue hover:bg-lcars-light-blue text-black',
    red: 'bg-lcars-red hover:bg-red-400 text-white',
    yellow: 'bg-lcars-yellow hover:bg-lcars-pale-yellow text-black',
  };

  return (
    <button
      className={`
        ${colorMap[color]}
        font-lcars font-bold text-lg uppercase tracking-wider
        px-6 py-3 rounded-r-full w-full block mb-2 transition-all
        shadow-[0_0_5px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        border-l-4 border-black text-right
        ${className}
      `}
      {...props}
    >
      <div className="flex justify-between items-center w-full">
         <span className="text-xs opacity-50 font-mono">{(Math.random() * 1000).toFixed(0)}</span>
         <span>{label}</span>
      </div>
    </button>
  );
};
