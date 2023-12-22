import { FC } from 'hono/jsx'
import { Precipitation, PrecipitationType, fetchWeather, parseWeatherResponse } from '../../services/weather/index';

const [latitude, longitude] = (process.env['COORDINATES'] ?? ',').split(',');

const mapWeatherCodesToEmoji = {
    clear: <i class="fa-solid fa-sun" />,
    partial_cloud: <i class="fa-solid fa-cloud-sun" />,
    fog: <i class="fa-solid fa-smog" />,
    drizzle: <i class="fa-solid fa-droplet" />,
    freezing_drizzle: <i class="fa-solid fa-icicles" />,
    rain: <i class="fa-solid fa-cloud-rain" />,
    freezing_rain: <><i class="fa-solid fa-droplet" /><i class="fa-solid fa-icicles" /></>,
    snow_fall: <i class="fa-regular fa-snowflake" />,
    snow_grains: <i class="fa-regular fa-snowflake" />,
    rain_showers: <><i class="fa-solid fa-cloud-rain" /><i class="fa-solid fa-cloud-rain" /></>,
    snow_showers: <><i class="fa-regular fa-snowflake" /><i class="fa-regular fa-snowflake" /></>,
    thunderstorm: <i class="fa-solid fa-cloud-bolt" />,
    thunderstorm_hail: <><i class="fa-solid fa-cloud-bolt" /><i class="fa-solid fa-cloud-bolt" /></>,
} as const;

const mapPrecipitationToEmoji = {
    rain: <i class="fa-solid fa-cloud-rain" />,
    showers: <><i class="fa-regular fa-snowflake" /><i class="fa-regular fa-snowflake" /></>,
    snowfall: <i class="fa-regular fa-snowflake" />,
} as const;
const getPrecipitationEmoji = (type: PrecipitationType) => mapPrecipitationToEmoji[type] ?? null;
const windEmoji = <i class="fa-solid fa-wind" />;

const renderPrecipitation = (p: Precipitation) => {
    if (p.probability === 0) {
        return <i class="fa-solid fa-sun" />;
    }

    return <>{getPrecipitationEmoji(p.type)} {Math.ceil(p.probability * 100)}%</>
};

const renderTime = (dt: string) => {
    const d = new Date(dt);
    let hours: number | string = d.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    }
    return `${hours}:00`;
}

const renderTemperature = (t: number) => {
    return Math.sign(t) * Math.ceil(Math.abs(t));
}

export const Weather: FC = async () => {
    const response = await fetchWeather(latitude, longitude);
    const data = parseWeatherResponse(response);

    const current = <tr>
        <td colspan={6} class="current_weather">
            <strong style="margin-right:0.5em;">{renderTemperature(data.current.temperature)}°</strong>
            <span style="margin-right:0.5em;">{mapWeatherCodesToEmoji[data.current.weatherCode]}</span>
            <small>{windEmoji}{Math.ceil(data.current.windSpeed)} m/s</small>
        </td>
    </tr>;
    const forecast = data.forecast.map(f => (<td>
        <small>{renderTime(f.time)}</small> <br />
        <strong>{renderTemperature(f.temperature)}°</strong> <br />
        {renderPrecipitation(f.precipitation)} <br />
        <small>{windEmoji} {Math.ceil(f.windSpeed)} m/s</small>
    </td>));

    return (
        <table class="weather_table">
            {current}
            <tr>{forecast}</tr>
        </table>
    );
}
