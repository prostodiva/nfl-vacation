// config/formFields.ts
import type { FieldConfig } from '../components/dashboard/EditModel';

export const stadiumFields: FieldConfig[] = [
    { name: 'stadiumName', label: 'Stadium Name', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    { name: 'seatingCapacity', label: 'Seating Capacity', type: 'number', required: true },
    { 
        name: 'surfaceType', 
        label: 'Surface Type', 
        type: 'select', 
        required: true,
        options: [
            { value: 'Bermuda grass', label: 'Bermuda grass' },
            { value: 'Kentucky Bluegrass', label: 'Kentucky Bluegrass' },
            { value: 'FieldTurf', label: 'FieldTurf' },
            { value: 'AstroTurf', label: 'AstroTurf' },
            { value: 'Natural Grass', label: 'Natural Grass' }
        ]
    },
    { 
        name: 'roofType', 
        label: 'Roof Type', 
        type: 'select', 
        required: true,
        options: [
            { value: 'Open', label: 'Open' },
            { value: 'Fixed', label: 'Fixed' },
            { value: 'Retractable', label: 'Retractable' }
        ]
    },
    { name: 'yearOpened', label: 'Year Opened', type: 'number', required: true }
];

export const teamFields: FieldConfig[] = [
    { name: 'teamName', label: 'Team Name', type: 'text', required: true },
    { 
        name: 'conference', 
        label: 'Conference', 
        type: 'select', 
        required: true,
        options: [
            { value: 'AFC', label: 'AFC' },
            { value: 'NFC', label: 'NFC' }
        ]
    },
    { 
        name: 'division', 
        label: 'Division', 
        type: 'select', 
        required: true,
        options: [
            { value: 'AFC East', label: 'AFC East' },
            { value: 'AFC West', label: 'AFC West' },
            { value: 'AFC North', label: 'AFC North' },
            { value: 'AFC South', label: 'AFC South' },
            { value: 'NFC East', label: 'NFC East' },
            { value: 'NFC West', label: 'NFC West' },
            { value: 'NFC North', label: 'NFC North' },
            { value: 'NFC South', label: 'NFC South' }
        ]
    }
];

export const souvenirFields: FieldConfig[] = [
    { name: 'name', label: 'Souvenir Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { 
        name: 'category', 
        label: 'Category', 
        type: 'select', 
        required: true,
        options: [
            { value: 'Apparel', label: 'Apparel' },
            { value: 'Accessories', label: 'Accessories' },
            { value: 'Collectibles', label: 'Collectibles' },
            { value: 'Food & Beverage', label: 'Food & Beverage' }
        ]
    },
    { name: 'isTraditional', label: 'Traditional', type: 'checkbox' }
];

// Function to get souvenir fields with team selection for creating new souvenirs
export const getSouvenirFieldsWithTeam = (teams: Array<{ _id: string; teamName: string }>): FieldConfig[] => [
    {
        name: 'teamId',
        label: 'Team',
        type: 'select',
        required: true,
        options: teams.map(team => ({
            value: team._id,
            label: team.teamName
        }))
    },
    ...souvenirFields
];