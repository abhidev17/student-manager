import { classNames } from '../styles/theme';

export const GlassCard = ({ children }: { children: React.ReactNode }) => (
  <div className={classNames.glassCard}>
    {children}
  </div>
);
