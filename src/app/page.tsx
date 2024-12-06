'use client';

import { useState, useEffect } from 'react';
import { Form, ListGroup, Container, Row, Col } from 'react-bootstrap';
import citiesData from './data/cities.json';
import { findNearestCities } from './utils/cityUtils';
import { City } from './types/City';

// Función para eliminar ciudades duplicadas
const removeDuplicates = (cities: City[]): City[] => {
  const uniqueCities = new Map();
  cities.forEach(city => {
    const key = `${city.name}-${city.country}`;
    if (!uniqueCities.has(key)) {
      uniqueCities.set(key, city);
    }
  });
  return Array.from(uniqueCities.values());
};

const HomePage = () => {
  const [search, setSearch] = useState(''); // Texto del input
  const [cities, setCities] = useState<City[]>(removeDuplicates(citiesData)); // Lista única de ciudades
  const [filteredCities, setFilteredCities] = useState<City[]>(cities); // Ciudades filtradas por búsqueda
  const [nearestCities, setNearestCities] = useState<City[]>([]); // Ciudades más cercanas

  // Filtrar ciudades basadas en el texto del input
  useEffect(() => {
    if (search.trim()) {
      setFilteredCities(
        cities.filter(city =>
          city.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredCities(cities);
    }
  }, [search, cities]);

  // Manejar selección de una ciudad
  const handleCitySelect = (city: City) => {
    const nearest = findNearestCities(city, cities);
    setNearestCities(nearest); // Actualiza las ciudades más cercanas
    setSearch(city.name); // Autocompleta el nombre seleccionado en el input
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={6} className="mx-auto">
          <h1 className="text-center">Encuentra Mi Lugar Cercano</h1>
          <Form.Control
            type="text"
            placeholder="Busca una ciudad"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-3"
          />
          <ListGroup>
            {filteredCities.map(city => (
              <ListGroup.Item
                key={`${city.name}-${city.lat}-${city.lng}`}
                action
                onClick={() => handleCitySelect(city)} // Seleccionar ciudad al hacer clic
              >
                {city.name} ({city.country})
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      {nearestCities.length > 0 && (
        <Row className="mt-4">
          <Col md={6} className="mx-auto">
            <h3>Ciudades más cercanas:</h3>
            <ListGroup>
              {nearestCities.map(city => (
                <ListGroup.Item key={`${city.name}-${city.lat}-${city.lng}`}>
                  {city.name} - {city.distance?.toFixed(2)} km
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
