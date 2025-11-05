import axios from "axios";
import type { ForecastParams, ResponseMeteoData } from "../types/types";

class MeteoService {
  private static instance: MeteoService;
  private BASE_URL: string = "https://api.open-meteo.com/v1/forecast";

  constructor() {}

  async getForecast(options: ForecastParams) {
    const { cities, latitude, longitude, hourly } = options;

    return axios
      .get(this.BASE_URL, {
        params: {
          latitude,
          longitude,
          hourly,
        },
      })
      .then((res: { data: ResponseMeteoData }) => res.data)
      .then((data) =>
        data.map((item: ResponseMeteoData, index: number) => ({
          city: cities[index].name,
          temperature: item.hourly.temperature_2m,
          time: item.hourly.time,
        }))
      )
      .catch((error: unknown) => {
        throw new Error(`Ошибка при обращении к API: ${error}`);
      });
  }

  static getInstance(): MeteoService {
    if (!MeteoService.instance) {
      MeteoService.instance = new MeteoService();
    }
    return MeteoService.instance;
  }
}

export default MeteoService.getInstance();
