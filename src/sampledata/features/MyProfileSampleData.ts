/*
 * SAMPLE DATA: logged in user profile for Profile/MyProfile while the
 * AUTH user APIs are disabled.
 */
import type { IAddress } from "@n20a/libform";

interface ISampleUserProfile {
    LoginUserName: string;
    LoginShortName: string;
    LoginUserEmail: string;
    Phone: string;
    CompanyName: string;
    RoleName: string;
    Address: IAddress;
}

/* Address in the shape AddressForm expects for initialAddress. */
const sampleUserAddress: IAddress = {
    Address1: "500 West Madison Street",
    Address2: "Suite 2400",
    City: "Chicago",
    State: "IL",
    Country: "United States",
    Zip: "60661",
    CountryCode: "US",
    Latitude: "41.8819",
    Longitude: "-87.6398",
    TimezoneOffset: "-06:00"
};

/* Same shape the axios interceptor returns for the user profile lookup. */
const sampleUserProfile: ISampleUserProfile = {
    LoginUserName: "demo.user",
    LoginShortName: "Admin",
    LoginUserEmail: "demo.user@example.com",
    Phone: "+1 312 555 0142",
    CompanyName: "NetZoom, Inc.",
    RoleName: "Administrator",
    Address: sampleUserAddress
};

export { sampleUserProfile, sampleUserAddress };
export type { ISampleUserProfile };
