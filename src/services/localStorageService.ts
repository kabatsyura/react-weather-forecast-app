import type { ForecastPeriod, MeteoData } from "../types/types";

class LocalStorageService {
  private static instance: LocalStorageService;

  constructor() {}

  setItem(key: string, data: Array<MeteoData>) {
    const transformedKeyedData = data.reduce((acc, curr) => {
      acc[curr.city] = {
        time: curr.time,
        temperature: curr.temperature,
        normalizedData: {
          "6h": { times: [], temperatures: [] },
          "24h": { times: [], temperatures: [] },
          "3d": { times: [], temperatures: [] },
          "7d": { times: [], temperatures: [] },
        },
      };

      acc[curr.city].normalizedData = this.assignToPeriod(
        acc[curr.city].normalizedData,
        curr
      );

      return acc;
    }, {} as Record<string, Omit<MeteoData, "city">>);

    localStorage.setItem(key, JSON.stringify(transformedKeyedData));
  }

  getItem(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private assignToPeriod(
    normalizedData: MeteoData["normalizedData"],
    data: MeteoData
  ) {
    const currDate = new Date();
    const currHour = currDate.getHours();

    normalizedData["6h"].times.push(...data.time.slice(currHour, currHour + 6));
    normalizedData["6h"].temperatures.push(
      ...data.temperature.slice(currHour, currHour + 6)
    );

    normalizedData["24h"].times.push(
      ...data.time.slice(currHour, currHour + 24)
    );
    normalizedData["24h"].temperatures.push(
      ...data.temperature.slice(currHour, currHour + 24)
    );

    normalizedData = this.calculateAverageTemp(
      3,
      "3d",
      data.temperature,
      data.time,
      normalizedData
    );

    normalizedData = this.calculateAverageTemp(
      7,
      "7d",
      data.temperature,
      data.time,
      normalizedData
    );

    return normalizedData;
  }

  private calculateAverageTemp(
    days: number,
    key: ForecastPeriod,
    temperatures: number[],
    times: string[],
    normalizedData: MeteoData["normalizedData"]
  ) {
    const calculateAverage = (arr: number[]): number => {
      return arr.reduce((sum, temp) => sum + temp, 0) / arr.length;
    };

    for (let day = 0; day < days; day++) {
      const startIndex = day * 24;
      const endIndex = startIndex + 24;

      if (startIndex >= temperatures.length) break;

      const dailyTemps = temperatures.slice(
        startIndex,
        Math.min(endIndex, temperatures.length)
      );

      if (dailyTemps.length > 0) {
        const avgTemp = Math.ceil(calculateAverage(dailyTemps));

        const date = new Date(times[startIndex]);
        const dateOnly = date.toISOString().split("T")[0];

        normalizedData[key].temperatures.push(avgTemp);
        normalizedData[key].times.push(dateOnly);
      }
    }

    return normalizedData;
  }

  // removeItem(key: string) {
  //   localStorage.removeItem(key);
  // }

  // hasItem(key: string): boolean {
  //   return !!this.getItem(key);
  // }

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }
}

export default LocalStorageService.getInstance();
