export interface ResourceDTO {
    id: string;
    title: string;
    type: string;
    tags: string[];
    provider: string;
    providerFavicon: string;
    qualityScore: number;
    link: string;
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
