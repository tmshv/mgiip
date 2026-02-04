import { useMemo } from "react";

type Attribute = {
    key: string;
    value: string | number;
    highlight?: boolean;
};

export type PopupData = {
    title: string;
    onp: string;
    region: string;
    fedokrug: string;
    population: string;
    attributes: Attribute[];
};

export type UseFeaturesOptions = {
    properties: GeoJSON.GeoJsonProperties | null;
    cityTypeKey?: string;
    cityNameKey?: string;
    onpKey?: string;
    regionKey?: string;
    districtKey?: string;
    populationKey?: string;
};

const contests = [
    "2018", "2018_1", "2018_2",
    "2019", "2019_1", "2019_2",
    "2020", "2020_1", "2020_2",
    "2021", "2021_1", "2021_2",
    "2022", "2022_1", "2022_2",
    "2023", "2023_1", "2023_2",
    "2024", "2024_1", "2024_2",
    "2025", "2025_1", "2025_2",
    "дфо1", "дфо2", "дфо3", "дфо4",
];

function buildAttributes(
    properties: Record<string, string>,
    excludedKeys: string[]
): Attribute[] {
    const attributes: Attribute[] = [];

    const podavalsya = properties["подавался"];
    const pobediteli = properties["победители"];
    if (podavalsya != null || pobediteli != null) {
        attributes.push({
            key: "победил/подавался",
            value: `${pobediteli ?? 0} / ${podavalsya ?? 0}`,
            highlight: true,
        });
    }

    const dolyaPobed = properties["доля побед"];
    if (dolyaPobed != null) {
        attributes.push({
            key: "доля побед",
            value: dolyaPobed,
            highlight: true,
        });
    }

    for (const contest of contests) {
        const podacha = properties[`${contest}_подача`];
        const pobeda = properties[`${contest}_победа`];
        if (podacha != null || pobeda != null) {
            attributes.push({
                key: contest,
                value: `${pobeda} / ${podacha}`,
            });
        }
    }

    const otherProperties = Object.entries(properties).filter(
        ([key]) => !excludedKeys.includes(key)
    );
    for (const [key, value] of otherProperties) {
        attributes.push({ key, value });
    }

    return attributes;
}

export function usePopupData({
    properties,
    cityTypeKey = "тип",
    cityNameKey = "нп",
    onpKey = "онп",
    regionKey = "регион",
    districtKey = "федеральный округ",
    populationKey = "население",
}: UseFeaturesOptions): PopupData | null {
    return useMemo(() => {
        if (!properties) {
            return null;
        }

        const contestKeys = contests.flatMap((c) => [`${c}_подача`, `${c}_победа`]);
        const headerKeys = [cityTypeKey, cityNameKey, onpKey];
        const locationKeys = [regionKey, districtKey, populationKey];
        const topKeys = ["подавался", "победители", "доля побед"];
        const excludedKeys = [...contestKeys, ...headerKeys, ...locationKeys, ...topKeys];

        const cityType = properties[cityTypeKey];
        const cityName = properties[cityNameKey];
        const title = [
            cityType ? `${cityType}.` : null,
            cityName,
        ].filter(Boolean).join(" ");

        return {
            title,
            onp: properties[onpKey],
            region: properties[regionKey],
            fedokrug: properties[districtKey],
            population: properties[populationKey],
            attributes: buildAttributes(properties, excludedKeys),
        };
    }, [properties, cityTypeKey, cityNameKey, onpKey, regionKey, districtKey, populationKey]);
}
