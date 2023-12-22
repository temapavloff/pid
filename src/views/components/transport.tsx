import { FC } from 'hono/jsx'
import { Departure, Stop, VehicleType, fetchDepartures, parseDepartuesToJson } from '../../services/pid/index'

const stops = (process.env['STOPS'] ?? '').split(',').map(s => s.trim());

const getDeparture = (now: number, { short, predicted }: Departure) => {
    if (!predicted) {
        return short;
    }

    const predictedTimeStamp = Number(new Date(predicted));
    const minutes = Math.ceil((predictedTimeStamp - now) / (1000 * 60));

    if (minutes <= 0) {
        return null;
    }

    return String(minutes);
};

const mapTypeToEmoji = {
    metro: <i class="fa-solid fa-train" />,
    tram: <i class="fa-solid fa-train-tram" />,
    bus: <i class="fa-solid fa-bus" />,
};
const getEmoji = (type: VehicleType) => mapTypeToEmoji[type] ?? <i class="fa-solid fa-question" />;

const renderTransportTable = (stop: Stop) => {
    const now = Number(new Date());
    const rows = stop.routes.map((r, index) => (<tr class={index % 2 === 0 ? '' : 'accent'}>
        <td>{getEmoji(r.vehicleType)} {r.isNight ? <i class="fa-solid fa-moon" /> : null}</td>
        <td>{r.routeNumber} <small>(&rarr; {r.direction})</small></td>
        <td>
            <div class="departures">
                {r.departures.filter((_, i) => i < 5).map(d => getDeparture(now, d)).filter(d => d !== null).join(', ')}
            </div>
        </td>
    </tr>))

    return <><tr class="stop"><td colspan={3}><strong>{stop.stopName}</strong></td></tr>{rows}</>;
};

export const Transport: FC = async () => {
    const response = await fetchDepartures(stops);
    const departures = parseDepartuesToJson(response);

    return <table>{departures.map(renderTransportTable)}</table>;
}
