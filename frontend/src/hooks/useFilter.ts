import { useMemo, useState } from "react";

interface FilterConfig<T> {
    key: string;
    getValue: (item: T) => string | number | boolean;
}

export function useFilter<T>(data: T[], filterConfigs: FilterConfig<T>[]) {
    const [filters, setFilters] = useState<Record<string, string | number | boolean>>({});

    const setFilter = (key: string, value: string | number | boolean) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilter = (key: string) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setFilters({});
    };

    const filteredData = useMemo(() => {
        let result = [...data];

        filterConfigs.forEach(config => {
            const filterValue = filters[config.key];
            if (filterValue !== undefined && filterValue !== null) {
                result = result.filter(item =>
                    config.getValue(item) === filterValue
                );
            }
        });

        return result;
    }, [data, filters, filterConfigs]);

    const hasActiveFilters = Object.keys(filters).length > 0;

    return {
        filters,
        filteredData,
        setFilter,
        clearFilter,
        clearAllFilters,
        hasActiveFilters,
    };
}