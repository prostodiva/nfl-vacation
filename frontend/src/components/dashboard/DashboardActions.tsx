import { useRef } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import type { ActiveTab } from '../../store/types/teamTypes';
import Button from '../Button';

interface DashboardActionsProps {
    activeTab: ActiveTab;
    onAdd: (file: File) => void;
    onAddSouvenir?: () => void; // Add this prop
    isLoading?: boolean;
}

function DashboardActions({ activeTab, onAdd, onAddSouvenir, isLoading = false }: DashboardActionsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const entityName = activeTab === 'teams' ? 'TEAM' : activeTab === 'stadiums' ? 'STADIUM' : 'SOUVENIR';
    
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onAdd(file);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAddClick = () => {
        if (activeTab === 'souvenirs' && onAddSouvenir) {
            // For souvenirs, show the create modal instead of file upload
            onAddSouvenir();
        } else {
            // For teams/stadiums, show file upload
            fileInputRef.current?.click();
        }
    }
 
    return (
        <div className="rounded-lg justify-between items-center">
            <div className="flex flex-row justify-between">
                <h3 className="text-2xl font-bold">
                    YOU CAN ADD, EDIT, OR DELETE {entityName} ONLY HERE.
                </h3>
                <div className="flex gap-4">
                    <p className="mt-2">
                        ADD {entityName}
                    </p>
                    <IoIosAddCircle className="size-10"/>
                    {activeTab !== 'souvenirs' && (
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isLoading}
                        />
                    )}
                    <Button 
                        rounded 
                        add 
                        onClick={handleAddClick}
                        disabled={isLoading}
                    >
                        {isLoading ? 'IMPORTING...' : 'ADD'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DashboardActions;

