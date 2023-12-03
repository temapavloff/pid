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
        platform_code: string | null,
        stop_id: string,
        stop_name: string,
        wheelchair_boarding: number,
        zone_id: string,
        level_id: string | null,
    },
    type: "Feature",
};

export type StopsList = FetureCollection<Stop>;

export type DepartureboardStop = {
    location_type: number,
    parent_station: string | null,
    platform_code: string,
    stop_id: string,
    stop_lat: number,
    stop_lon: number,
    stop_name: string,
    wheelchair_boarding: number,
    zone_id: string,
    level_id: string | null,
    asw_id: {
        node: number,
        stop: number,
    }
};

export type Departure = {
    arrival_timestamp: {
        predicted: string | null,
        scheduled: string | null,
    },
    delay: {
        is_available: boolean,
        minutes: number,
        seconds: number,
    },
    departure_timestamp: {
        predicted: string,
        scheduled: string,
        minutes: string,
    },
    last_stop: {
        id: string,
        name: string,
    },
    route: {
        short_name: string,
        type: number,
        is_night: boolean,
        is_regional: boolean,
        is_substitute_transport: boolean,
    },
    stop: {
        id: string,
        platform_code: string,
    },
    trip: {
        direction: null,
        headsign: string,
        id: string,
        is_at_stop: boolean,
        is_canceled: boolean,
        is_wheelchair_accessible: boolean,
        is_air_conditioned: boolean,
        short_name: string | null
    }
};

export type Departureboards = {
    stops: DepartureboardStop[],
    departures: Departure[],
};
