export type WeatherRespons = {
    current: {
        time: string,
        temperature_2m: number,
        wind_speed_10m: number,
        rain: number,
        showers: number,
        snowfall: number,
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
        ['current', 'temperature_2m,wind_speed_10m,rain,showers,snowfall'],
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

type PrecipitationType = 'rain' | 'showers' | 'snowfall';
type Precipitation = {
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

type WeatherItem = {
    time: string,
    temperature: number,
    windSpeed: number,
    precipitation: Precipitation,
};
type WeatherData = {
    current: WeatherItem,
    forecast: WeatherItem[],
};

export const parseWeatherResponse = (w: WeatherRespons): WeatherData => {
    const result: WeatherData = {
        current: {
            time: w.current.time,
            temperature: w.current.temperature_2m,
            windSpeed: w.current.wind_speed_10m,
            precipitation: findPrecipitation({
                rain: w.current.rain,
                showers: w.current.showers,
                snowfall: w.current.snowfall,
            }),
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
