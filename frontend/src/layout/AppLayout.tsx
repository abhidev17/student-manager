interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout = ({ children, sidebar }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#0b0f17] text-white">
      {sidebar}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
