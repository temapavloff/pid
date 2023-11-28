import { Departureboards, StopsList } from './pid_types';

export const getStopIds = (stopsList: StopsList): string[] => {
    return stopsList.features.map(s => s.properties.stop_id);
};

export const fetchDepartures = async (stopIds: string[]) => {
    const params = new URLSearchParams([
        ['minutesBefore', '10'],
        ['minutesAfter', '60'],
        ['timeFrom', (new Date()).toISOString()],
        ['includeMetroTrains', 'true'],
        ['preferredTimezone', 'Europe/Prague'],
        ['mode', 'departures'],
        ['order', 'real'],
        ['filter', 'routeOnce'],
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

const routeTypesMap: Record<number, string> = {
    1: 'Metro train',
    0: 'Tram',
    3: 'Bus',
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
