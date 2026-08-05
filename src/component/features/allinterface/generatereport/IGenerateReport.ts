
type TReportTableRow = Record<string, unknown>;
type TReportDataset = Record<string, TReportTableRow[]>;

interface IGenerateReport {
    uniqueName?: string;
    /* Required report layout from public/reportTemplate.json */
    reportTemplate: Record<string, unknown>;
    /* Static tables keyed by datatable `id`. */
    dataset?: TReportDataset;
}

export type { TReportTableRow, TReportDataset, IGenerateReport };
