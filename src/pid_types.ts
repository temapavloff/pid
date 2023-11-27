export type FetureCollection<T> = {
    type: "FeatureCollection",
    features: T[],
};

export type Geometry = {
    coordinates: [number, number],
    type: 'Point', // it should be more types there
};

export type Stop = {
    geometry: Geometry,
    properties: {
        location_type: number,
        parent_station: string | null,
        platform_code: string,
        stop_id: string,
        stop_name: string,
        wheelchair_boarding: number,
        zone_id: string,
        level_id: string | null,
    },
    type: "Feature",
};

export type StopsList = FetureCollection<Stop>;
