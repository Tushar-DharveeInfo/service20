/*
 * SAMPLE DATA: feature records from ServiceFeature.json for InitSession replacement.
 * JSON already uses app-shaped fields (_Feature, SortOrder, DefaultQA, …).
 */
import serviceFeatureSample from "./feature.json";
import type { IFeatureItem } from "../../component/shared/context/allinterface/IMainApp";

type ServiceFeatureRecord = {
    Secured?: string | boolean;
    EntityName?: string;
    MenuID?: string | number;
    Feature?: string | number;
    _Feature?: string | number;
    Label?: string;
    Tooltip?: string;
    SortOrder?: string | number;
    DefaultQA?: string | boolean;
    NodeType?: string;
    FeatureTag?: string;
    FilterForm?: string;
    SearchPrompt?: string | null;
    IsNZ?: string | boolean;
    EntID?: string;
    RecID?: string;
    LastUpdated?: string;
    [key: string]: string | number | boolean | null | undefined;
};

const toFeatureId = (value: string | number | undefined): string =>
    value === undefined || value === null ? "" : String(value);

const toSortOrder = (value: string | number | undefined): number => {
    const n = typeof value === "number" ? value : Number(value ?? 0);
    return Number.isFinite(n) ? n : 0;
};

const toBool = (value: string | boolean | undefined, defaultValue = false): boolean => {
    if (typeof value === "boolean") return value;
    if (value === "1" || value === "true") return true;
    if (value === "0" || value === "false") return false;
    return defaultValue;
};

/*
 * Maps ServiceFeature.json rows to IFeatureItem.
 * Prefer `_Feature` (current export shape). Fall back to legacy `Feature` only
 * when `_Feature` is absent — never fall back to MenuID or every row becomes a top menu.
 */
const mapServiceFeatureToFeatureItem = (record: ServiceFeatureRecord): IFeatureItem => {
    const featureId = toFeatureId(record._Feature ?? record.Feature);
    const menuId = toFeatureId(record.MenuID ?? featureId);

    return {
        ...record,
        EntityName: record.EntityName ?? "Feature",
        MenuID: menuId,
        _Feature: featureId,
        Label: record.Label ?? "",
        Tooltip: record.Tooltip ?? "",
        SortOrder: toSortOrder(record.SortOrder),
        DefaultQA: toBool(record.DefaultQA),
        Secured: toBool(record.Secured),
        NodeType: record.NodeType ?? "",
        FeatureTag: record.FeatureTag ?? "",
        FilterForm: record.FilterForm ?? "",
        SearchPrompt: record.SearchPrompt ?? null,
        IsNZ: toBool(record.IsNZ, true),
        // feature.json often omits EntID; empty EntID makes every menu group match as "selected" and open.
        EntID: record.EntID ? String(record.EntID) : featureId,
        RecID: record.RecID ? String(record.RecID) : featureId,
        LastUpdated: record.LastUpdated ?? "",
    };
};

const sampleFeatureRecords: IFeatureItem[] = (serviceFeatureSample as ServiceFeatureRecord[])
    .map(mapServiceFeatureToFeatureItem);

export { sampleFeatureRecords, mapServiceFeatureToFeatureItem };
