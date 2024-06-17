import { FlightsService } from '../FlightsService/FlightsService';
import CSVReader from '../Common/DB/CSVReader';
import { FlightData } from '../Model/Models';

jest.mock('../Common/DB/CSVReader');

const mockFlightData: FlightData[] = [
    { airline: 'Airline1', flight_num: '123', origin: 'Origin1', destination: 'Destination1', origin_iata_code: 'ORI1', origin_name: 'Origin One', origin_latitude: 10, origin_longitude: 20, destination_iata_code: 'DES1', destination_name: 'Destination One', destination_latitude: 30, destination_longitude: 40 },
    { airline: 'Airline2', flight_num: '456', origin: 'Origin2', destination: 'Destination2', origin_iata_code: 'ORI2', origin_name: 'Origin Two', origin_latitude: 50, origin_longitude: 60, destination_iata_code: 'DES2', destination_name: 'Destination Two', destination_latitude: 70, destination_longitude: 80 },
];

describe('FlightsService', () => {
    let flightsService: FlightsService;
    let csvReaderInstance: jest.Mocked<CSVReader>;

    beforeAll(async () => {
        csvReaderInstance = new CSVReader() as jest.Mocked<CSVReader>;
        CSVReader.getInstance = jest.fn().mockResolvedValue(csvReaderInstance);
        csvReaderInstance.getFlights.mockReturnValue(mockFlightData);

        flightsService = new FlightsService();
        await flightsService['initializeCSVReader']();
    });

    test('should return flight coordinates for a valid flight', async () => {
        const flight = await flightsService.getFlightCoordinates('Airline1', '123');
        expect(flight).toEqual(mockFlightData[0]);
    });

    test('should throw an error for an invalid flight', async () => {
        await expect(flightsService.getFlightCoordinates('InvalidAirline', '999')).rejects.toThrow('Flight not found');
    });

    test('should return a list of unique airlines', async () => {
        const airlines = await flightsService.getAirlines();
        expect(airlines).toEqual(['Airline1', 'Airline2']);
    });

    test('should return a list of flight numbers for a given airline', async () => {
        const flightNums = await flightsService.getFlightNums('Airline1');
        expect(flightNums).toEqual(['123']);
    });

    test('should return all flights', async () => {
        const flights = await flightsService.getFlights();
        expect(flights).toEqual(mockFlightData);
    });
});