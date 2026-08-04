/*
 * SAMPLE DATA: Products/Other while the product APIs are disabled.
 */
import type { IProductCatalogItem } from "../../component/features/allinterface/products/IProductContainer";

/* Catalog rows for Products/Other. */
const sampleOtherProducts: IProductCatalogItem[] = [
    {
        ProductID: "PRD-0101",
        ProductName: "NetZoom DCM Add-on",
        Edition: "Add-on",
        Description: "Power and environmental monitoring for racks and PDUs.",
        UnitPrice: 4500,
        BillingCycle: "Annual"
    },
    {
        ProductID: "PRD-0102",
        ProductName: "NetZoom Reporting Pack",
        Edition: "Add-on",
        Description: "Prebuilt report templates and scheduled report delivery.",
        UnitPrice: 1800,
        BillingCycle: "Annual"
    },
    {
        ProductID: "PRD-0103",
        ProductName: "Professional Services Block",
        Edition: "Services",
        Description: "40 hour block for implementation and data migration.",
        UnitPrice: 9600,
        BillingCycle: "One Time"
    }
];

export { sampleOtherProducts };
