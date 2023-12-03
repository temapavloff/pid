import { RequestListener } from 'http';
import { fetchDepartures, parseDepartuesToJson } from '../services/pid/index';
import { writeJson } from '../server/utils/index';

export const handleDepartues: RequestListener = async (_, res) => {
    const departues = await fetchDepartures((process.env['STOPS'] ?? '').split(',').map(s => s.trim()));
    writeJson(res, parseDepartuesToJson(departues));
};
