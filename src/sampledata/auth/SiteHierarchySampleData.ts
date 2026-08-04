/*
 * SAMPLE DATA: site hierarchy from SiteHierarchy.json for InitSession replacement.
 */
import siteHierarchySample from "./SiteHierarchy.json";

type SiteHierarchyPayload = {
    Site?: Record<string, unknown>[];
    [key: string]: unknown;
};

type SiteHierarchyFile = {
    SiteHierarchyJson?: SiteHierarchyPayload;
};

const sampleSiteHierarchyRecords: SiteHierarchyPayload =
    (siteHierarchySample as SiteHierarchyFile).SiteHierarchyJson ??
    (siteHierarchySample as SiteHierarchyPayload);

export { sampleSiteHierarchyRecords };
