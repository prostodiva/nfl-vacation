
export const stadiumFields = [
    { name: 'stadiumName', label: 'Stadium Name', type: 'text' as const },
    { name: 'location', label: 'Location', type: 'text' as const },
    { name: 'seatingCapacity', label: 'Seating Capacity', type: 'number' as const },
    { 
        name: 'surfaceType', 
        label: 'Surface Type', 
        type: 'select' as const,
        options: [
            { value: 'bermuda', label: 'Bermuda grass' },
            { value: 'bluegrass', label: 'Kentucky Bluegrass' },
            { value: 'fieldturf', label: 'FieldTurf' },
            { value: 'astroturf', label: 'AstroTurf' },
            { value: 'natural', label: 'Natural Grass' }
        ]
    },
    { 
        name: 'roofType', 
        label: 'Roof Type', 
        type: 'select' as const,
        options: [
            { value: 'open', label: 'Open' },
            { value: 'fixed', label: 'Fixed' },
            { value: 'retractable', label: 'Retractable' }
        ]
    },
    { name: 'yearOpened', label: 'Year Opened', type: 'number' as const }
];

export const teamFields = [
    { name: 'teamName', label: 'Team Name', type: 'text' as const, required: true },
    { 
        name: 'conference', 
        label: 'Conference', 
        type: 'select' as const, 
        required: true,
        options: ['AFC', 'NFC']
    },
    { 
        name: 'division', 
        label: 'Division', 
        type: 'select' as const, 
        required: true,
        options: ['AFC East', 'AFC West', 'AFC North', 'AFC South', 
                 'NFC East', 'NFC West', 'NFC North', 'NFC South']
    }
];

export const souvenirFields = [
    { name: 'name', label: 'Souvenir Name', type: 'text' as const, required: true },
    { name: 'price', label: 'Price', type: 'number' as const, required: true },
    { 
        name: 'category', 
        label: 'Category', 
        type: 'select' as const, 
        required: true,
        options: ['Apparel', 'Accessories', 'Collectibles', 'Food & Beverage']
    },
    { name: 'isTraditional', label: 'Traditional', type: 'checkbox' as const }
];