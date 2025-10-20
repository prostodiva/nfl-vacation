import Link from "./Link";

function Navbar() {
    const links = [
        { label: 'Home', path: '/' },
        { label: 'Teams', path: '/teams' }
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
            <nav className="inline-flex items-center gap-2">
                {renderedLinks}
            </nav>
        </div>
    );
}

export default Navbar;