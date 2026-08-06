import type { IMenuItem } from "../../component/shared/allinterface/menu/IMainMenu";
import type { IDataset } from "../../component/shared/allinterface/sidebar/IPropertyFormContainer";
import type { ITreeNode } from "../../component/shared/allinterface/tree/ITreeControl";
import type { IBusiness } from "../../component/shared/allinterface/tree/IBusiness";
import type { IContact } from "../../component/shared/allinterface/tree/IContact";
import { sampleBusinesses } from "../tree/BusinessesSampleData";
import { sampleContacts } from "../tree/ContactsSampleData";
import getTableVsPropertySample from "./GetTableVsPropertySample.json";

/*
* Entity tables returned by EM.GetTableVsProperty for sample Site node.
* Source: get_table_vs_property API `data` array.
*/
const samplePropertyEntityTables = getTableVsPropertySample.data;

/* Property kebab submenu (Sidebar PROPERTY.GetKebabMenu). */
const samplePropertyKebabMenu: IMenuItem[] = [
    { ID: 1, Name: "_Site", Label: "Site", Description: "Data Center Site Details", SortOrder: 1, TotalCount: 1 },
    { ID: 2, Name: "PG.MetricsSiteRacks", Label: "Rack capacity", Description: "Rack capacity", SortOrder: 3, TotalCount: 0 },
    { ID: 3, Name: "PG.MetricsDevicePower", Label: "Power capacity", Description: "Power capacity", SortOrder: 4, TotalCount: 0 },
    { ID: 4, Name: "PG.MetricsResidualCost", Label: "Residual Value", Description: "Residual Value of Assets in Site", SortOrder: 5, TotalCount: 0 },
    { ID: 5, Name: "PG.MetricsResidualWarranty", Label: "Residual Warranty", Description: "Residual Warranty of Assets in Site", SortOrder: 6, TotalCount: 0 },
    { ID: 6, Name: "PG.MetricsResidualService", Label: "Residual Service", Description: "Residual Warranty of Assets in Site", SortOrder: 7, TotalCount: 0 },
    { ID: 7, Name: "PG.Contact", Label: "Contacts", Description: "Data Center Site Contacts", SortOrder: 10, TotalCount: 1 },
    { ID: 8, Name: "PG.SiteStats", Label: "Statistics", Description: "Site Statistics", SortOrder: 11, TotalCount: 1 },
];

const samplePropertyKebabMenuResponse = {
    kebabJson: JSON.stringify({
        KebabMenu: samplePropertyKebabMenu,
    }),
};

/** Property kebab submenu for Business nodes (matches EditText form table `_Business`). */
const sampleBusinessPropertyKebabMenuResponse = {
    kebabJson: JSON.stringify({
        KebabMenu: [
            {
                ID: 1,
                Name: "_Business",
                Label: "Business",
                Description: "Business properties",
                SortOrder: 1,
                TotalCount: 1,
            },
        ],
    }),
};

/** Property kebab submenu for Contact nodes (matches EditText form table `_Contact`). */
const sampleContactPropertyKebabMenuResponse = {
    kebabJson: JSON.stringify({
        KebabMenu: [
            {
                ID: 1,
                Name: "_Contact",
                Label: "Contact",
                Description: "Contact properties",
                SortOrder: 1,
                TotalCount: 1,
            },
        ],
    }),
};

/*
* Property values returned by NODE.GetKebabMenuData / FnNodeGetKebabMenuData.
* Source: get_kebab_menu_data / NZNode_get_entity_vs_property_tab `data.propertyJson` (parsed).
*/
const samplePropertyKebabMenuData: IDataset = {
    _Site: [
        {
            _Site: "Chicago",
            Desc250: "Test Site-Corporate Headquarters test",
            SiteType: "DC",
            Managed: true,
            Locked: false,
            TileX: 24,
            TileY: 24,
            Icon: null,
            TimeZone: "5",
            DateFormat: "mm/dd/yyyy",
            Measurement: "USA",
            Country: "-1",
            RackProvisionPower: 7000,
            DataCenterSize: -1,
            PowerPeakLoad: -1,
            DcmId: "-1",
            Secured: false,
            IsNZ: true,
            EntID: "DA4FE9AA-C701-4523-9406-4490DCD4C6E4",
            RecID: "BC3C9EBB-A0CB-42B1-9236-66300CDB8D35",
            LastUpdated: "2026-07-25T13:30:00",
            EntityName: "Site",
        },
    ],
};

interface IPropertyFormPackage {
    entityTables: Record<string, unknown>[];
    kebabMenuData: IDataset;
}

const toPropertyLabel = (key: string): string =>
    key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/\s+/g, " ")
        .replace(/^./, (char) => char.toUpperCase())
        .trim();

const toFormValue = (value: unknown): string | number | boolean | null => {
    if (value === null || value === undefined) {
        return "";
    }
    if (typeof value === "boolean" || typeof value === "number") {
        return value;
    }
    return String(value);
};

/**
 * Builds property schema + values from a flat key/value record.
 * Every field uses DisplayControl = EditTextControl.
 */
