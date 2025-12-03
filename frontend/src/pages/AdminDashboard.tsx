// AdminDashboard.tsx
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import DashboardActions from "../components/dashboard/DashboardActions";
import DashboardGreeting from "../components/dashboard/DashboardGreetings";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import EditModal from "../components/dashboard/EditModel";
import LeftSidebar from "../components/dashboard/LeftSidebar";
import SouvenirsList from "../components/dashboard/SouvenirList";
import StadiumsList from "../components/dashboard/StadiumList";
import TeamsListDash from "../components/dashboard/TeamListDash";
import { getSouvenirFieldsWithTeam, souvenirFields } from "../config/formFields";
import { useSouvenirEdit } from "../hooks/useSouvenirEdit";
import { useDeleteStadium, useStadiumEdit } from "../hooks/useStadiumEdit";
import { useDeleteTeam, useTeamEdit } from "../hooks/useTeamEdit";
import { useImportFromExcelMutation } from "../store/apis/adminApi";
import { souvenirsApi, useGetAllSouvenirsQuery } from "../store/apis/souvenirsApi";
import { stadiumApi, useGetAllStadiumsQuery } from "../store/apis/stadiumsApi";
import { teamsApi, useGetAllTeamsQuery } from "../store/apis/teamsApi";
import type { ActiveTab } from "../store/types/teamTypes";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('teams');
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    
    // Fetch data based on active tab
    const teamsQuery = useGetAllTeamsQuery(undefined, { skip: activeTab !== 'teams' });
    // Always fetch teams so they're available for souvenir team selection
    const allTeamsQuery = useGetAllTeamsQuery(undefined, { skip: false });
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

    const { deleteTeam } = useDeleteTeam();
    const { deleteStadium } = useDeleteStadium();
    
    // Import mutation
    const [importFromExcel, { isLoading: isImporting }] = useImportFromExcelMutation();
    
    const handleImport = async (file: File) => {
        try {
            // Validate file name
            const filename = file.name.toLowerCase();
            const validFilenames = ['teams-stadiums.xlsx', 'stadium-distances.xlsx', 'souvenirs.xlsx'];
            
            if (!validFilenames.includes(filename)) {
                alert(`Invalid filename. File must be named "teams-stadiums.xlsx", "stadium-distances.xlsx", or "souvenirs.xlsx"`);
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
                } else if (result.type === 'souvenirs') {
                    // Invalidate souvenirs cache
                    dispatch(souvenirsApi.util.invalidateTags(['Souvenir']));
                    
                    // Also invalidate teams since souvenirs are part of teams
                    dispatch(teamsApi.util.invalidateTags(['Team']));
                    
                    // Refetch only if queries are enabled (not skipped)
                    if (activeTab === 'souvenirs') {
                        await souvenirsQuery.refetch();
                    }
                    if (activeTab === 'teams') {
                        await teamsQuery.refetch();
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

     const handleDeleteTeam = async (teamId: string) => {
        const result = await deleteTeam(teamId);
        if (result?.success) {
            // Invalidate and refetch teams
            dispatch(teamsApi.util.invalidateTags(['Team']));
            if (activeTab === 'teams') {
                await teamsQuery.refetch();
            }
        }
    };

    const handleDeleteStadium = async (stadiumId: string) => {
        const result = await deleteStadium(stadiumId);
        if (result?.success) {
            // Invalidate and refetch stadiums
            dispatch(stadiumApi.util.invalidateTags(['StadiumItem']));
            if (activeTab === 'stadiums') {
                await stadiumsQuery.refetch();
            }
        }
    };

    // Filter data based on search term
    const filteredTeams = useMemo(() => {
        if (!teamsQuery.data?.data) return [];
        if (!searchTerm.trim()) return teamsQuery.data.data;
        
        const term = searchTerm.toLowerCase();
        return teamsQuery.data.data.filter(team => 
            team.teamName.toLowerCase().includes(term) ||
            team.conference.toLowerCase().includes(term) ||
            team.division.toLowerCase().includes(term) ||
            team.stadium.name.toLowerCase().includes(term)
        );
    }, [teamsQuery.data?.data, searchTerm]);

    const filteredStadiums = useMemo(() => {
        if (!stadiumsQuery.data?.data) return [];
        if (!searchTerm.trim()) return stadiumsQuery.data.data;
        
        const term = searchTerm.toLowerCase();
        return stadiumsQuery.data.data.filter(stadium => 
            stadium.stadiumName.toLowerCase().includes(term) ||
            stadium.location.toLowerCase().includes(term) ||
            stadium.roofType.toLowerCase().includes(term)
        );
    }, [stadiumsQuery.data?.data, searchTerm]);

    const filteredSouvenirs = useMemo(() => {
        if (!souvenirsQuery.data?.data) return [];
        if (!searchTerm.trim()) return souvenirsQuery.data.data;
        
        const term = searchTerm.toLowerCase();
        return souvenirsQuery.data.data.filter(souvenir => 
            souvenir.name.toLowerCase().includes(term) ||
            souvenir.stadiumName.toLowerCase().includes(term) ||
            souvenir.category.toLowerCase().includes(term) ||
            souvenir.teamName?.toLowerCase().includes(term)
        );
    }, [souvenirsQuery.data?.data, searchTerm]);

    // Get teams for team selection dropdown - use allTeamsQuery so teams are always available
    const teamsForSelection = allTeamsQuery.data?.data?.map(team => ({
        _id: team._id,
        teamName: team.teamName
    })) || [];


    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-8 py-8">
                <LeftSidebar onTabChange={setActiveTab} />
                <DashboardHeader />

                <div className="ml-[350px] max-w-5xl mx-auto space-y-6">
                    <DashboardGreeting 
                        userName="RITA" 
                        activeTab={activeTab}
                        onSearchChange={setSearchTerm}
                    />

                    <DashboardActions 
                        activeTab={activeTab}
                        onAdd={handleImport}
                        onAddSouvenir={souvenirs.handleCreate}
                        isLoading={isImporting}
                    />

                    {/* Content Section */}
                    <div className="bg-[#3b3c5e] rounded-lg p-6">
                        {activeTab === 'teams' ? (
                            <TeamsListDash
                                teams={filteredTeams}
                                isLoading={teamsQuery.isLoading}
                                onEdit={team.handleEdit}
                                onDelete={(teamId) => handleDeleteTeam(teamId)}
                            />
                        ) : activeTab === 'stadiums' ? (
                            <StadiumsList 
                                stadiums={filteredStadiums}
                                isLoading={stadiumsQuery.isLoading}
                                onEdit={stadium.handleEdit}
                                onDelete={(stadium) => handleDeleteStadium(stadium)}
                            />
                        ) : (
                            <SouvenirsList
                                souvenirs={filteredSouvenirs}
                                isLoading={souvenirsQuery.isLoading}
                                isAdmin={true}
                                onEdit={souvenirs.handleEdit}
                                onDelete={souvenirs.handleDelete}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditModal
                title={souvenirs.isCreating ? "Add New Souvenir" : "Edit Souvenir"}
                isOpen={!!souvenirs.editingItem} 
                data={souvenirs.editingItem || {}} 
                fields={souvenirs.isCreating ? getSouvenirFieldsWithTeam(teamsForSelection) : souvenirFields}
                isLoading={souvenirs.isLoading}
                onSave={souvenirs.handleSave}
                onClose={souvenirs.handleClose}
            />

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





