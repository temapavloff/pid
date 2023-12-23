export type WeatherRespons = {
    current: {
        time: string,
        temperature_2m: number,
        wind_speed_10m: number,
        weather_code: number,
    },
    hourly: {
        time: string[],
        temperature_2m: number[],
        wind_speed_10m: number[],
        rain: number[],
        showers: number[],
        snowfall: number[],
    }
};

const normalizeDigit = (d: number) => d < 10 ? `0${d}` : String(d);
const dateToQuery = (d: Date) => `${d.getFullYear()}-${normalizeDigit(d.getMonth() + 1)}-${normalizeDigit(d.getDate())}`;
const getStartDate = () => dateToQuery(new Date());
const getEndDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return dateToQuery(d);
};

export const fetchWeather = async (latitude: string, longitude: string) => {
    const params = new URLSearchParams([
        ['latitude', latitude],
        ['longitude', longitude],
        ['timezone', 'Europe/Prague'],
        ['current', 'temperature_2m,wind_speed_10m,weather_code'],
        ['hourly', 'temperature_2m,relative_humidity_2m,wind_speed_10m,rain,showers,snowfall'],
        ['start_date', getStartDate()],
        ['end_date', getEndDate()],
    ]);

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

    if (!response.ok) {
        throw new Error(`Unable to fetch weather data: ${response.status}`);
    }

    return response.json() as Promise<WeatherRespons>;
}

export type PrecipitationType = 'rain' | 'showers' | 'snowfall';
export type Precipitation = {
    type: PrecipitationType,
    probability: number,
};

const findPrecipitation = (p: Record<PrecipitationType, number>): Precipitation => {
    const [result] = Object.entries(p).sort(([, pa], [, pb]) => pb - pa);
    return {
        type: result[0] as PrecipitationType,
        probability: result[1],
    };
};

export type WeatherCode = 'clear' | 'partial_cloud' | 'fog' | 'drizzle'
    | 'freezing_drizzle' | 'rain' | 'freezing_rain' | 'snow_fall' | 'snow_grains'
    | 'rain_showers' | 'snow_showers' | 'thunderstorm' | 'thunderstorm_hail';

export type WeatherItem = {
    time: string,
    temperature: number,
    windSpeed: number,
    precipitation: Precipitation,
};
export type WeatherData = {
    current: Omit<WeatherItem, 'precipitation'> & { weatherCode: WeatherCode },
    forecast: WeatherItem[],
};

const parseWeatherCode = (c: number): WeatherCode => {
    if (c > 0 && c < 4) return 'partial_cloud';
    if (c > 44 && c < 49) return 'fog';
    if (c > 50 && c < 56) return 'drizzle';
    if (c > 55 && c < 57) return 'freezing_drizzle';
    if (c > 60 && c < 66) return 'rain';
    if (c > 65 && c < 68) return 'freezing_rain';
    if (c > 70 && c < 76) return 'snow_fall';
    if (c === 77) return 'snow_grains';
    if (c > 79 && c < 83) return 'rain_showers';
    if (c > 84 && c < 87) return 'snow_showers';
    if (c === 95) return 'thunderstorm';
    if (c > 95 && c < 100) return 'thunderstorm_hail';

    return 'clear';
}

export const parseWeatherResponse = (w: WeatherRespons): WeatherData => {
    const result: WeatherData = {
        current: {
            time: w.current.time,
            temperature: w.current.temperature_2m,
            windSpeed: w.current.wind_speed_10m,
            weatherCode: parseWeatherCode(w.current.weather_code),
        },
        forecast: [],
    };

    const d = new Date();
    const date = d.getDate();
    const hour = d.getHours();
    const startIndex = 1 + w.hourly.time.findIndex(ds => {
        const d = new Date(ds);
        return date === d.getDate() && hour === d.getHours();
    });
    const endIndex = startIndex + 6;

    for (let i = startIndex; i < endIndex; i += 1) {
        result.forecast.push({
            time: w.hourly.time[i] ?? '',
            temperature: w.hourly.temperature_2m[i] ?? 0,
            windSpeed: w.hourly.wind_speed_10m[i] ?? 0,
            precipitation: findPrecipitation({
                rain: w.hourly.rain[i] ?? 0,
                showers: w.hourly.showers[i] ?? 0,
                snowfall: w.hourly.snowfall[i] ?? 0,
            }),
        });
    }

    return result;
};

export const getWeather = async (latitude: string, longitude: string) => {
    return parseWeatherResponse(await fetchWeather(latitude, longitude));
}

export type GetWeather = typeof getWeather;
