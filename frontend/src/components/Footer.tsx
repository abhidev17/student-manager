import { Heart, Mail, Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/80 bg-white/45 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-3">Student Manager</h3>
            <p className="text-sm text-slate-600 leading-6">
              A modern, production-ready student management dashboard built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-sky-700 transition">Dashboard</a></li>
              <li><a href="#" className="hover:text-sky-700 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-sky-700 transition">Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-display font-semibold text-slate-900 mb-3">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition">
                <Code size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            © 2026 Student Manager. All rights reserved.
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-1">
            Made with <Heart size={16} className="text-rose-500" /> by Your Team
          </p>
        </div>
      </div>
    </footer>
  );
}
