import { classNames } from '../styles/theme';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) => {
  const baseClass =
    variant === 'primary' ? classNames.buttonPrimary : classNames.buttonSecondary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className} active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};
