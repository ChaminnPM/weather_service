import fs from 'fs';
import CSVReader from '../Common/DB/CSVReader'

jest.mock('fs');

describe('CSVReader', () => {
    const mockCSVData = [
        'origin,destination,airline,flight_num,origin_iata_code,origin_name,origin_latitude,origin_longitude,destination_iata_code,destination_name,destination_latitude,destination_longitude',
        'Origin1,Destination1,Airline1,123,ORI1,Origin One,10.0,20.0,DES1,Destination One,30.0,40.0',
        'Origin2,Destination2,Airline2,456,ORI2,Origin Two,50.0,60.0,DES2,Destination Two,70.0,80.0',
    ].join('\n');

    const mockReadStream = (data: string) => {
        const { PassThrough } = require('stream');
        const stream = new PassThrough();
        process.nextTick(() => {
            stream.write(data);
            stream.end();
        });
        return stream;
    };

    beforeEach(() => {
        (fs.createReadStream as jest.Mock).mockImplementation(() => mockReadStream(mockCSVData));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should read and parse the CSV file correctly', async () => {
        const csvReader = await CSVReader.getInstance();
        const flights = csvReader.getFlights();
        expect(flights).toHaveLength(2);
        expect(flights).toEqual([
            {
                origin: 'Origin1',
                destination: 'Destination1',
                airline: 'Airline1',
                flight_num: '123',
                origin_iata_code: 'ORI1',
                origin_name: 'Origin One',
                origin_latitude: 10.0,
                origin_longitude: 20.0,
                destination_iata_code: 'DES1',
                destination_name: 'Destination One',
                destination_latitude: 30.0,
                destination_longitude: 40.0
            },
            {
                origin: 'Origin2',
                destination: 'Destination2',
                airline: 'Airline2',
                flight_num: '456',
                origin_iata_code: 'ORI2',
                origin_name: 'Origin Two',
                origin_latitude: 50.0,
                origin_longitude: 60.0,
                destination_iata_code: 'DES2',
                destination_name: 'Destination Two',
                destination_latitude: 70.0,
                destination_longitude: 80.0
            }
        ]);
    });

    test('should reload the CSV file correctly', async () => {
        const csvReader = await CSVReader.getInstance();
        const initialFlights = csvReader.getFlights();
        expect(initialFlights).toHaveLength(2);

        const newMockCSVData = [
            'origin,destination,airline,flight_num,origin_iata_code,origin_name,origin_latitude,origin_longitude,destination_iata_code,destination_name,destination_latitude,destination_longitude',
            'Origin3,Destination3,Airline3,789,ORI3,Origin Three,15.0,25.0,DES3,Destination Three,35.0,45.0'
        ].join('\n');

        (fs.createReadStream as jest.Mock).mockImplementation(() => mockReadStream(newMockCSVData));

        await csvReader.reloadCSV();
        const newFlights = csvReader.getFlights();
        expect(newFlights).toHaveLength(1);
        expect(newFlights).toEqual([
            {
                origin: 'Origin3',
                destination: 'Destination3',
                airline: 'Airline3',
                flight_num: '789',
                origin_iata_code: 'ORI3',
                origin_name: 'Origin Three',
                origin_latitude: 15.0,
                origin_longitude: 25.0,
                destination_iata_code: 'DES3',
                destination_name: 'Destination Three',
                destination_latitude: 35.0,
                destination_longitude: 45.0
            }
        ]);
    });
});