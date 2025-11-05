import type { ForecastPeriod, FormApiData, WeatherData } from "../types/types";
import { Col, Row, Spinner } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import localStorageService from "../services/localStorageService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip
);

const isValidForecastPeriod = (range: string): range is ForecastPeriod =>
  ["6h", "24h", "3d", "7d"].includes(range);

export function LineGraph({ formData }: { formData: FormApiData }) {
  const { city, range } = formData;

  const meteoData = useMemo<WeatherData>(
    () => localStorageService.getItem("meteoData") || {},
    []
  );

  const hasValidRange = isValidForecastPeriod(range);
  const cityData = meteoData[city];
  const normalizedData = cityData?.normalizedData;
  const periodData =
    hasValidRange && normalizedData ? normalizedData[range] : undefined;

  const hasData = !!cityData && hasValidRange && periodData;

  return (
    <Row lg={6}>
      <Col lg={12}>
        {hasData ? (
          <Line
            key={`chart-${city}`}
            data={{
              labels: periodData.times,
              datasets: [
                {
                  label: "Температура (°C)",
                  data: periodData.temperatures,
                  borderColor: "green",
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  mode: "index",
                  intersect: false,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  padding: 12,
                  displayColors: false,
                  callbacks: {
                    title: () => "",
                    label: (context) => {
                      const temp = context.parsed.y;
                      return `Температура: ${temp!.toFixed(1)}°C`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: "Время" },
                  ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  title: { display: true, text: "Температура (°C)" },
                },
              },
            }}
          />
        ) : (
          <Spinner animation="grow" variant="success" />
        )}
      </Col>
    </Row>
  );
}
