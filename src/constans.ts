//Configuraciones del servicio
export const PORT: number = 8080;

//Tiempo en minutos para la cache
export const CACHE_GLOBAL_CLEAN_TIME: number = 10; 
export const FLIGHTS_DATA_CLEAN_TIME: number = 60;

//Configuraciones del limitador
export const RATE_LIMITER_WINDOW_MS: number = 15 * 60 * 1000; // 15 minutos
export const RATE_LIMITER_MAX: number = 100;

//Configuraciones de la API de clima
export const WEATHER_UNLOCKED_API_KEY: string = '85614f21e63f88f9a6bcd1bb8b4cc64c';
export const WEATHER_UNLOCKED_API_ID: string = '1b5b69a9';
export const WEATHER_UNLOCKED_API_URL: string = 'http://api.weatherunlocked.com/api';