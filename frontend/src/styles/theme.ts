// Design tokens for consistent styling across the app
export const theme = {
  colors: {
    bg: {
      primary: '#0b0f17',
      secondary: '#0f172a',
      card: 'bg-white/5',
      cardHover: 'hover:bg-white/10',
      hover: 'hover:bg-white/5',
    },
    border: {
      light: 'border-white/10',
      lighter: 'border-white/5',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-400',
      tertiary: 'text-gray-500',
      accent: 'text-blue-400',
    },
    gradient: {
      primary: 'from-blue-500 to-purple-600',
      success: 'from-emerald-500 to-teal-600',
    },
  },
  spacing: {
    pagePadding: 'p-8',
    sectionGap: 'mb-10',
    cardPadding: 'p-6',
    gridGap: 'gap-6',
    textGap: 'mt-1',
  },
  radius: {
    card: 'rounded-2xl',
    button: 'rounded-lg',
  },
  transitions: {
    smooth: 'transition-all duration-200',
    hover: 'hover:scale-[1.02]',
  },
};

export const classNames = {
  glassCard:
    'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]',
  button:
    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]',
  buttonPrimary:
    'px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-xl',
  buttonSecondary:
    'px-4 py-2 rounded-lg bg-white/10 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:bg-white/20',
  statCard:
    'bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex flex-col justify-between h-[110px] transition-all duration-200 hover:scale-[1.02] hover:shadow-xl',
};