const buildEditTextPropertyFormFromRecord = (
    record: Record<string, unknown>,
    options?: {
        tableName?: string;
        tableLabel?: string;
        entityName?: string;
    }
): IPropertyFormPackage => {
    const entityName = options?.entityName || "Business";
    const tableName = options?.tableName || `_${entityName}`;
    const tableLabel = options?.tableLabel || entityName;
    const keys = Object.keys(record);

    const properties = keys.map((key, index) => ({
        TableName: tableName,
        PName: key,
        Description: key,
        MaxLength: null,
        SortOrder: index + 1,
        RequiredToAddRecord: false,
        RequiredToUpdateRecord: false,
        DisplayControl: "EditTextControl",
        InputMask: "",
        PropertyLabel: toPropertyLabel(key),
        NullNotAllowed: false,
    }));

    const row: Record<string, unknown> = {
        EntID: String(record.cid ?? record.bid ?? record.EntID ?? ""),
        EntityName: entityName,
        LastUpdated: String(record.dateUpdated ?? new Date().toISOString()),
    };
    for (const key of keys) {
        row[key] = toFormValue(record[key]);
    }

    const entityTables: Record<string, unknown>[] = [
        {
            entityName,
            tableName,
            tableLabel,
            isOneToManyRelation: false,
            sortOrder: 1,
            properties: JSON.stringify(properties),
            entityPgClass: true,
            description: `${tableLabel} properties`,
            isRequired: false,
            requiredToAddRecord: false,
            requiredToUpdateRecord: false,
        },
    ];

    const kebabMenuData: IDataset = {
        [tableName]: [row],
    };

    return { entityTables, kebabMenuData };
};

const resolveBusinessFallback = (node: ITreeNode, entId: string): Record<string, unknown> => ({
    bid: entId,
    bname: String(node.Name ?? node.bname ?? ""),
    btype: String(node.Type ?? node.btype ?? ""),
    status: String(node.Description ?? node.status ?? ""),
    verified: Boolean(node.IsAuthorized ?? node.verified ?? false),
    salesExec: String(node.salesExec ?? ""),
    country: String(node.country ?? ""),
    state: String(node.state ?? ""),
    daysNoticePeriod: Number(node.daysNoticePeriod ?? 0),
    mmFinYear: Number(node.mmFinYear ?? 0),
    relatedBids: String(node.relatedBids ?? ""),
    dateCreated: String(node.dateCreated ?? ""),
    dateUpdated: String(node.dateUpdated ?? ""),
});

const resolveContactFallback = (node: ITreeNode, entId: string): Record<string, unknown> => ({
    bid: String(node.bid ?? node.parentEntID ?? ""),
    cid: entId,
    ctype: String(node.Type ?? node.ctype ?? "contact"),
    status: String(node.Description ?? node.status ?? ""),
    verified: Boolean(node.IsAuthorized ?? node.verified ?? false),
    contact: String(node.Name ?? node.contact ?? ""),
    email: String(node.email ?? ""),
    phone1: String(node.phone1 ?? ""),
    phone2: String(node.phone2 ?? ""),
    address_street: String(node.address_street ?? ""),
    address_city: String(node.address_city ?? ""),
    address_state: String(node.address_state ?? ""),
    address_zip: String(node.address_zip ?? ""),
    address_country: String(node.address_country ?? ""),
    dateCreated: String(node.dateCreated ?? ""),
    dateUpdated: String(node.dateUpdated ?? ""),
});

/** Resolves a flat property record from the selected tree node (Business / Contact sample JSON). */
const resolvePropertyRecordFromSelectedNode = (
    node: ITreeNode
): Record<string, unknown> => {
    const entityName = String(node.NodeEntityname || node.NodeType || "").toLowerCase();
    const entId = String(node.NodeEntID || node.EntID || node.key || "");

    if (entityName === "business") {
        const business: IBusiness | undefined = sampleBusinesses.find(
            (item) => item.bid === entId
        );
        if (business) {
            return { ...business };
        }
        return resolveBusinessFallback(node, entId);
    }

    if (entityName === "contact") {
        const contact: IContact | undefined = sampleContacts.find(
            (item) => item.cid === entId
        );
        if (contact) {
            return { ...contact };
        }
        return resolveContactFallback(node, entId);
    }

    return resolveBusinessFallback(node, entId);
};

/**
 * Builds static EditTextControl property form package for the selected node.
 */
const buildPropertyFormDataFromSelectedNode = (
    node: ITreeNode
): IPropertyFormPackage => {
    const entityName = String(node.NodeEntityname || node.NodeType || "Business");
    const record = resolvePropertyRecordFromSelectedNode(node);
    return buildEditTextPropertyFormFromRecord(record, {
        entityName,
        tableName: `_${entityName}`,
        tableLabel: entityName,
    });
};

export {
    samplePropertyEntityTables,
    samplePropertyKebabMenuResponse,
    sampleBusinessPropertyKebabMenuResponse,
    sampleContactPropertyKebabMenuResponse,
    samplePropertyKebabMenuData,
    buildEditTextPropertyFormFromRecord,
    buildPropertyFormDataFromSelectedNode,
    resolvePropertyRecordFromSelectedNode,
};
export type { IPropertyFormPackage };
