import { useRef } from 'react';
import Button from '../Button';
import type { ActiveTab } from '../../store/types/teamTypes';
import { IoIosAddCircle } from "react-icons/io";

interface DashboardActionsProps {
    activeTab: ActiveTab;
    onAdd: (file: File) => void;
    isLoading?: boolean;
}

function DashboardActions({ activeTab, onAdd, isLoading = false }: DashboardActionsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const entityName = activeTab === 'teams' ? 'TEAM' : 'STADIUM';
    
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
        fileInputRef.current?.click();
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
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isLoading}
                    />
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

