import type { IAppqaAlertFilterValues } from "../../component/appqa/allinterface/IAppqaAlerts";
import { sampleAlertLogs } from "../sidebar/AlertlogSampleData";
import {
    sampleForensicLogSites,
    sampleForensicLogTenantUsers,
} from "../sidebar/ForensicLogSampleData";
import { sampleNotifyUsersRaw } from "./NotifySampleData";

/** API-shaped alert queue row (ALERT.GetFilteredLogs Dataset item). */
interface IAppqaAlertRawRecord {
    Severity: string;
    IsClosed: boolean;
    AlertQueueName: string;
    AssignedTo: string;
    AttemptCount: number;
    LastDelivered: string;
    AlertProfileName: string;
    HTML: string;
    EntityName: string;
    EntID: string;
    AlertEntityName: string;
    AlertEntID: string;
    FileUID?: string;
    FileType?: string;
    UsersToNotifyJson?: string;
    MessageSource?: string;
    AlertProfileID?: string;
    EscalationLevel?: number;
    RecID?: string;
    SiteName?: string;
    TenantName?: string;
}

const toIsoDayOffset = (dayOffset: number, hour = 10): string => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString();
};

const normalizeText = (value: unknown): string => String(value ?? "").trim();
const normalizeCompare = (value: unknown): string =>
    normalizeText(value).toLowerCase();

const parseFilterCalendarDay = (value: unknown): number | null => {
    const text = normalizeText(value);
    if (!text) {
        return null;
    }

    const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (slash) {
        const first = Number(slash[1]);
        const second = Number(slash[2]);
        const year = Number(slash[3]);
        // App format may be MM/dd or dd/MM — prefer US when first > 12.
        if (first > 12) {
            return Date.UTC(year, second - 1, first);
        }
        return Date.UTC(year, first - 1, second);
    }

    const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) {
        return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    }

    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    return Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

/** Convert sidebar IAlertLogRecord samples into GetFilteredLogs raw shape. */
const fromAlertLogSamples = (): IAppqaAlertRawRecord[] =>
    sampleAlertLogs.map((record, index) => ({
        Severity: String(record.AlertSeverity ?? "Normal"),
        IsClosed: Boolean(record.IsClosed),
        AlertQueueName: String(record._AlertQueue ?? ""),
        AssignedTo: String(record.AssignedTo ?? ""),
        AttemptCount: Number(record.AttemptCount ?? 0),
        LastDelivered: toIsoDayOffset(-(index % 5), 9 + (index % 8)),
        AlertProfileName: String(record.AlertProfileName ?? ""),
        HTML: String(record.HTML ?? ""),
        EntityName: String(record.EntityName ?? ""),
        EntID: String(record.EntId ?? `ENT-${index}`),
        AlertEntityName: String(record.AlertEntityName ?? ""),
        AlertEntID: String(record.AlertEntID ?? ""),
        FileUID: record.FileUID,
        FileType: record.FileType,
        UsersToNotifyJson: record.UsersToNotifyJson,
        MessageSource: "Sample",
        AlertProfileID: String(record.AlertID ?? ""),
        EscalationLevel: 0,
        RecID: String(record.AlertID ?? ""),
        SiteName: index % 2 === 0 ? "Chicago" : "Chicago",
        TenantName: "NetZoom",
    }));

/**
 * Extra rows tuned for default AppQA filters:
 * Critical + Open + AssignedTo Admin + Site Chicago + today→tomorrow.
 */
