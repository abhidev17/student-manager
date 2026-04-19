// Design tokens for consistent styling across the app
export const theme = {
  colors: {
    bg: {
      primary: '#0b0f17',
      secondary: '#0f172a',
      card: 'bg-white/[0.03]',
      cardHover: 'hover:bg-white/[0.06]',
      hover: 'hover:bg-white/[0.05]',
    },
    border: {
      light: 'border-white/8',
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
    sectionGap: 'mb-12',
    cardPadding: 'p-7',
    gridGap: 'gap-6',
    textGap: 'mt-2',
  },
  radius: {
    card: 'rounded-xl',
    button: 'rounded-lg',
  },
  transitions: {
    smooth: 'transition-all duration-200',
    hover: 'hover:scale-[1.01]',
  },
};

export const classNames = {
  glassCard:
    'bg-white/[0.03] backdrop-blur-[8px] border border-white/8 rounded-xl p-7 shadow-lg hover:shadow-xl hover:bg-white/[0.05] transition-all duration-200 hover:scale-[1.01]',
  button:
    'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.01]',
  buttonPrimary:
    'px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium transition-all duration-200 hover:scale-[1.01] hover:shadow-lg',
  buttonSecondary:
    'px-4 py-2.5 rounded-lg bg-white/8 text-white text-sm font-medium transition-all duration-200 hover:scale-[1.01] hover:bg-white/12',
  statCard:
    'bg-white/[0.03] backdrop-blur-[8px] border border-white/8 rounded-xl p-6 flex flex-col justify-between h-[128px] transition-all duration-200 hover:scale-[1.01] hover:bg-white/[0.05] hover:shadow-lg',
};
