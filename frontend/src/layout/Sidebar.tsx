import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeSection: 'dashboard' | 'students' | 'analytics';
  onSectionChange: (section: 'dashboard' | 'students' | 'analytics') => void;
  onLogout: () => void;
}

export const Sidebar = ({
  activeSection,
  onSectionChange,
  onLogout,
}: SidebarProps) => {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'students' as const, label: 'Students' },
    { id: 'analytics' as const, label: 'Analytics' },
  ];

  return (
    <aside className="w-64 bg-[#0b0f17] border-r border-white/10 p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-8 tracking-tight text-white">
        Student Manager
      </h2>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
              activeSection === item.id
                ? 'bg-white/10 text-white font-medium'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
};
