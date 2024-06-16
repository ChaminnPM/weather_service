import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { WeatherData } from '../Model/Models';

class WeatherWebService {
    private axiosInstance: AxiosInstance;
    private appId: string;
    private appKey: string;

    constructor(baseURL: string, appId: string, appKey: string) {
        this.axiosInstance = axios.create({
            baseURL: baseURL,
        });
        this.appId = appId;
        this.appKey = appKey;
    }
    
    public async getWeatherByCoordinates(lat: number, lon: number, location: string, iata_code: string): Promise<WeatherData> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.get(`/current/${lat},${lon}`, {
                params: {
                    app_id: this.appId,
                    app_key: this.appKey,
                },
            });

            const weatherData: WeatherData = {
                temp_c: response.data.temp_c,
                temp_f: response.data.temp_f,
                wx_desc: response.data.wx_desc,
                feelslike_c: response.data.feelslike_c,
                feelslike_f: response.data.feelslike_f,
                wx_icon: response.data.wx_icon.replace('.gif', ''),
                location: location,
                location_iata_code: iata_code,
            };
            
            return weatherData;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }
}

export default WeatherWebService;