import LogData from './GetForensicLog.json'
/* Shape expected by ForensicLog GetFilteredLog handler (logJson). */
const sampleForensicLogApiResponse = {
    logJson: JSON.stringify(LogData),
};

/* Sample MISC.GetRefList (refsites) for SiteTenantUserCascade filter. */
const sampleForensicLogSites = [
    {
        Name: "Chicago",
        Value: "Chicago",
        Label: "Chicago",
        EntID: "DA4FE9AA-C701-4523-9406-4490DCD4C6E4",
        RefValue: "DA4FE9AA-C701-4523-9406-4490DCD4C6E4",
        SortOrder: 1,
        Description: "Chicago site",
    },
];

/* Sample AUTH.GetTenantUserForSite for SiteTenantUserCascade filter. */
const sampleForensicLogTenantUsers = {
    Tenants: [
        {
            TenantID: "TENANT-NZ-001",
            TenantName: "NetZoom",
            Users: [
                { UserID: "USER-ADMIN-001", UserName: "Admin" },
                { UserID: "USER-DEMO-001", UserName: "demo.user" },
            ],
        },
    ],
};

/* Sample AUTH.GetAuthorizedEntity users fallback. */
const sampleForensicLogAuthorizedUsers = [
    { UserID: "USER-ADMIN-001", UserName: "Admin" },
    { UserID: "USER-DEMO-001", UserName: "demo.user" },
];

export {
    sampleForensicLogApiResponse,
    sampleForensicLogSites,
    sampleForensicLogTenantUsers,
    sampleForensicLogAuthorizedUsers,
};
