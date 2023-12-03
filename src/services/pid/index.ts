import { Departureboards } from './pid_types';

export const fetchDepartures = async (stopIds: string[]) => {
    const params = new URLSearchParams([
        ['minutesBefore', '10'],
        ['minutesAfter', '60'],
        ['timeFrom', (new Date()).toISOString()],
        ['includeMetroTrains', 'true'],
        ['preferredTimezone', 'Europe/Prague'],
        ['mode', 'departures'],
        ['order', 'real'],
        ['filter', 'none'],
        ['skip', 'canceled'],
        ['limit', '100'],
        ['total', '100'],
        ...stopIds.map(id => ['ids[]', id]),
    ]);

    const response = await fetch(`https://api.golemio.cz/v2/pid/departureboards?${params}`, {
        headers: {
            'Accept': 'application/json',
            'X-Access-Token': process.env['API_KEY'] ?? '',
        },
    });

    return response.json() as Promise<Departureboards>;
};

type VehicleType = 'metro' | 'tram' | 'bus';

const routeTypesMap: Record<number, VehicleType> = {
    1: 'metro',
    0: 'tram',
    3: 'bus',
};

const tpl = (routeType: number, routeShortName: string, directionStopName: string, stopName: string, minutes: string) => {
    return `${routeTypesMap[routeType] ?? ''} #${routeShortName} (to ${directionStopName}) is going to departure from ${stopName} in MIN ${minutes}`;
};

export const parseDepartues = (deps: Departureboards): string[] => {
    const stopNamesMap = Object.fromEntries(deps.stops.map(s => [s.stop_id, s.stop_name]));

    return deps.departures.map(d => tpl(
        d.route.type,
        d.route.short_name,
        d.trip.headsign,
        stopNamesMap[d.stop.id] ?? 'UNKNOWN STOP',
        d.departure_timestamp.minutes,
    ));
};

type Departure = {
    short: string,
    predicted: string | null,
};

type Route = {
    stopId: string,
    vehicleType: VehicleType,
    routeNumber: string,
    departures: Departure[],
    direction: string,
    platformId: string,
    isNight: boolean,
};

type Stop = {
    stopId: string,
    stopName: string,
    routes: Route[],
}

const compare = (a: Stop, b: Stop) => {
    if (a.stopName < b.stopName) {
        return -1;
    }
    if (a.stopName > b.stopName) {
        return 1;
    }
    return 0;
}

export const parseDepartuesToJson = (deps: Departureboards) => {
    const stopNamesMap = Object.fromEntries(deps.stops.map(s => [s.stop_id, s.stop_name]));
    const groupsByRoute: Record<string, Route> = {};

    deps.departures.forEach(d => {
        const key = `${d.route.short_name}_${d.stop.id}`;
        if (!groupsByRoute[key]) {
            groupsByRoute[key] = {
                routeNumber: d.route.short_name,
                stopId: d.stop.id,
                vehicleType: routeTypesMap[d.route.type] ?? 'unknown',
                direction: d.trip.headsign,
                departures: [],
                platformId: '',
                isNight: d.route.is_night,
            };
        }

        groupsByRoute[key].departures.push({
            short: d.departure_timestamp.minutes,
            predicted: d.arrival_timestamp.predicted,
        });
    });

    const groupsByStop: Record<string, Stop> = {};

    Object.values(groupsByRoute).forEach(r => {
        const [key, platformId] = r.stopId.split('Z');
        if (!groupsByStop[key]) {
            groupsByStop[key] = {
                stopId: key,
                stopName: stopNamesMap[r.stopId] ?? '',
                routes: [],
            };
        }

        groupsByStop[key].routes.push({ ...r, platformId });
    });

    return Object.values(groupsByStop).sort(compare);
};
