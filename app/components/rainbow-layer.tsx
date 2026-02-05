import { useEffect, useState, useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import type { FeatureCollection, Polygon } from "geojson";

// Центр Карелии
const CENTER_LON = 32.0;
const CENTER_LAT = 63.5;
const RADIUS = 2.0; // радиус в градусах

// Цвета радуги
const rainbowColors = [
    "#FF0000", // красный
    "#FF7F00", // оранжевый
    "#FFFF00", // желтый
    "#00FF00", // зеленый
    "#0000FF", // синий
    "#4B0082", // индиго
    "#9400D3", // фиолетовый
];

// Функция для создания сектора круга
function createSector(
    centerLon: number,
    centerLat: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    segments: number = 50
): number[][] {
    const coords: number[][] = [[centerLon, centerLat]];

    for (let i = 0; i <= segments; i++) {
        const angle = startAngle + (endAngle - startAngle) * (i / segments);
        const rad = (angle * Math.PI) / 180;
        const lon = centerLon + radius * Math.cos(rad);
        const lat = centerLat + radius * Math.sin(rad);
        coords.push([lon, lat]);
    }

    coords.push([centerLon, centerLat]);
    return coords;
}

export default function RainbowLayer() {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => (prev + 2) % 360); // вращаем на 2 градуса каждые 50мс
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Создаем круговую радугу из секторов
    const rainbowData: FeatureCollection<Polygon> = useMemo(() => {
        const features = rainbowColors.map((color, index) => {
            const anglePerColor = 360 / rainbowColors.length;
            const startAngle = rotation + index * anglePerColor;
            const endAngle = rotation + (index + 1) * anglePerColor;

            return {
                type: "Feature" as const,
                properties: { color },
                geometry: {
                    type: "Polygon" as const,
                    coordinates: [createSector(CENTER_LON, CENTER_LAT, RADIUS, startAngle, endAngle)],
                },
            };
        });

        return {
            type: "FeatureCollection",
            features,
        };
    }, [rotation]);

    return (
        <Source
            id="kola-rainbow"
            type="geojson"
            data={rainbowData}
        >
            <Layer
                id="rainbow-sectors"
                type="fill"
                paint={{
                    "fill-color": ["get", "color"],
                    "fill-opacity": 0.7,
                }}
            />
            <Layer
                id="rainbow-outline"
                type="line"
                paint={{
                    "line-color": "#ffffff",
                    "line-width": 0.5,
                }}
            />
        </Source>
    );
}
