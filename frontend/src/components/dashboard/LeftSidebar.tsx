function LeftSidebar() {
    const links = [
        {label: '1', path: '/'},
        {label: '2', path: '/'}
    ];

    const renderLinks = links.map((link) => {
        return (
             <div 
                key={link.label}
                className="flex items-center gap-3 px-6 py-4 text-gray-300 hover:bg-gray-700 cursor-pointer w-full transition-colors"
            >
                <span className="text-lg">{link.label}</span>
            </div>
        );
    });
    
    return(
        <div className="absolute flex flex-col bg-[#262422] w-45 h-150 rounded ml-35 mt-45">
            <nav className="flex-1 overflow-y-auto py-4">
                {renderLinks}
            </nav>
        </div>
    );
}

export default  LeftSidebar;