import Link from './Link';

interface NavLink {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface NavbarProps {
  links?: NavLink[];
  // Style customization props
  containerClassName?: string;
  navClassName?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
  logo?: React.ReactNode;
  // Layout options
  variant?: 'horizontal' | 'vertical';
  alignment?: 'start' | 'center' | 'end' | 'between';
}

function Navbar({
                  links,
                  containerClassName = '',
                  navClassName = 'w-full inline-flex items-center gap-2 h-16 bg-gray-100',
                  linkClassName = 'mx-8',
                  activeLinkClassName = 'font-bold',
                  logo,
                  variant = 'horizontal',
                  alignment = 'start'
                }: NavbarProps) {
  const defaultLinks: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Teams', path: '/teams' },
    { label: 'Stadiums', path: '/stadiums' },
    { label: 'Trip Planning', path: '/trip' },
    { label: 'Shopping', path: '/shopping' },
    { label: 'Algorithms', path: '/algorithms' }
  ];

  const navLinks = links || defaultLinks;

  // Alignment classes
  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  // Variant classes
  const variantClasses = variant === 'vertical' ? 'flex-col' : 'flex-row';

  const renderedLinks = navLinks.map((link) => (
      <Link
          key={link.label}
          to={link.path}
          className={linkClassName}
          activeClassName={activeLinkClassName}
      >
        {link.icon && <span className="mr-2">{link.icon}</span>}
        {link.label}
      </Link>
  ));

  return (
      <div className={containerClassName}>
        <nav className={`${navClassName} ${variantClasses} ${alignmentClasses[alignment]}`}>
          {logo && <div className="mr-4">{logo}</div>}
          {renderedLinks}
        </nav>
      </div>
  );
}

export default Navbar;
