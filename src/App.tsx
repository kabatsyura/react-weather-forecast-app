import "./App.css";
import { useEffect, useState } from "react";
import { cities } from "./data/citiesData";
import MeteoService from "./services/meteoService";
import localStorageService from "./services/localStorageService";
import type { FormApiData, MeteoData } from "./types/types";
import { Container, Form, Row } from "react-bootstrap";
import { timeRangeData } from "./data/timeRangeData";
import "bootstrap/dist/css/bootstrap.min.css";
import { LineGraph } from "./components/lineGraph";

function App() {
  const [formData, setFormData] = useState<FormApiData>({
    city: cities[0].name,
    range: timeRangeData[0].name,
  });
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const loadAndStoreData = async () => {
      try {
        const options = {
          cities: cities,
          latitude: cities.map((city) => city.latitude),
          longitude: cities.map((city) => city.longitude),
          hourly: "temperature_2m",
        };

        const meteoData: MeteoData[] = await MeteoService.getForecast(options);
        localStorageService.setItem("meteoData", meteoData);
        setLoaded(true);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    loadAndStoreData();
  }, []);

  return (
    <Container fluid>
      <Row>
        <h1>Прогноз погоды</h1>
        <Form className="d-flex justify-content-center top-0 p-3">
          <Form.Select
            className="fs-6 m-3"
            name="city"
            size="lg"
            value={formData.city}
            onChange={handleChange}
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            className="fs-6 m-3"
            name="range"
            size="lg"
            value={formData.range}
            onChange={handleChange}
          >
            {timeRangeData.map((time) => (
              <option key={time.name} value={time.name}>
                {time.label}
              </option>
            ))}
          </Form.Select>
        </Form>
      </Row>
      {isLoaded && <LineGraph formData={formData} />}
      <Row className="mt-3">
        <p className="text-start">Тестовое выполнил - Кабацюра Дмитрий</p>
        <p className="text-start">
          Выполнил задание находясь в отпуске в Крыму, из подсанкционного
          региона. GitHub, а также многие сайты с документацией заблокированы
          для региона.
        </p>
      </Row>
    </Container>
  );
}

export default App;
