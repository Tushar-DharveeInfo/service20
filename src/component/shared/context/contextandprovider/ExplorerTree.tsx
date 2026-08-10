import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import { IAppContextWrapper } from "../allinterface/IAppContextWrapper";
import { IExplorerTree } from "../allinterface/IExplorerTree";

const ExplorerTreeContext = createContext<IExplorerTree | undefined>(undefined);

function ExplorerTreeProvider({ children }: IAppContextWrapper) {
    const [siteHierarchyRecords, setSiteHierarchyRecords] = useState<Record<string, any>>({});
    const [floorDeviceHierarchyRecords, setFloorDeviceHierarchyRecords] = useState<Record<string, any>>({});
    const [allTenantRecords, setAllTenantRecords] = useState<Record<string, any>>({});
    const [isRefreshed, setIsRefreshed] = useState<boolean>(false);
    const [isSiteChanged, setIsSiteChanged] = useState<boolean>(false);



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
            allTenantRecords,
            setAllTenantRecords
        }),
        [
            siteHierarchyRecords,
            floorDeviceHierarchyRecords,
            isRefreshed,
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

export { ExplorerTreeContext, ExplorerTreeProvider };
