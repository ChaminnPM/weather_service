import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { WEATHER_UNLOCKED_API_KEY, WEATHER_UNLOCKED_API_ID, WEATHER_UNLOCKED_API_URL } from '../constans'
import WeatherWebService from '../WeatherWebService/WeatherWebService';
import { WeatherData } from '../Model/Models';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherWebService', () => {
    let weatherWebService: WeatherWebService;
    const lat = 25.7785;
    const lon = -100.107;
    const location = 'Monterrey';
    const iata_code = 'MTY';
    
    test('getWeatherByCoordinates', async () => {
        const responseData : WeatherData = {
            temp_c: 20,
            temp_f: 68,
            wx_desc: 'Cloudy',
            feelslike_c: 18,
            feelslike_f: 64,
            wx_icon: 'Sunny.gif',
            location: 'Monterrey',
            location_iata_code: 'MTY',
        };
        const response: AxiosResponse<any> = {
            data: responseData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as InternalAxiosRequestConfig,
        };

        mockedAxios.create.mockReturnValue(mockedAxios);
        mockedAxios.get.mockResolvedValue(response);
        weatherWebService = new WeatherWebService(WEATHER_UNLOCKED_API_URL, WEATHER_UNLOCKED_API_ID, WEATHER_UNLOCKED_API_KEY);
        const weatherData: WeatherData = await weatherWebService.getWeatherByCoordinates(lat, lon, location, iata_code);

        expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: WEATHER_UNLOCKED_API_URL });
        expect(mockedAxios.get).toHaveBeenCalledWith(`/current/${lat},${lon}`, {
            params: { app_id: WEATHER_UNLOCKED_API_ID, app_key: WEATHER_UNLOCKED_API_KEY },
        });
        expect(weatherData).toEqual({
            temp_c: 20,
            temp_f: 68,
            wx_desc: 'Cloudy',
            feelslike_c: 18,
            feelslike_f: 64,
            wx_icon: 'Sunny',
            location: 'Monterrey',
            location_iata_code: 'MTY',
        });
    });
    
    test('getWeatherByCoordinates should throw an error if the request fails', async () => {
        const errorMessage = 'MOCK ERROR Failed to fetch weather data';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));

        await expect(weatherWebService.getWeatherByCoordinates(lat, lon, location, iata_code)).rejects.toThrow(errorMessage);
    });
});