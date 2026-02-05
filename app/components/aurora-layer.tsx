import { useEffect, useState, useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import type { FeatureCollection, Polygon } from "geojson";

// Цвета северного сияния
const auroraColors = [
    { color: "#39FF14", opacity: 0.3 }, // яркий зеленый
    { color: "#00FF7F", opacity: 0.25 }, // весенний зеленый
    { color: "#9D00FF", opacity: 0.2 }, // фиолетовый
    { color: "#FF00FF", opacity: 0.15 }, // пурпурный
    { color: "#0080FF", opacity: 0.2 }, // синий
];

// Функция для создания волнистой полосы
function createWavyStripe(
    startLon: number,
    endLon: number,
    centerLat: number,
    amplitude: number,
    frequency: number,
    offset: number,
    width: number
): number[][] {
    const points: number[][] = [];
    const steps = 100;

    // Верхняя граница волны
    for (let i = 0; i <= steps; i++) {
        const lon = startLon + (endLon - startLon) * (i / steps);
        const wave = Math.sin((i / steps) * frequency * Math.PI * 2 + offset) * amplitude;
        const lat = centerLat + wave + width / 2;
        points.push([lon, lat]);
    }

    // Нижняя граница волны (в обратном порядке)
    for (let i = steps; i >= 0; i--) {
        const lon = startLon + (endLon - startLon) * (i / steps);
        const wave = Math.sin((i / steps) * frequency * Math.PI * 2 + offset) * amplitude;
        const lat = centerLat + wave - width / 2;
        points.push([lon, lat]);
    }

    points.push(points[0]); // замыкаем полигон
    return points;
}

export default function AuroraLayer() {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => prev + 0.05);
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Создаем несколько волнистых полос для северного сияния
    const auroraData: FeatureCollection<Polygon> = useMemo(() => {
        const features = auroraColors.map((style, index) => {
            // Каждая полоса имеет свою частоту, амплитуду и смещение
            const centerLat = 69 + index * 0.8 - 2; // располагаем над Кольским
            const amplitude = 0.5 + index * 0.2;
            const frequency = 2 + index * 0.3;
            const offset = time + index * Math.PI / 3;
            const width = 1.2 + index * 0.2;

            return {
                type: "Feature" as const,
                properties: {
                    color: style.color,
                    opacity: style.opacity * (0.7 + Math.sin(time * 2 + index) * 0.3), // пульсация
                },
                geometry: {
                    type: "Polygon" as const,
                    coordinates: [
                        createWavyStripe(
                            25, // западная граница
                            45, // восточная граница
                            centerLat,
                            amplitude,
                            frequency,
                            offset,
                            width
                        )
                    ],
                },
            };
        });

        return {
            type: "FeatureCollection",
            features,
        };
    }, [time]);

    return (
        <Source
            id="aurora"
            type="geojson"
            data={auroraData}
        >
            <Layer
                id="aurora-glow"
                type="fill"
                paint={{
                    "fill-color": ["get", "color"],
                    "fill-opacity": ["get", "opacity"],
                }}
            />
        </Source>
    );
}
