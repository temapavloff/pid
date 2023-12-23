import { createContext, Context } from 'hono/jsx';
import { type GetDepartures } from '../services/pid';
import { type GetWeather } from '../services/weather';

type ApiContextValue = { getDepartures: GetDepartures, getWeather: GetWeather };

export const ApiContext = createContext({
    getDepartures: () => { throw new Error('Not implemented') },
    getWeather: () => { throw new Error('Not implemented') },
} as ApiContextValue);
