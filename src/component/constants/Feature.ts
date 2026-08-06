/*
Since all menu and features and QA and kebab menu are unique names, why not we directly use those string to filter or compare 
*/

// Appqa range for filter
const AppQARange = { MIN: 10, MAX: 99 }

// Feature Menu range for filter 
const FeatureMenuRange = { MIN: 100, MAX: 999 }

// Feature QA Range for filter 
const FeatureQARange = { MIN: 1000, MAX: 9000 }

//Kebab menu filter range 
const KebabMenuRange = { MIN: 10000, MAX: 100000 }


// Appqa Constants — ids match sampledata/auth/smFeatures.json MenuID 10 items
enum AppQA {
    Signout = "41",
    Help = "42",
    Theme = "43",
    Launch = "44",
    Notify = "45",
    Alerts = "46",
    Log = "47",
    Report = "48",
}

// Profile menu feature ids (see sampledata/auth/ServiceFeature.json)
enum FeatureEnums {
    Profile = "100",
    NetZoom = "102",
    VisioStencils = "104",
    Other = "106",
    ClientNetZoom = "154",
    ClientVisioStencils = "156",
    ClientOther = "158",
    ClientIdentityManagement = "152",
    ProductNetZoom = "122",
    ProductVisioStencils = "124",
    ProductOther = "126",
}

// Products menu feature ids
enum ProductsEnums {
    Products = "120",
    NetZoom = "122",
    VisioStencils = "124",
    Other = "126",
}

// Services menu feature ids
enum ServicesEnums {
    Services = "150",
    RequestSupport = "152",
    RequestVisioStencils = "154",
    RequestDeviceModels = "156",
}

// Download menu feature ids
enum DownloadEnums {
    Download = "200",
    DownloadVisioStencils = "202",
    DownloadNetZoom = "204",
}


enum SidebarEnum {
    Property = "Property",
    Log = "Log",
    Notes = "Notes",
    Alerts = "Alerts",
    ActionLog = "ActionLog",
    Assign = "Assign",
    Profile = "Profile",
    Device = "Device"
}

export {
    FeatureMenuRange, AppQA, AppQARange
    , FeatureEnums, ProductsEnums, ServicesEnums, DownloadEnums
    , FeatureQARange
    , SidebarEnum
    , KebabMenuRange
}

