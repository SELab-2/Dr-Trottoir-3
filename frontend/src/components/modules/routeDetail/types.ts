export interface Building {
    id: string;
    name: string;
    lat: number;
    lon: number
}

export interface Route {
    name: string;
    region: string;
    status: string;
    buildings: Building[];
}
