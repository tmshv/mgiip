declare module '@turf/bbox' {
    import { BBox, GeoJSON } from 'geojson';
    export function bbox(geojson: GeoJSON): BBox;
}
