import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import { IAppContextWrapper } from "../allinterface/IAppContextWrapper";
import { IExplorerTree } from "../allinterface/IExplorerTree";
import { getMeasurementUnit } from "./CommonVariable";

let measurementUnitForSite: string = getMeasurementUnit() ?? "USA";

const ExplorerTreeContext = createContext<IExplorerTree | undefined>(undefined);

const getMuForSite = (): string => measurementUnitForSite;

function ExplorerTreeProvider({ children }: IAppContextWrapper) {
    const [siteHierarchyRecords, setSiteHierarchyRecords] = useState<Record<string, any>>({});
    const [floorDeviceHierarchyRecords, setFloorDeviceHierarchyRecords] = useState<Record<string, any>>({});
    const [allTenantRecords, setAllTenantRecords] = useState<Record<string, any>>({});
    const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
    const [isSiteChanged, setIsSiteChanged] = useState<boolean>(false);
    const [muForSite, setMuForSite] = useState<string>("USA");

    useEffect(() => {
        try {
            if (siteHierarchyRecords && typeof siteHierarchyRecords === "object" && 'Site' in siteHierarchyRecords && siteHierarchyRecords.Site?.length) {
                const firstRecord = siteHierarchyRecords.Site[0];
                if (firstRecord?.Measurement) {
                    measurementUnitForSite = firstRecord?.Measurement;
                    setMuForSite(firstRecord?.Measurement);
                }
            }
        } catch (error) {
            console.error("Error updating measurement unit:", error);
        }
    }, [siteHierarchyRecords]);

    const providers = useMemo(
        () => ({
            siteHierarchyRecords,
            setSiteHierarchyRecords,
            floorDeviceHierarchyRecords,
            setFloorDeviceHierarchyRecords,
            isRefreshed,
            setIsRefreshed,
            isSiteChanged,
            setIsSiteChanged,
            muForSite,
            setMuForSite,
            allTenantRecords,
            setAllTenantRecords
        }),
        [
            siteHierarchyRecords,
            floorDeviceHierarchyRecords,
            isRefreshed,
            muForSite,
            isSiteChanged,
            allTenantRecords
        ]
    );

    return (
        <ExplorerTreeContext.Provider value={providers}>
            {children}
        </ExplorerTreeContext.Provider>
    );
}

export { ExplorerTreeContext, ExplorerTreeProvider, getMuForSite };
