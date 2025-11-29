// AdminDashboard.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import DashboardActions from "../components/dashboard/DashboardActions";
import DashboardGreeting from "../components/dashboard/DashboardGreetings";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import EditModal from "../components/dashboard/EditModel";
import LeftSidebar from "../components/dashboard/LeftSidebar";
import SouvenirsList from "../components/dashboard/SouvenirList";
import StadiumsList from "../components/dashboard/StadiumList";
import TeamsListDash from "../components/dashboard/TeamListDash";
import { souvenirFields } from "../config/formFields";
import { useSouvenirEdit } from "../hooks/useSouvenirEdit";
import { useStadiumEdit } from "../hooks/useStadiumEdit";
import { useTeamEdit } from "../hooks/useTeamEdit";
import { useImportFromExcelMutation } from "../store/apis/adminApi";
import { useGetAllSouvenirsQuery } from "../store/apis/souvenirsApi";
import { stadiumApi, useGetAllStadiumsQuery } from "../store/apis/stadiumsApi";
import { teamsApi, useGetAllTeamsQuery } from "../store/apis/teamsApi";
import type { ActiveTab } from "../store/types/teamTypes";


function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('teams');
    const dispatch = useDispatch();
    
    // Fetch data based on active tab
    const teamsQuery = useGetAllTeamsQuery(undefined, { skip: activeTab !== 'teams' });
    const stadiumsQuery = useGetAllStadiumsQuery(undefined, { skip: activeTab !== 'stadiums' });
    const souvenirsQuery = useGetAllSouvenirsQuery(undefined, { 
        skip: activeTab !== 'souvenirs',
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    
    // Edit hooks
    const stadium = useStadiumEdit();
    const team = useTeamEdit();
    const souvenirs = useSouvenirEdit();
    
    // Import mutation
    const [importFromExcel, { isLoading: isImporting }] = useImportFromExcelMutation();
    
    const handleImport = async (file: File) => {
        try {
            // Validate file name
            const filename = file.name.toLowerCase();
            const validFilenames = ['teams-stadiums.xlsx', 'stadium-distances.xlsx'];
            
            if (!validFilenames.includes(filename)) {
                alert(`Invalid filename. File must be named "teams-stadiums.xlsx" or "stadium-distances.xlsx"`);
                return;
            }
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            
            // Call import API
            const result = await importFromExcel(formData).unwrap();
            
            if (result.success) {
                // Invalidate and refetch data based on import type
                if (result.type === 'teams') {
                    // Invalidate teams cache to trigger refetch
                    dispatch(teamsApi.util.invalidateTags(['Team']));
                    
                    // Refetch only if query is currently enabled (not skipped)
                    if (activeTab === 'teams') {
                        await teamsQuery.refetch();
                    }
                    
                    // Also invalidate stadiums since they're related to teams
                    dispatch(stadiumApi.util.invalidateTags(['StadiumItem']));
                    if (activeTab === 'stadiums') {
                        await stadiumsQuery.refetch();
                    }
                } else if (result.type === 'distances') {
                    // Distances might affect teams/stadiums, so invalidate both
                    dispatch(teamsApi.util.invalidateTags(['Team']));
                    dispatch(stadiumApi.util.invalidateTags(['StadiumItem']));
                    
                    // Refetch only if queries are enabled (not skipped)
                    if (activeTab === 'teams') {
                        await teamsQuery.refetch();
                    }
                    if (activeTab === 'stadiums') {
                        await stadiumsQuery.refetch();
                    }
                }
                
                const countMessage = result.importedCount 
                    ? ` (${result.importedCount} records imported)`
                    : '';
                alert(`Successfully imported ${result.type}!${countMessage}`);
            }
        } catch (error: any) {
            console.error('Import error:', error);
            const errorMessage = error?.data?.message || error?.data?.error || error.message || 'Unknown error';
            alert(`Error importing: ${errorMessage}`);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <LeftSidebar onTabChange={setActiveTab} />

            <div className="px-8 py-8">
                <DashboardHeader />

                <div className="ml-[350px] max-w-5xl mx-auto space-y-6">
                    <DashboardGreeting userName="RITA" />

                    <DashboardActions 
                        activeTab={activeTab}
                        onAdd={handleImport}
                        isLoading={isImporting}
                    />

                    {/* Content Section */}
                    <div className="bg-[#3b3c5e] rounded-lg p-6">
                        {activeTab === 'teams' ? (
                            <TeamsListDash
                                teams={teamsQuery.data?.data}
                                isLoading={teamsQuery.isLoading}
                                onEdit={team.handleEdit}
                                onDelete={(teamId) => console.log('Delete team:', teamId)}
                            />
                        ) : activeTab === 'stadiums' ? (
                            <StadiumsList 
                                stadiums={stadiumsQuery.data?.data}
                                isLoading={stadiumsQuery.isLoading}
                                onEdit={stadium.handleEdit}
                                onDelete={(stadiumId) => console.log('Delete stadium:', stadiumId)}
                            />
                        ) : (
                            <SouvenirsList
                                souvenirs={souvenirsQuery.data?.data}
                                isLoading={souvenirsQuery.isLoading}
                                onEdit={souvenirs.handleEdit}
                                onDelete={(souvenirId) => console.log('Delete souvenir:', souvenirId)}
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

            <EditModal
                title="Edit Souvenir"
                isOpen={!!souvenirs.editingItem} 
                data={souvenirs.editingItem || {}} 
                fields={souvenirFields}
                isLoading={souvenirs.isLoading}
                onSave={souvenirs.handleSave}
                onClose={souvenirs.handleClose}
            />
        </div>
    );
}

export default AdminDashboard;





