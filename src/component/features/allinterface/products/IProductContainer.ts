
/* One catalog row, used by Products/Other which has no brochure. */
interface IProductCatalogItem {
    ProductID: string;
    ProductName: string;
    Edition: string;
    Description: string;
    UnitPrice: number;
    BillingCycle: string;
}

/* Brochure shell shared by Products/NetZoom and Products/Visio Stencils. */
interface IProductContainer {
    uniqueName: string;//uniqueName for the control and required
    brochureFileName: string;// pdf under public/privatepdf
    brochureTitle: string;// title shown by the pdf viewer
    headerText?: string;// header text coming from the selected menu item
}

export type { IProductContainer, IProductCatalogItem }
