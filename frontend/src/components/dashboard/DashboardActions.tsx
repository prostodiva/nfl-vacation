import Button from '../Button';
import type { ActiveTab } from '../../store/types/teamTypes';
import { IoIosAddCircle } from "react-icons/io";

interface DashboardActionsProps {
    activeTab: ActiveTab;
    onAdd: () => void;
}

function DashboardActions({ activeTab, onAdd }: DashboardActionsProps) {
    const entityName = activeTab === 'teams' ? 'TEAM' : 'STADIUM';
    
    return (
        <div className="rounded-lg justify-between items-center">
            <div className="flex flex-row justify-between">
                <h3 className="text-2xl font-bold">
                    YOU CAN ADD, EDIT, OR DELETE {entityName} ONLY HERE.
                </h3>
                <div className="flex gap-4">
                    <Button rounded submit outline>
                        ADD {entityName}s
                    </Button>
                    <IoIosAddCircle className="size-10"/>
                    <Button rounded add onClick={onAdd}>
                        ADD
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DashboardActions;

