

interface IExplorerTree {

    siteHierarchyRecords: Record<string, any>;
    setSiteHierarchyRecords: React.Dispatch<
        React.SetStateAction<Record<string, any>>
    >;

    floorDeviceHierarchyRecords: Record<string, any>;
    setFloorDeviceHierarchyRecords: React.Dispatch<
        React.SetStateAction<Record<string, any>>
    >;

    allTenantRecords: Record<string, any>;
    setAllTenantRecords: React.Dispatch<
        React.SetStateAction<Record<string, any>>
    >;

    isRefreshed: boolean;
    setIsRefreshed: React.Dispatch<
        React.SetStateAction<boolean>>;

    isSiteChanged: boolean;
    setIsSiteChanged: React.Dispatch<
        React.SetStateAction<boolean>>;

    muForSite: string;
    setMuForSite: React.Dispatch<
        React.SetStateAction<string>>;
}


export type { IExplorerTree };
