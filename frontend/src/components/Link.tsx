import type { ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';
import useNavigation from '../hooks/useNavigation';

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}

function Link({ to, children, className, activeClassName }: LinkProps) {
  const { navigate, currentPath } = useNavigation();

  const classes = classNames(
    'text-black',
    className,
    currentPath === to && activeClassName
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    event.preventDefault();

    navigate(to);
  };

  return (
    <div>
      <a className={classes} href={to} onClick={handleClick}>
        {children}
      </a>
    </div>
  );
}

export default Link;
