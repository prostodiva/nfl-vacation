import { useState } from "react";
import type { ActiveTab } from "../../store/types/teamTypes";

function LeftSidebar({ onTabChange }: { onTabChange: (tab: ActiveTab) => void }) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('teams');

    const links: { label: ActiveTab; path: string }[] = [
        {label: 'teams', path: '/'},
        {label: 'stadiums', path: '/'},
        {label: 'souvenirs', path: '/'}
    ];

    const handleLinkClick = (tab: ActiveTab) => {
        setActiveTab(tab);
        onTabChange(tab);
    }

    const renderLinks = links.map((link) => {
        return (
             <div 
                key={link.label}
                onClick={() => handleLinkClick(link.label)}
                className={`flex items-center gap-3 px-6 py-4 text-gray-300 hover:bg-gray-700 cursor-pointer w-full transition-colors ${
                activeTab === link.label
                   ? 'bg-gray-700 text-white' 
                   : 'text-gray-300 hover:bg-gray-700'
                }`}
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