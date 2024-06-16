import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { PORT, CACHE_GLOBAL_CLEAN_TIME, FLIGHTS_DATA_CLEAN_TIME, WEATHER_UNLOCKED_API_ID, WEATHER_UNLOCKED_API_KEY, WEATHER_UNLOCKED_API_URL, RATE_LIMITER_MAX, RATE_LIMITER_WINDOW_MS } from './constans';
import JobManager from './Common/Job/JobManager';
import CacheHelper from './Common/Cache/CacheHelper';
import CSVReader from './Common/DB/CSVReader';
import { FlightsService } from './FlightsService/FlightsService';
import WeatherWebService from './WeatherWebService/WeatherWebService';

const app = express();
const cache = CacheHelper.getInstance();
const jobManager: JobManager = new JobManager();
const flightsService: FlightsService = new FlightsService();
const weatherService: WeatherWebService = new WeatherWebService(WEATHER_UNLOCKED_API_URL, WEATHER_UNLOCKED_API_ID, WEATHER_UNLOCKED_API_KEY);


const limiter = rateLimit({
    windowMs: RATE_LIMITER_WINDOW_MS,
    max: RATE_LIMITER_MAX,
    message: 'Many requests, please try again later.',
    headers: true,
});

app.use(limiter);
app.use(cors());
app.use(express.json());


const removeAllKeysInCache = () => {
    cache.clear();
};

const refleshFlightsData = async () => {
    const csvReader = await CSVReader.getInstance();
    await csvReader.reloadCSV();
}

app.get('/ping', (_req, res) => {
    res.send('pong');
});



app.post('/weather', async (req, res) => {
    const { airline, flight_num } = req.body;

    if (!airline || !flight_num) {
        res.status(400).send('Bad request');
        return;
    }
    try {
        const flightData = await flightsService.getFlightCoordinates(airline, flight_num);
        const cacheKey = `${airline}-${flight_num}`;
        const cacheData = cache.get(cacheKey);
        if (cacheData) {
            res.send(cacheData);
        }else{
            const weatherOriginData = await weatherService.getWeatherByCoordinates(flightData.origin_latitude, flightData.origin_longitude, flightData.origin_name, flightData.origin_iata_code);
            const weatherDestinationData = await weatherService.getWeatherByCoordinates(flightData.destination_latitude, flightData.destination_longitude, flightData.destination_name, flightData.destination_iata_code);
            res.send({ origin: weatherOriginData, destination: weatherDestinationData });
            cache.set(cacheKey, { origin: weatherOriginData, destination: weatherDestinationData });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/airlines', async (_req, res) => {
    try {
        const airlines = await flightsService.getAirlines();
        res.send({airlines: airlines});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/flight_nums', async (req, res) => {
    const airline: string = req.query.airline as string;
    if (!airline) {
        res.status(400).send('Bad request');
        return;
    }
    try {
        const flightNums = await flightsService.getFlightNums(airline);
        res.send({flight_nums: flightNums});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

jobManager.scheduleJob(CACHE_GLOBAL_CLEAN_TIME, removeAllKeysInCache);
jobManager.scheduleJob(FLIGHTS_DATA_CLEAN_TIME, refleshFlightsData);

(async () => {
    await CSVReader.getInstance();
})();

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});
