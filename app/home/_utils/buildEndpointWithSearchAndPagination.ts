import { RewardFilters } from "../_components/Filters/Filters";

export function buildEndpointWithSearchAndPagination (
    baseURL: string,
    options: {
        page: number;
        itemsPerPage: number;
        filters: RewardFilters;
        search?: string;
    },
) {
    const { page, itemsPerPage, search, filters } = options;

    let url = `${baseURL}?page=${page}&itemsPerPage=${itemsPerPage}`;
    url += `&minPrice=${filters.price.min}`;

    if (filters.price.max) {
        url += `&maxPrice=${filters.price.max}`;
    }

    if (filters.programmingLanguages.length > 0) {
        url += `&programmingLanguages=${encodeURIComponent(filters.programmingLanguages.join(","))}`;
    }

    if (filters.usersTrying !== "BOTH") {
        url += `&usersTrying=${filters.usersTrying}`;
    }

    // NEW: Add the date filter to the API request
    if (filters.date && filters.date !== "ALL") {
        url += `&createdAt=${filters.date}`;
    }

    if (!search) {
        return url;
    }

    return `${url}&search=${search}`;
}