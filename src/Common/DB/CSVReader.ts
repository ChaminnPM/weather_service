import fs from 'fs';
import csvParser from 'csv-parser';

import { FlightData } from '../../Model/Models';

class CSVReader {
    private static instance: CSVReader;
    private static readonly filePath: string = './data/challenge_dataset.csv';
    private flights: FlightData[] = [];

    constructor() {
    }

    public static async getInstance(): Promise<CSVReader> {
        if (!CSVReader.instance) {
            CSVReader.instance = new CSVReader();
            await CSVReader.instance.readCSV();
        }
        return CSVReader.instance;
    }

    async readCSV(): Promise<void> {
        const uniqueFlights: Set<string> = new Set();

        return new Promise((resolve, reject) => {
            fs.createReadStream(CSVReader.filePath)
                .pipe(csvParser())
                .on('data', (data) => {
                    const flightNum = data.flight_num;
                    if (!uniqueFlights.has(flightNum)) {
                        uniqueFlights.add(flightNum);
                        const flightData: FlightData = {
                            origin: data.origin,
                            destination: data.destination,
                            airline: data.airline,
                            flight_num: flightNum,
                            origin_iata_code: data.origin_iata_code,
                            origin_name: data.origin_name,
                            origin_latitude: parseFloat(data.origin_latitude),
                            origin_longitude: parseFloat(data.origin_longitude),
                            destination_iata_code: data.destination_iata_code,
                            destination_name: data.destination_name,
                            destination_latitude: parseFloat(data.destination_latitude),
                            destination_longitude: parseFloat(data.destination_longitude)
                        };
                        this.flights.push(flightData);
                    }
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    getFlights(): FlightData[] {
        return this.flights;
    }

    async reloadCSV(): Promise<void> {
        this.flights = [];
        await this.readCSV();
    }

}

export default CSVReader;