import type { TripProps } from '../store/types/algorithmTypes';
import CustomTrip from './CustomTrip';
import OptimalTrip from './OptimalTrip';

function Trip({ trip }: TripProps ) {
    if (!trip) return null;

        switch (trip?.type) {
            case 'CUSTOM':
                return <CustomTrip />;
            case 'OPTIMAL':
                return <OptimalTrip />;
            default:
                return null;
        }
}

export default Trip;