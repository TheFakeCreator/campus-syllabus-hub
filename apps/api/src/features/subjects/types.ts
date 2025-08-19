export interface SubjectDTO {
    code: string;
    name: string;
    credits: number;
    branch: string;
    year: number;
    semester: number;
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
