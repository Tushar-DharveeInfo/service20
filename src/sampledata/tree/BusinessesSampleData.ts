/*
 * SAMPLE DATA: businesses from businesses.json for explorer tree mapping.
 * Replace this import with API response data when available.
 */
import businessesSample from "./businesses.json";
import type { IBusiness, IBusinessesResponse } from "../../component/shared/allinterface/tree/IBusiness";

const sampleBusinesses: IBusiness[] =
    (businessesSample as IBusinessesResponse).businesses ?? [];

export { sampleBusinesses };
