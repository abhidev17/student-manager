interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout = ({ children, sidebar }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0b0f17] via-[#0f172a] to-[#0b0f17] text-white">
      {/* Subtle background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {sidebar}
      <main className="flex-1 overflow-auto relative z-10">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
