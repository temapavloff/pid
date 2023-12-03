import { RequestListener } from 'http';
import { writeJson } from '../server/utils/index';
import { fetchWeather, parseWeatherResponse } from '../services/weather/index';

export const handleWeather: RequestListener = async (_, res) => {
    const [lat, lng] = (process.env['COORDINATES'] ?? ',').split(',');
    const weather = await fetchWeather(lat, lng);
    writeJson(res, parseWeatherResponse(weather));
}
