import type { FC, ReactNode } from 'react';

interface LCARSLayoutProps {
  children: ReactNode;
}

export const LCARSLayout: FC<LCARSLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-black text-lcars-orange font-lcars flex flex-col p-2 overflow-hidden">
      {/* Top Bar Area */}
      <div className="flex h-16 shrink-0 items-stretch mb-2">
        {/* Elbow */}
        <div className="w-48 bg-lcars-light-purple rounded-bl-[40px] flex flex-col justify-end items-end pr-4 pb-2 text-black font-bold text-xl relative z-10">
           LCARS 471
        </div>

        {/* Horizontal Bar */}
        <div className="flex-1 flex flex-col justify-between ml-2">
           <div className="h-8 bg-lcars-orange rounded-r-full w-full flex items-center justify-end px-4 text-black font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(255,153,0,0.5)]">
              Star Trek: TNG - Role Playing Game
           </div>
           <div className="flex justify-end space-x-2 mt-1">
              <div className="h-6 w-32 bg-lcars-red rounded-full opacity-80"></div>
              <div className="h-6 w-24 bg-lcars-blue rounded-full opacity-80"></div>
           </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <div className="w-32 flex flex-col mr-4 shrink-0">
           <div className="h-32 bg-lcars-light-purple mb-1 opacity-90 relative">
              <span className="absolute bottom-1 right-1 text-black font-bold text-sm">SEC</span>
           </div>
           <div className="h-16 bg-lcars-blue mb-1 opacity-90 relative">
              <span className="absolute bottom-1 right-1 text-black font-bold text-sm">NAV</span>
           </div>
           <div className="flex-1 bg-lcars-light-purple opacity-40 relative border-r-4 border-lcars-light-purple/50">
              {/* Decorative numbers */}
              <div className="absolute top-4 right-2 text-right text-lcars-orange text-xs font-mono opacity-80">
                 742<br/>912<br/>302
              </div>
           </div>
           <div className="h-24 bg-lcars-orange mt-1 rounded-bl-[40px] opacity-90 relative">
              <span className="absolute top-1 right-1 text-black font-bold text-sm">PWR</span>
           </div>
        </div>

        {/* Main Content Frame */}
        <div className="flex-1 border-t-4 border-b-4 border-lcars-light-purple/30 rounded-tr-3xl bg-black/90 p-6 overflow-hidden text-lg font-mono tracking-wide relative shadow-inner flex flex-col">
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-lcars-orange rounded-tr-xl opacity-30 pointer-events-none"></div>
          {children}
        </div>
      </div>
    </div>
  );
};
