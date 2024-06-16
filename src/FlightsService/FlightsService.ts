import CSVReader from '../Common/DB/CSVReader'
import { FlightData } from '../Model/Models';

export class FlightsService {
    private csvReader: CSVReader | null = null;

    constructor() {
        this.initializeCSVReader();
    }

    private async initializeCSVReader(): Promise<void> {
        this.csvReader = await CSVReader.getInstance();
    }

    private async ensureCSVReaderInitialized(): Promise<void> {
        if (!this.csvReader) {
            await this.initializeCSVReader();
        }
    }

    async getFlightCoordinates(airline: string, flight_num: string): Promise<FlightData> {
        await this.ensureCSVReaderInitialized();
        const flights = this.csvReader!.getFlights();
        const flight = flights.find((f: FlightData) => f.airline === airline && f.flight_num === flight_num);
        if (flight) {
            return flight;
        } else {
            throw new Error('Flight not found');
        }
    }
    
    async getAirlines(): Promise<string[]> {
        await this.ensureCSVReaderInitialized();
        const flights = this.csvReader!.getFlights();
        const airlines = flights.map((f: FlightData) => f.airline);
        return [...new Set(airlines)];
    }

    async getFlightNums(airline: string): Promise<string[]> {
        await this.ensureCSVReaderInitialized();
        const flights = this.csvReader!.getFlights();
        const flightNums = flights.filter((f: FlightData) => f.airline === airline).map((f: FlightData) => f.flight_num);
        return [...new Set(flightNums)];
    }

    async getFlights(): Promise<FlightData[]> {
        await this.ensureCSVReaderInitialized();
        return this.csvReader!.getFlights();
    }
}