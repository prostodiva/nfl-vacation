import { useSearchParams } from 'react-router-dom';
import { useGetAllTeamsQuery } from '../../store/apis/teamsApi';
import SearchInput from '../../components/SearchInput';
import TeamCard from '../../components/TeamCard';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('term') || '';
  
  const { data: teamsData, isLoading, error } = useGetAllTeamsQuery();
  
  // Filter teams based on search term (or show all if no term)
  const filteredTeams = teamsData?.data.filter(team =>
    !searchTerm || 
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.conference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.stadium.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Search NFL Teams
          </h1>
          <SearchInput />
        </div>
        
        {/* Search Term Display */}
        {searchTerm && (
          <div className="mb-6">
            <p className="text-lg text-gray-600">
              Showing results for: <strong className="text-gray-800">"{searchTerm}"</strong>
            </p>
            <p className="text-sm text-gray-500">
              {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading teams...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">Error loading teams</p>
            <p className="text-red-500 text-sm mt-2">Please try again later</p>
          </div>
        )}
        
        {/* Results - Single render location */}
        {!isLoading && !error && (
          <div className="space-y-6">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <TeamCard key={team._id} team={team} />
              ))
            ) : searchTerm ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-xl text-gray-600 mb-2">
                  No teams found matching "{searchTerm}"
                </p>
                <p className="text-gray-500">
                  Try searching with a different term
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;