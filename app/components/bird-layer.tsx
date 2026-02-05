import { useEffect, useState, useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import type { FeatureCollection, Polygon } from "geojson";

// Область между Архангельской и Ленинградской областями
const CENTER_LON = 38.0;
const CENTER_LAT = 62.0;
const MOVEMENT_RADIUS = 3.0; // радиус "метания"
const BIRD_SIZE = 0.3; // размер птицы в градусах

// Функция для создания силуэта птицы (вид сверху, с расправленными крыльями)
function createBirdShape(centerLon: number, centerLat: number, angle: number): number[][] {
    const size = BIRD_SIZE;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Функция для поворота точки вокруг центра
    const rotate = (x: number, y: number) => [
        centerLon + (x * cos - y * sin) * size,
        centerLat + (x * sin + y * cos) * size,
    ];

    return [
        // Голова
        rotate(0, 0.5),
        // Правое крыло
        rotate(0.8, 0.3),
        rotate(1.2, 0),
        rotate(0.9, -0.2),
        // Правая сторона тела
        rotate(0.3, -0.1),
        // Хвост (правая сторона)
        rotate(0.2, -0.6),
        rotate(0, -0.8),
        // Хвост (левая сторона)
        rotate(-0.2, -0.6),
        // Левая сторона тела
        rotate(-0.3, -0.1),
        // Левое крыло
        rotate(-0.9, -0.2),
        rotate(-1.2, 0),
        rotate(-0.8, 0.3),
        // Замыкаем на голову
        rotate(0, 0.5),
    ];
}

export default function BirdLayer() {
    const [position, setPosition] = useState({ lon: CENTER_LON, lat: CENTER_LAT });
    const [targetPosition, setTargetPosition] = useState({ lon: CENTER_LON, lat: CENTER_LAT });
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        // Каждые 1-2 секунды выбираем новую случайную точку для полета
        const targetInterval = setInterval(() => {
            const randomAngle = Math.random() * Math.PI * 2;
            const distance = Math.random() * MOVEMENT_RADIUS;
            setTargetPosition({
                lon: CENTER_LON + Math.cos(randomAngle) * distance,
                lat: CENTER_LAT + Math.sin(randomAngle) * distance,
            });
        }, 1000 + Math.random() * 1000);

        // Плавное движение к цели (быстрое, нервное)
        const moveInterval = setInterval(() => {
            setPosition((current) => {
                const dx = targetPosition.lon - current.lon;
                const dy = targetPosition.lat - current.lat;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 0.1) return current;

                // Обновляем угол поворота в сторону движения
                setAngle(Math.atan2(dy, dx) + Math.PI / 2);

                // Быстрое движение с небольшими хаотичными отклонениями
                const speed = 0.15;
                const jitter = 0.05; // нервная дрожь
                return {
                    lon: current.lon + dx * speed + (Math.random() - 0.5) * jitter,
                    lat: current.lat + dy * speed + (Math.random() - 0.5) * jitter,
                };
            });
        }, 50);

        return () => {
            clearInterval(targetInterval);
            clearInterval(moveInterval);
        };
    }, [targetPosition]);

    const birdData: FeatureCollection<Polygon> = useMemo(() => ({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    coordinates: [createBirdShape(position.lon, position.lat, angle)],
                },
            },
        ],
    }), [position, angle]);

    return (
        <Source
            id="bird"
            type="geojson"
            data={birdData}
        >
            {/* Заливка птицы */}
            <Layer
                id="bird-fill"
                type="fill"
                paint={{
                    "fill-color": "#000000",
                    "fill-opacity": 0.8,
                }}
            />
            {/* Контур птицы */}
            <Layer
                id="bird-outline"
                type="line"
                paint={{
                    "line-color": "#ffffff",
                    "line-width": 2,
                }}
            />
        </Source>
    );
}
