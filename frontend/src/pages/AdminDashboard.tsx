// AdminDashboard.tsx
import { useState } from "react";
import LeftSidebar from "../components/dashboard/LeftSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardGreeting from "../components/dashboard/DashboardGreetings";
import DashboardActions from "../components/dashboard/DashboardActions";
import TeamsListDash from "../components/dashboard/TeamListDash";
import StadiumsList from "../components/dashboard/StadiumList";
import EditModal from "../components/dashboard/EditModel";
import { useGetAllTeamsQuery } from "../store/apis/teamsApi";
import { useGetAllStadiumsQuery } from "../store/apis/stadiumsApi";
import { useStadiumEdit } from "../hooks/useStadiumEdit";
import { useTeamEdit } from "../hooks/useTeamEdit";
import type { ActiveTab } from "../store/types/teamTypes";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('teams');
    
    // Fetch data based on active tab
    const teamsQuery = useGetAllTeamsQuery(undefined, { skip: activeTab !== 'teams' });
    const stadiumsQuery = useGetAllStadiumsQuery(undefined, { skip: activeTab !== 'stadiums' });
    
    // Edit hooks
    const stadium = useStadiumEdit();
    const team = useTeamEdit();

    return (
        <div className="bg-gray-100 min-h-screen relative">
            <LeftSidebar onTabChange={setActiveTab} />

            <div className="px-8 py-8">
                <DashboardHeader />

                <div className="ml-[350px] max-w-5xl mx-auto space-y-6">
                    <DashboardGreeting userName="RITA" />

                    <DashboardActions 
                        activeTab={activeTab}
                        onAdd={() => console.log('Add clicked')}
                    />

                    {/* Content Section */}
                    <div className="bg-[#262422] rounded-lg p-6">
                        {activeTab === 'teams' ? (
                            <TeamsListDash
                                teams={teamsQuery.data?.data}
                                isLoading={teamsQuery.isLoading}
                                onEdit={team.handleEdit}
                                onDelete={(teamId) => console.log('Delete team:', teamId)}
                            />
                        ) : (
                            <StadiumsList 
                                stadiums={stadiumsQuery.data?.data}
                                isLoading={stadiumsQuery.isLoading}
                                onEdit={stadium.handleEdit}
                                onDelete={(stadiumId) => console.log('Delete stadium:', stadiumId)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditModal
                title="Edit Stadium"
                isOpen={!!stadium.editingItem}
                data={stadium.editingItem || {}}
                fields={stadium.fields}
                isLoading={stadium.isLoading}
                onSave={stadium.handleSave}
                onClose={stadium.handleClose}
            />

            <EditModal
                title="Edit Team"
                isOpen={!!team.editingItem}
                data={team.editingItem || {}}
                fields={team.fields}
                isLoading={team.isLoading}
                onSave={team.handleSave}
                onClose={team.handleClose}
            />
        </div>
    );
}

export default AdminDashboard;





