import type { IReportProfileItem } from "../../../component/shared/context/allinterface/IReport";
import apiProfileSample from "./ApiProfile.json";
import { sampleReportConfig } from "./ReportConfig";
import { selectedNode, sessionList } from "./sampleDataForReportProps";

/** Pulls `_ApiProfile` records from static ApiProfile.json. */
const sampleApiProfiles: unknown[] = (() => {
    const dataset = (
        apiProfileSample as {
            EntityData?: { Dataset?: { _ApiProfile?: unknown[] } }[];
        }
    )?.EntityData?.[0]?.Dataset?._ApiProfile;
    return Array.isArray(dataset) ? dataset : [];
})();

/**
 * SAMPLE DATA: report cards for AppQA Report list.
 * Opening any PDF card uses `sampleReportConfig` from ReportConfig.ts.
 */
const sampleReportProfiles: IReportProfileItem[] = [
    {
        _ReportProfile: "Device Portrait Layout",
        Name: "Device Portrait Layout",
        Description: "Static portrait layout from sampledata/appqa/report/ReportConfig.ts",
        EntityNames: "__UPS",
        EntityName: "ReportProfile",
        EntID: "RPT-DEVICE-PORTRAIT-001",
        GroupName: "Assets",
        Enable: true,
        Enabled: true,
        LastUpdated: "2026-07-22T06:36:00",
        TemplateFileName: "ReportConfig.ts",
        OutputFormat: "pdf",
        IsTemplate: false,
        IsDeprecated: false,
    },
    {
        _ReportProfile: "DC Inventory",
        Name: "DC Inventory",
        Description: "Same sample layout filtered under Selected Feature (MenuName DC).",
        EntityNames: "",
        EntityName: "ReportProfile",
        EntID: "RPT-DC-INVENTORY-001",
        GroupName: "DC",
        Enable: true,
        Enabled: true,
        LastUpdated: "2026-07-18T14:30:00",
        TemplateFileName: "ReportConfig.ts",
        OutputFormat: "pdf",
        IsTemplate: false,
        IsDeprecated: false,
    },
    {
        _ReportProfile: "Global Audit",
        Name: "Global Audit",
        Description: "All-filter report using the same ReportConfig layout.",
        EntityNames: "",
        EntityName: "ReportProfile",
        EntID: "RPT-GLOBAL-AUDIT-001",
        GroupName: "",
        Enable: true,
        Enabled: true,
        LastUpdated: "2026-07-15T09:00:00",
        TemplateFileName: "ReportConfig.ts",
        OutputFormat: "pdf",
        IsTemplate: false,
        IsDeprecated: false,
    },
    {
        _ReportProfile: "Notes Table Export",
        Name: "Notes Table Export",
        Description: "Excel export shaped from ReportConfig datatable JsonApi payload.",
        EntityNames: "__UPS",
        EntityName: "ReportProfile",
        EntID: "RPT-NOTES-EXPORT-001",
        GroupName: "Assets",
        Enable: true,
        Enabled: true,
        LastUpdated: "2026-07-22T16:45:00",
        TemplateFileName: "ReportConfig.ts",
        OutputFormat: "excel",
        IsTemplate: false,
        IsDeprecated: false,
    },
    {
        _ReportProfile: "Disabled Report",
        Name: "Disabled Report",
        Description: "Should not appear in the enabled list.",
        EntityNames: "__UPS",
        EntityName: "ReportProfile",
        EntID: "RPT-DISABLED-001",
        GroupName: "Assets",
        Enable: false,
        Enabled: false,
        LastUpdated: "2026-06-01T08:00:00",
        TemplateFileName: "Disabled.json",
        OutputFormat: "pdf",
        IsTemplate: false,
        IsDeprecated: true,
    },
];

/** Layout JSON opened on PDF click — from ReportConfig.ts. */
const sampleReportLayoutJson: Record<string, unknown> = sampleReportConfig as Record<
    string,
    unknown
>;

/**
 * SAMPLE DATA: Excel sheets derived from ReportConfig datatable (pg.notes / site).
 * Replaces live JsonApi responses for static export.
 */
const sampleReportDatatableResponses: Record<string, unknown>[] = [
    {
        NotesSheet: {
            site: [
                {
                    ColumnList: [
                        { PName: "NoteTitle", PropertyLabel: "Title" },
                        { PName: "NoteType", PropertyLabel: "Type" },
                        { PName: "CreatedBy", PropertyLabel: "Created By" },
                        { PName: "LastUpdated", PropertyLabel: "Last Updated" },
                    ],
                    Dataset: [
                        {
                            NoteTitle: "UPS inspection",
                            NoteType: "Maintenance",
                            CreatedBy: "Admin",
                            LastUpdated: "2026-07-22",
                        },
                        {
                            NoteTitle: "Battery check",
                            NoteType: "Ops",
                            CreatedBy: "ops.oncall",
                            LastUpdated: "2026-07-20",
                        },
                        {
                            NoteTitle: "COLO-UPS-1 capacity note",
                            NoteType: "Capacity",
                            CreatedBy: "demo.user",
                            LastUpdated: "2026-07-18",
                        },
                    ],
                },
            ],
        },
    },
];

const sampleReportSelectedNodeEntity =
    selectedNode.NodeEntityname ?? "__UPS";

const sampleReportSessionVars: Record<string, string> = Object.fromEntries(
    sessionList
        .filter((item) => item.VariableName)
        .map((item) => [item.VariableName, String(item.SessionValue ?? "")])
);

export {
    sampleApiProfiles,
    sampleReportProfiles,
    sampleReportLayoutJson,
    sampleReportDatatableResponses,
    sampleReportSelectedNodeEntity,
    sampleReportSessionVars,
    sampleReportConfig,
    selectedNode as sampleReportSelectedNode,
    sessionList as sampleReportSessionList,
};
