import { useState } from "react";
import type { ActiveTab } from "../../store/types/teamTypes";
import { FaUsers } from "react-icons/fa";
import { IoMdMap } from "react-icons/io";
import { RiGift2Line } from "react-icons/ri";

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
            <div className="mt-2">
                <div 
                    key={link.label}
                    onClick={() => handleLinkClick(link.label)}
                    className={`flex items-center gap-3 px-6 py-4 text-gray-400 cursor-pointer w-full transition-colors ${
                    activeTab === link.label
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                    {link.label === 'teams' && <FaUsers className="text-5xl"/>}
                    {link.label === 'stadiums' && <IoMdMap className="text-5xl" />}
                    {link.label === 'souvenirs' && <RiGift2Line className="text-5xl" />}

                <span className="text-lg">{link.label}</span>
            </div>
           </div> 
        );
    });
    
    return(
        <div className="absolute flex flex-col bg-[#3b3c5e] w-45 h-150 rounded ml-35 mt-45">
            <nav className="flex-1 overflow-y-auto py-4">
                {renderLinks}
            </nav>
        </div>
    );
}

export default  LeftSidebar;