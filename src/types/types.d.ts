export interface ForecastParams {
  cities: City[];
  latitude: number[];
  longitude: number[];
  current?: string;
  hourly?: string;
  daily?: string;
}

export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

interface HourlyUnits {
  time: string;
  temperature_2m: string;
}

interface HourlyData {
  time: string[];
  temperature_2m: number[];
}

export interface ResponseMeteoData {
  map(
    arg0: (
      item: ResponseMeteoData,
      index: number
    ) => { city: string; temperature: number[]; time: string[] }
  ): MeteoData[];
  elevation: number;
  generationtime_ms: number;
  hourly: HourlyData;
  hourly_units: HourlyUnits;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}

type ForecastPeriod = "6h" | "24h" | "3d" | "7d";

export interface MeteoData {
  city: string;
  temperature: number[];
  time: string[];
  normalizedData: {
    [period in ForecastPeriod]: {
      times: string[];
      temperatures: number[];
    };
  };
}

export interface FormApiData {
  city: string;
  range: string;
}

type WeatherData = {
  [cityName: string]: MeteoData;
};
