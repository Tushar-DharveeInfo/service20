/**
 * Icon resolver for service menus.
 * Imports only icons needed for Labels in feature.json (+ small shared/fallback set).
 */
import featureSample from "../../../../sampledata/auth/feature.json";

import {
    // Fallback / shared
    N,
    Setting24x24,
    More24x24,
    Info24x24,
    F24x24,
    R24x24,
    ThreeD24x24,
    AssetAssigment24x24,
    EntityvsTable24x24,

    // feature.json Labels that have matching libicon exports
    Signout24x24,
    Help24x24,
    Theme24x24,
    ContactUs24x24,
    Profile24x24,
    MyProfile24x24,
    MyActvities24x24,
    MySubscriptions24x24,
    Buy24x24,
    Purchase24x24,
    Eula24x24,
    Visio,
    Other24x24,
    Services24x24,
    RequestSupport24x24,
    RequestVisioStencils24x24,
    RequestDeviceModels24x24,
    MyRequests24x24,
    Download24x24,
    DownloadVisioStencils24x24,
    FAQ24x24,
    Cart24x24,
    Orders24x24,
    Details24x24,
    Notes24x24,
    DownloadNetZoom24x24,
} from "@n20a/libicon";

import type { ComponentType } from "react";

type IconMap = Record<string, ComponentType<any>>;

/** Normalize feature Label the same way menus build icon file names. */
const toFeatureIconKey = (label: string): string =>
    `${label.replace(/[^0-9A-Za-z_-]/g, "")}24x24`;

/** Icons that exist in @n20a/libicon for feature.json Labels. */
const featureIconMap: IconMap = {
    Signout24x24,
    Help24x24,
    Theme24x24,
    ContactUs24x24,
    Profile24x24,
    MyProfile24x24,
    MyActvities24x24,
    MySubscriptions24x24,
    Buy24x24,
    Purchase24x24,
    Eula24x24,
    // Label lookups keep VisioStencils24x24 / NetZoom24x24 / NZIcon24x24 keys.
    VisioStencils24x24: Visio,
    Visio,
    NetZoom24x24: N,
    NZIcon24x24: N,
    N,
    Other24x24,
    Services24x24,
    RequestSupport24x24,
    RequestVisioStencils24x24,
    RequestDeviceModels24x24,
    MyRequests24x24,
    Download24x24,
    DownloadVisioStencils24x24,
    DownloadNetZoom24x24,
    FAQ24x24,
    Cart24x24,
    Orders24x24,
    Details24x24,
    Notes24x24,
};

/**
 * feature.json Labels without an exact libicon name → closest available icon.
 * Keys match ExpandableList / MainMenu icon lookup (`Label` + `24x24`).
 */
const featureAliases: Record<string, string> = {
    MyActivities24x24: "MyActvities24x24",
    EULA24x24: "Eula24x24",
    Settings24x24: "Setting24x24",
    VisioStencils24x24: "Visio",
    NetZoom24x24: "N",
    NZIcon24x24: "N",
};

/** Shared icons used by tree/submenu aliases and Settings. */
const sharedIconMap: IconMap = {
    Setting24x24,
    More24x24,
    Info24x24,
    F24x24,
    R24x24,
    ThreeD24x24,
    AssetAssigment24x24,
    EntityvsTable24x24,
};

const rawIconMap: IconMap = {
    ...featureIconMap,
    ...sharedIconMap,
};

const iconMap: IconMap = Object.fromEntries(
    Object.entries(rawIconMap).map(([k, v]) => [k.toLowerCase(), v])
);

/** Built-in aliases: feature.json gaps + normalize lowercase lookup. */
const builtInAliases: Record<string, string> = Object.fromEntries(
    Object.entries(featureAliases).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()])
);

type ResolverOptions = {
    defaultIcon?: ComponentType<any>;
    aliases?: Record<string, string>;
};

const FnResolveIcons = (options?: ResolverOptions) => {
    try {
        const { defaultIcon = N, aliases = {} } = options || {};

        const normalizedAliases = Object.fromEntries(
            Object.entries({ ...builtInAliases, ...aliases }).map(([k, v]) => [
                k.toLowerCase(),
                v.toLowerCase(),
            ])
        );

        return (fileName?: string): ComponentType<any> => {
            try {
                if (!fileName) return defaultIcon;

                const key = fileName.toLowerCase();
                const resolvedKey = normalizedAliases[key] || key;

                return iconMap[resolvedKey] || defaultIcon;
            } catch (error) {
                console.error("FnResolveIcons resolver error:", error);
                return defaultIcon;
            }
        };
    } catch (error) {
        console.error("FnResolveIcons error:", error);
        return (): ComponentType<any> => N;
    }
};

/** Unique icon keys expected from feature.json Labels (for diagnostics). */
const featureIconKeys = [
    ...new Set(
        (featureSample as Array<{ Label?: string }>)
            .map((item) => item.Label)
            .filter((label): label is string => Boolean(label))
            .map(toFeatureIconKey)
    ),
];

export { FnResolveIcons, N, Setting24x24, featureIconKeys, toFeatureIconKey };
