
import FilterSection from "./FilterSection";
import { teamFilters, stadiumFilters } from "../config/filterConfigs";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { ActiveTab } from "../store/types/teamTypes";

function SortingSection() {
    const location = useLocation();

    const getInitialTab = (): ActiveTab => {
        if (location.pathname === '/stadiums') return 'stadiums';
        return 'teams';
    };

    const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab());

    useEffect(() => {
        if (location.pathname === '/stadiums') {
            setActiveTab('stadiums');
        } else if (location.pathname === '/teams') {
            setActiveTab('teams');
        }
    }, [location.pathname]);

    // Update URL when tab is clicked
    const handleTabChange = (tab: ActiveTab) => {
        setActiveTab(tab);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center space-y-6">
                    {/* Tab Buttons */}
                    <div className="w-full flex items-center justify-center gap-4 h-12 bg-gray-100 px-8">
                        <button
                            onClick={() => handleTabChange('teams')}
                            className={`text-m px-4 py-2 transition-colors ${
                                activeTab === 'teams'
                                    ? 'text-black font-semibold border-b-2 border-black'
                                    : 'text-gray-700 hover:text-black'
                            }`}
                        >
                            Teams
                        </button>
                        <button
                            onClick={() => handleTabChange('stadiums')}
                            className={`text-m px-4 py-2 transition-colors ${
                                activeTab === 'stadiums'
                                    ? 'text-black font-semibold border-b-2 border-black'
                                    : 'text-gray-700 hover:text-black'
                            }`}
                        >
                            Stadiums
                        </button>
                    </div>

                    {/* Conditional Rendering */}
                    {activeTab === 'teams' ? (
                        <FilterSection 
                        filters={teamFilters} 
                        title="Filter Teams" 
                        enableSorting={false}
                        viewType="teams"
                        />
                    ) : (
                        <FilterSection 
                        filters={stadiumFilters}
                        title="Filter Stadiums"
                        enableSorting={true}
                        viewType="stadiums"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SortingSection;
