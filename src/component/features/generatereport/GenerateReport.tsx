import { useCallback, useEffect, useMemo, useState } from "react";
import { PdfMaker, updateLayoutWithSessionVars } from "@n20a/libreport";
import "@n20a/libreport/style.css";
import { JsonViewer } from "../../shared/jsonviewer/JsonViewer";
import { useSessionContext } from "../../shared/context/hooks/SessionHooks";
import dataset from "../../../sampledata/genaretreport/dataset";
import { IGenerateReport, TReportDataset } from "../allinterface/generatereport/IGenerateReport";

/*
 * Walks report layout and fills each datatable's `tableData` when
 * `datatable.name` matches a key in the static dataset.
 */
const injectStaticTableData = (
    node: Record<string, unknown>,
    tables: TReportDataset
): Record<string, unknown> => {
    const updated = { ...node };
    try {
        if (Array.isArray(updated.datatableArray)) {
            updated.datatableArray = (updated.datatableArray as Record<string, unknown>[]).map(
                (dt) => {
                    const tableName = typeof dt?.name === "string" ? dt.name : "";
                    const rows = tableName ? tables[tableName] : undefined;
                    if (!rows) return dt;
                    return {
                        ...dt,
                        tableData: rows,
                        inmemoryUrl: "",
                    };
                }
            );
        }

        if (Array.isArray(updated.locationArray)) {
            updated.locationArray = (updated.locationArray as Record<string, unknown>[]).map(
                (loc) => injectStaticTableData(loc, tables)
            );
        }

        return updated;
    } catch (error) {
        console.error("injectStaticTableData error:", error);
        return updated;
    }
};

const GenerateReport = (props: IGenerateReport) => {
    const uniqueName = props.uniqueName ?? "generate-report";
    const tables = props.dataset ?? (dataset as TReportDataset);

    const sessionContext = useSessionContext();
    const [reportJson, setReportJson] = useState<Record<string, unknown> | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getSessionVars = useCallback((): Record<string, unknown> => {
        const sessionVars: Record<string, unknown> = {};
        sessionContext?.SessionList?.forEach((item) => {
            if (item.VariableName && item.SessionValue !== undefined) {
                sessionVars[item.VariableName] = item.SessionValue;
            }
        });
        return sessionVars;
    }, [sessionContext?.SessionList]);

    /*
     * Builds updated report JSON from required template + static dataset.
     * Matches datatable `name` to dataset keys and writes rows into `tableData`.
     */
    const FnBuildReportLayoutConfig = useCallback(
        (
            reportTemplate: Record<string, unknown>,
            tableDataset: TReportDataset = tables
        ): Record<string, unknown> => {
            try {
                if (!reportTemplate || typeof reportTemplate !== "object") {
                    return {};
                }
                return injectStaticTableData(
                    structuredClone(reportTemplate),
                    tableDataset
                );
            } catch (error) {
                console.error("FnBuildReportLayoutConfig error:", error);
                return reportTemplate;
            }
        },
        [tables]
    );

    useEffect(() => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const updated = FnBuildReportLayoutConfig(props.reportTemplate, tables);
            setReportJson(updated);
        } catch (error) {
            console.error("GenerateReport: failed to build report", error);
            setReportJson(null);
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to build report"
            );
        } finally {
            setIsLoading(false);
        }
    }, [FnBuildReportLayoutConfig, props.reportTemplate, tables]);

    const pdfConfig = useMemo(() => {
        if (!reportJson) return null;
        try {
            return updateLayoutWithSessionVars(reportJson as any, getSessionVars);
        } catch (error) {
            console.error("GenerateReport: updateLayoutWithSessionVars failed", error);
            return reportJson;
        }
    }, [getSessionVars, reportJson]);

    return (
        <div className="nz-wh-100 nz-d-flex-column" style={{ gap: 12, padding: 12 }}>
            <h3 style={{ margin: 0 }}>Generate Report</h3>

            {isLoading && <div>Building report…</div>}
            {errorMessage && (
                <div style={{ color: "var(--error-color, #b00020)" }}>{errorMessage}</div>
            )}

            {reportJson && (
                <>
                    <JsonViewer
                        uniqueName={`${uniqueName}-json`}
                        jsonData={reportJson}
                        showAsDiv={true}
                    />
                    {pdfConfig && (
                        <PdfMaker
                            config={pdfConfig as any}
                            autoGenerate={false}
                            onSuccess={() => { }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export { GenerateReport };
export type { IGenerateReport, TReportDataset };
