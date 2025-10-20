import Link from './Link';

function Navbar() {
  const links = [
    { label: 'Home', path: '/' },
    { label: 'Teams', path: '/teams' },
    { label: 'Stadiums', path: '/stadiums' },
    { label: 'Trip Planning', path: '/trip' },
    { label: 'Shopping', path: '/shopping' },
    { label: 'Algorithms', path: '/algorithms' },
    { label: 'Statistics', path: '/statistics' },
  ];

  const renderedLinks = links.map((link) => (
    <Link
      key={link.label}
      to={link.path}
      className="mx-2"
      activeClassName="font-bold"
    >
      {link.label}
    </Link>
  ));

  return (
    <div>
      <nav className="w-full inline-flex items-center gap-2 h-16 bg-gray-200">
        {renderedLinks}
      </nav>
    </div>
  );
}

export default Navbar;
