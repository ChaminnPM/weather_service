export interface FlightData {
    origin: string;
    destination: string;
    airline: string;
    flight_num: string;
    origin_iata_code: string;
    origin_name: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_iata_code: string;
    destination_name: string;
    destination_latitude: number;
    destination_longitude: number;
}

export interface WeatherData {
    temp_c: number;
    temp_f: number;
    wx_desc: string;
    feelslike_c: number;
    feelslike_f: number;
    wx_icon: string;
    location: string;
    location_iata_code: string;
}