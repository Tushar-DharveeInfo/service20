/*
Since all menu and features and QA and kebab menu are unique names, why not we directly use those string to filter or compare 
*/

// Appqa range for filter
//const AppQAMaxID = 99     //use AppQARange.MAX instead of AppQAMaxID for better readability and maintainability
const AppQARange = { MIN: 10, MAX: 99 }

// Feature Menu range for filter 
const FeatureMenuRange = { MIN: 100, MAX: 999 }

// Feature QA Range for filter 
const FeatureQARange = { MIN: 1000, MAX: 9000 }

//Kebab menu filter range 
const KebabMenuRange = { MIN: 10000, MAX: 100000 }



// Appqa Constants
enum AppQA {
    Signout = "41",
    Help = "42",
    Theme = "43",
    ContactUs = "44",
    Launch = "45",
    Message = "46",
}

// Profile menu feature ids (see public/feature.json)
enum ProfileEnums {
    Profile = "100",
    MyProfile = "104",
    MyActivities = "106",
    MySubscriptions = "108",
}

// Buy / Products menu feature ids
enum ProductsEnums {
    Buy = "120",
    Purchase = "122",
    EULA = "124",
    NetZoom = "126",
    VisioStencils = "128",
    Other = "130",
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

// FAQ menu feature ids
enum FaqEnums {
    FAQ = "300",
    VisioStencils = "302",
    NetZoom = "304",
}

// Purchase QA feature ids (under Buy > Purchase)
enum PurchaseEnums {
    Cart = "1222",
    Orders = "1224",
}

export {
    FeatureMenuRange, AppQA, AppQARange
    , ProfileEnums, ProductsEnums, ServicesEnums, DownloadEnums
    , FaqEnums, PurchaseEnums
    , FeatureQARange
    , KebabMenuRange
}