const sampleAppqaAlertExtras: IAppqaAlertRawRecord[] = [
    {
        Severity: "Critical",
        IsClosed: false,
        AlertQueueName: "OpsQueue",
        AssignedTo: "Admin",
        AttemptCount: 1,
        LastDelivered: toIsoDayOffset(0, 8),
        AlertProfileName: "UPS Capacity Critical",
        HTML: "<p>COLO-UPS-1 capacity below threshold at Chicago.</p>",
        EntityName: "Device",
        EntID: "ALERT-UPS-001",
        AlertEntityName: "DeviceAlert",
        AlertEntID: "ALERT-UPS-001",
        MessageSource: "Sample",
        AlertProfileID: "AP-UPS-001",
        EscalationLevel: 1,
        RecID: "REC-UPS-001",
        SiteName: "Chicago",
        TenantName: "NetZoom",
    },
    {
        Severity: "Critical",
        IsClosed: false,
        AlertQueueName: "OpsQueue",
        AssignedTo: "Admin",
        AttemptCount: 2,
        LastDelivered: toIsoDayOffset(0, 11),
        AlertProfileName: "Site Power Failure",
        HTML: "<p>Power failure detected for Chicago site.</p>",
        EntityName: "Site",
        EntID: "ALERT-SITE-002",
        AlertEntityName: "SiteAlert",
        AlertEntID: "ALERT-SITE-002",
        MessageSource: "Sample",
        AlertProfileID: "AP-SITE-002",
        EscalationLevel: 2,
        RecID: "REC-SITE-002",
        SiteName: "Chicago",
        TenantName: "NetZoom",
    },
    {
        Severity: "Warning",
        IsClosed: false,
        AlertQueueName: "IoTQueue",
        AssignedTo: "Admin",
        AttemptCount: 1,
        LastDelivered: toIsoDayOffset(0, 14),
        AlertProfileName: "Sensor Drift",
        HTML: "<p>Temperature sensor drift warning.</p>",
        EntityName: "Device",
        EntID: "ALERT-SENS-003",
        AlertEntityName: "DeviceAlert",
        AlertEntID: "ALERT-SENS-003",
        MessageSource: "Sample",
        AlertProfileID: "AP-SENS-003",
        EscalationLevel: 0,
        RecID: "REC-SENS-003",
        SiteName: "Chicago",
        TenantName: "NetZoom",
    },
    {
        Severity: "Critical",
        IsClosed: true,
        AlertQueueName: "OpsQueue",
        AssignedTo: "Admin",
        AttemptCount: 3,
        LastDelivered: toIsoDayOffset(-1, 16),
        AlertProfileName: "Resolved Outage",
        HTML: "<p>Previous critical outage closed.</p>",
        EntityName: "Site",
        EntID: "ALERT-CLOSED-004",
        AlertEntityName: "SiteAlert",
        AlertEntID: "ALERT-CLOSED-004",
        MessageSource: "Sample",
        AlertProfileID: "AP-CLOSED-004",
        EscalationLevel: 1,
        RecID: "REC-CLOSED-004",
        SiteName: "Chicago",
        TenantName: "NetZoom",
    },
    {
        Severity: "Critical",
        IsClosed: false,
        AlertQueueName: "SupportQueue",
        AssignedTo: "demo.user",
        AttemptCount: 1,
        LastDelivered: toIsoDayOffset(0, 9),
        AlertProfileName: "Ticket Escalation",
        HTML: "<p>Critical ticket assigned to demo.user.</p>",
        EntityName: "Case",
        EntID: "ALERT-CASE-005",
        AlertEntityName: "CaseAlert",
        AlertEntID: "ALERT-CASE-005",
        MessageSource: "Sample",
        AlertProfileID: "AP-CASE-005",
        EscalationLevel: 1,
        RecID: "REC-CASE-005",
        SiteName: "Chicago",
        TenantName: "NetZoom",
    },
];

/** SAMPLE DATA: replaces ALERT.GetFilteredLogs Dataset. */
const sampleAppqaAlertRawRecords: IAppqaAlertRawRecord[] = [
    ...sampleAppqaAlertExtras,
    ...fromAlertLogSamples().map((row) => ({
        ...row,
        AssignedTo:
            row.Severity === "Critical" && !row.IsClosed
                ? row.AssignedTo || "Admin"
                : row.AssignedTo,
    })),
];

const matchesKeywords = (
    record: IAppqaAlertRawRecord,
    keywords: string,
    andOr: string
): boolean => {
    const terms = keywords
        .split(/\s+/)
        .map((term) => term.trim().toLowerCase())
        .filter(Boolean);
    if (!terms.length) {
        return true;
    }

    const haystack = [
        record.HTML,
        record.AlertProfileName,
        record.EntityName,
        record.AssignedTo,
        record.AlertQueueName,
        record.SiteName,
        record.TenantName,
    ]
        .join(" ")
        .toLowerCase();

    const isOr = normalizeCompare(andOr) === "or";
    return isOr
        ? terms.some((term) => haystack.includes(term))
        : terms.every((term) => haystack.includes(term));
};

/** Client-side stand-in for ALERT.GetFilteredLogs filterJsonString rules. */
const filterAppqaAlertRecords = (
    records: IAppqaAlertRawRecord[],
    filters: IAppqaAlertFilterValues
): IAppqaAlertRawRecord[] => {
    const severity = normalizeCompare(filters.Severity);
    const status = normalizeCompare(filters.Status);
    const assignedTo = normalizeCompare(filters.AssignedTo);
    const siteName = normalizeCompare(filters.SiteName);
    const tenantName = normalizeCompare(filters.TenantName);
    const startDay = parseFilterCalendarDay(filters.StartDate);
    const endDay = parseFilterCalendarDay(filters.EndDate);

    return records.filter((record) => {
        if (severity && severity !== "all") {
            if (normalizeCompare(record.Severity) !== severity) {
                return false;
            }
        }

        if (status && status !== "all") {
            if (status === "open" && record.IsClosed) {
                return false;
            }
            if (
                (status === "close" || status === "closed")
                && !record.IsClosed
            ) {
                return false;
            }
        }

        if (assignedTo && assignedTo !== "all") {
            if (normalizeCompare(record.AssignedTo) !== assignedTo) {
                return false;
            }
        }

        if (siteName && siteName !== "all") {
            if (normalizeCompare(record.SiteName) !== siteName) {
                return false;
            }
        }

        if (tenantName && tenantName !== "all") {
            if (normalizeCompare(record.TenantName) !== tenantName) {
                return false;
            }
        }

        const deliveredDay = parseFilterCalendarDay(record.LastDelivered);
        if (startDay != null && deliveredDay != null && deliveredDay < startDay) {
            return false;
        }
        if (endDay != null && deliveredDay != null && deliveredDay > endDay) {
            return false;
        }

        if (!matchesKeywords(record, filters.Keywords, filters.AndOR)) {
            return false;
        }

        return true;
    });
};

export type { IAppqaAlertRawRecord };
export {
    sampleAppqaAlertRawRecords,
    filterAppqaAlertRecords,
    sampleForensicLogSites,
    sampleForensicLogTenantUsers,
    sampleNotifyUsersRaw,
};
