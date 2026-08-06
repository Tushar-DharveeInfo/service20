import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import * as XLSX from "xlsx";
import { PdfMaker, updateLayoutWithSessionVars } from "@n20a/libreport";
import "./allcss/AppqaReport.css";
import "@n20a/libreport/style.css";
import { Close24x24, Report24x24, Save24x24 } from "@n20a/libicon";
import { FnGetCssVariable } from "../appcontainer/allcommon/FnGetCssVariable";
import {
    FnActivateOptionForReport,
    FnCreateFiltersForReport,
} from "./allcommon/FnCreateFiltersForReport";
import { IAppqaReport } from "./allinterface/IAppqaReport";
import { IReportProfileItem } from "../shared/context/allinterface/IReport";
import { ActionImage } from "../shared/basic/actionimage/ActionImage";
import { Label } from "../shared/basic/label/Label";
import { JsonViewer } from "../shared/jsonviewer/JsonViewer";
import { OptionsFilter } from "../shared/basic/optionsfilter/OptionsFilter";
import { YesNoFormContainer } from "../shared/basic/yesnoformcontainer/YesNoFormContainer";
import { OverlayTab } from "../shared/basic/overlaytab/OverlayTab";
import { IOptionItem } from "../shared/allinterface/basic/IOptionsFilter";
import { CardLayout } from "../shared/cardlayout/CardLayout";
import { ICardLayoutField } from "../shared/allinterface/cardlayout/ICardLayout";
import { FnFormatDateWithAppFormat } from "../appcontainer/allcommon/FnFormatDateWithAppFormat";
import {
    sampleReportDatatableResponses,
    sampleReportLayoutJson,
    sampleReportProfiles,
    sampleReportSelectedNodeEntity,
    sampleReportSessionVars,
} from "../../sampledata/appqa/report/ReportSampleData";

const REPORT_PROFILE_KEY = "_ReportProfile";

const mapToReportProfileItem = (
    data: Record<string, unknown>
): IReportProfileItem => {
    try {
        if (!data || typeof data !== "object") {
            return {
                _ReportProfile: "",
                Description: "",
                EntityNames: "",
            } as IReportProfileItem;
        }
        return {
            _ReportProfile: String(data.Name ?? data._ReportProfile ?? ""),
            Description: String(data.Description ?? ""),
            EntityNames: String(data.EntityNames ?? ""),
            ...Object.fromEntries(
                Object.entries(data).filter(
                    ([key]) =>
                        !["_ReportProfile", "Description", "EntityNames"].includes(key)
                )
            ),
        };
    } catch (error) {
        console.error("Error in mapToReportProfileItem:", error);
        return {
            _ReportProfile: "",
            Description: "",
            EntityNames: "",
        } as IReportProfileItem;
    }
};

const buildReportCardFields = (
    report: IReportProfileItem
): ICardLayoutField[] => {
    const fields: ICardLayoutField[] = [
        {
            Name: "Report",
            Value: `${report._ReportProfile || "—"}`,
            Header: 1,
            Group: "header",
        },
    ];
    if (report.LastUpdated) {
        fields.push({
            Name: "Last Updated",
            Value: FnFormatDateWithAppFormat(String(report.LastUpdated), true),
            Header: 3,
            Row: "inline",
            Group: "header",
        });
    }
    if (report.Description) {
        fields.push({ Name: "Description", Value: String(report.Description) });
    }
    if (report.TemplateFileName) {
        fields.push({
            Name: "Template",
            Value: String(report.TemplateFileName),
        });
    }
    return fields;
};

const isReportEnabled = (report: IReportProfileItem): boolean => {
    const enableValue = report.Enable ?? report.Enabled;
    return (
        enableValue === true
        || enableValue === 1
        || enableValue === "1"
        || enableValue === "true"
    );
};

const sortReportsAZ = (reports: IReportProfileItem[]): IReportProfileItem[] =>
    [...reports].sort((a, b) =>
        String(a._ReportProfile ?? "").localeCompare(
            String(b._ReportProfile ?? ""),
            undefined,
            { sensitivity: "base" }
        )
    );

const dedupeReports = (reports: IReportProfileItem[]): IReportProfileItem[] =>
    reports.filter(
        (item, index, self) =>
            index
            === self.findIndex(
                (t) => t[REPORT_PROFILE_KEY] === item[REPORT_PROFILE_KEY]
            )
    );

const normalizeLayoutNode = (
    node: Record<string, unknown>
): Record<string, unknown> => {
    const safeNode = { ...node };
    if ((safeNode.NodeType as string)?.toLowerCase() === "layout") {
        if (Array.isArray(safeNode.header)) {
            safeNode.header = Object.assign({}, ...safeNode.header);
        }
        if (Array.isArray(safeNode.footer)) {
            safeNode.footer = Object.assign({}, ...safeNode.footer);
        }
        if (Array.isArray(safeNode.page)) {
            safeNode.page = Object.assign({}, ...safeNode.page);
        }
    }
    return safeNode;
};

const AppqaReport = (appqaReportProps: IAppqaReport) => {
    const [reportData, setReportData] = useState<IReportProfileItem[]>([]);
    const [selectedReportId, setSelectedReportId] = useState<string>("");
    const [reportDataOriginal, setReportDataOriginal] = useState<
        IReportProfileItem[]
    >([]);
    const [filterValue, setFilterValue] = useState<IOptionItem[]>([]);
    const [reportHeader, setReportHeader] = useState<string>("Available Reports");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [dialogContent, setDialogContent] = useState<
        Record<string, unknown> | undefined
    >();
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [confirmMessage, setConfirmMessage] = useState<string>("");
    const [diagnosticLevel] = useState<number>(1);
    const [selectedFilter, setSelectedFilter] = useState<string>();
    const [isDataProcessed, setIsDataProcessed] = useState(false);
    const [isLoadingReports, setIsLoadingReports] = useState(true);

    const getSessionVars = (): Record<string, unknown> => ({
        ...sampleReportSessionVars,
    });

    const getFeatureName = () => sampleReportSessionVars.FeatureName ?? "";
    const getMenuName = () => sampleReportSessionVars.MenuName ?? "";
    const getNodeEntityName = () => sampleReportSelectedNodeEntity;

    useEffect(() => {
        return () => {
            setReportData([]);
            setFilterValue([]);
        };
    }, []);

    useEffect(() => {
        // SAMPLE DATA: replaces ALERT.GetAlertProfiles + reportContext cascade.
        // axiosInterceptor({ url: ALERT.GetAlertProfiles, entityName: ReportProfile, ... });
        if (!appqaReportProps.featureId) {
            setIsLoadingReports(false);
            setIsDataProcessed(true);
            setReportData([]);
            return;
        }

        setIsLoadingReports(true);
        try {
            const reportProfiles = sampleReportProfiles.map((item) =>
                mapToReportProfileItem(item as Record<string, unknown>)
            );
            let options = FnCreateFiltersForReport();
            let filteredReport: IReportProfileItem[] = [];
            const enabledReportProfiles = reportProfiles.filter(isReportEnabled);

            const nodeEntityName = getNodeEntityName();
            if (nodeEntityName?.length) {
                filteredReport = enabledReportProfiles.filter((item) =>
                    item.EntityNames?.includes(nodeEntityName)
                );
                if (filteredReport.length) {
                    options = FnActivateOptionForReport(options, "Selected Node");
                    setSelectedFilter("Selected Node");
                    setReportHeader(`Available Reports for: ${nodeEntityName}`);
                }
            }

            if (!filteredReport.length) {
                const featureName = getFeatureName();
                if (featureName?.length) {
                    filteredReport = enabledReportProfiles.filter((item) =>
                        item.GroupName?.includes(featureName)
                    );
                    if (filteredReport.length) {
                        options = FnActivateOptionForReport(
                            options,
                            "Selected Feature"
                        );
                        setSelectedFilter("Selected Feature");
                        setReportHeader(`Available Reports for: ${featureName}`);
                    }
                }
            }

            if (!filteredReport.length) {
                const menuName = getMenuName();
                if (menuName?.length) {
                    filteredReport = enabledReportProfiles.filter((item) =>
                        item.GroupName?.includes(menuName)
                    );
                    if (filteredReport.length) {
                        options = FnActivateOptionForReport(
                            options,
                            "Selected Feature"
                        );
                        setSelectedFilter("Selected Feature");
                        setReportHeader(`Available Reports for: ${menuName}`);
                    }
                }
            }

            if (!filteredReport.length) {
                filteredReport = enabledReportProfiles.filter(
                    (item) => !item.EntityNames
                );
                options = FnActivateOptionForReport(options, "All");
                setSelectedFilter("All");
                setReportHeader("Available Reports");
            }

            const sortedData = sortReportsAZ(dedupeReports(filteredReport));
            setFilterValue(options);
            setReportData(sortedData);
            setReportDataOriginal(enabledReportProfiles);
            setIsDataProcessed(true);
        } catch (error) {
            console.error("Error loading sample reports:", error);
            setReportData([]);
            setFilterValue(FnCreateFiltersForReport());
            setIsDataProcessed(true);
            appqaReportProps.handleShowUserMessage?.(
                "Failed to load sample reports."
            );
        } finally {
            setIsLoadingReports(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- mount / featureId static load
    }, [appqaReportProps.featureId]);

    function evaluateFormulaSafe(
        formula: string,
        context: Record<string, unknown>
    ): string {
        try {
            const fn = new Function(...Object.keys(context), `return (${formula});`);
            const result = fn(...Object.values(context));
            return String(result);
        } catch (err) {
            console.warn("Formula error:", formula, err);
            return "#ERR";
        }
    }

    async function traverseAndEvaluateLabelsSafe(
        node: unknown,
        _apiProfiles?: unknown[],
        context: Record<string, unknown> = {}
    ): Promise<unknown> {
        try {
            if (typeof node !== "object" || node === null) return node;
            const safeNode: Record<string, unknown> = {
                ...(node as Record<string, unknown>),
            };
            try {
                if (
                    typeof safeNode.label === "string"
                    && safeNode.label.trim().startsWith("=")
                ) {
                    const formula = safeNode.label.trim().substring(1);
                    safeNode.label = evaluateFormulaSafe(formula, context);
                }
            } catch (labelError) {
                console.warn("Error evaluating label:", labelError);
            }
            for (const key in safeNode) {
                try {
                    const value = safeNode[key];
                    if (key === "EntID") {
                        safeNode.id = safeNode.EntID;
                        delete safeNode.EntID;
                    }
                    if (key === "Name") {
                        safeNode.name = safeNode.Name;
                        delete safeNode.Name;
                    }
                    if (key === "w" || key === "h" || key === "px" || key === "py") {
                        const num = Number(value);
                        safeNode[key] = Number.isNaN(num) ? 0 : num;
                    } else if (
                        Array.isArray(value)
                        && value.every((v) => typeof v === "object" && v !== null)
                    ) {
                        safeNode[key] = await Promise.all(
                            value.map((v) =>
                                traverseAndEvaluateLabelsSafe(v, _apiProfiles, context)
                            )
                        );
                    }
                } catch (keyError) {
                    console.warn(`Error processing key: ${key}`, keyError);
                }
            }
            return safeNode;
        } catch (error) {
            console.error("Error in traverseAndEvaluateLabelsSafe:", error);
            return node;
        }
    }

    function exportMultipleDatatablesToExcel(
        dataArray: Record<string, unknown>[],
        fileName: string = "Report.xlsx"
    ): void {
        if (!Array.isArray(dataArray) || dataArray.length === 0) return;
        try {
            const workbook = XLSX?.utils?.book_new();
            if (!workbook) {
                console.error("Failed to create workbook");
                return;
            }
            dataArray.forEach((tableObj, index) => {
                try {
                    if (!tableObj || typeof tableObj !== "object") return;
                    const tableKey = Object.keys(tableObj)[0];
                    const tableData = tableObj[tableKey] as Record<string, unknown>;
                    if (!tableData || typeof tableData !== "object") return;
                    const entityKey = Object.keys(tableData)[0];
                    const entityRows = tableData[entityKey] as
                        | Record<string, unknown>[]
                        | undefined;
                    const entityData = entityRows?.[0] as
                        | {
                            ColumnList?: Record<string, unknown>[];
                            Dataset?: Record<string, unknown>[];
                        }
                        | undefined;
                    if (!entityData?.ColumnList || !entityData?.Dataset) return;
                    const { ColumnList, Dataset } = entityData;
                    const headers = ColumnList.map((col) => {
                        try {
                            return (
                                String(col?.PropertyLabel ?? "").trim()
                                || String(col?.PName ?? "")
                            );
                        } catch {
                            return String(col?.PName ?? "");
                        }
                    });
                    const rows = Dataset.map((row) => {
                        try {
                            return ColumnList.map(
                                (col) => row?.[String(col?.PName)] ?? ""
                            );
                        } catch {
                            return [];
                        }
                    });
                    const sheetData = [headers, ...rows];
                    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
                    const sheetName = (tableKey || `Sheet${index + 1}`).substring(0, 31);
                    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                } catch (sheetError) {
                    console.error(
                        `Error processing table at index ${index}:`,
                        sheetError
                    );
                }
            });
            try {
                XLSX.writeFile(workbook, fileName);
            } catch (writeError) {
                console.error("Error writing Excel file:", writeError);
            }
        } catch (error) {
            console.error("Error in exportMultipleDatatablesToExcel:", error);
        }
    }

    const handleClickSaveAsExcel = async (payload?: string) => {
        try {
            if (!payload || typeof payload !== "string") {
                appqaReportProps.handleShowUserMessage?.(
                    "Invalid payload: Must be a JSON string."
                );
                return;
            }
            const selected = JSON.parse(payload) as IReportProfileItem;
            handleClickDownloadPdf(undefined, selected, true);
        } catch (error) {
            console.error("Error in save excel :", error);
            appqaReportProps.handleShowUserMessage?.(
                "Something went wrong in save as Excel"
            );
        }
    };

    const handleClickDownloadPdf = async (
        _event:
            | React.MouseEvent<HTMLDivElement>
            | React.KeyboardEvent<HTMLDivElement>
            | undefined,
        selectedReport: IReportProfileItem,
        ExportExcel?: boolean
    ) => {
        if (!selectedReport || typeof selectedReport !== "object") {
            appqaReportProps.handleShowUserMessage?.(
                "Invalid payload: Must be a JSON "
            );
            return;
        }

        try {
            // SAMPLE DATA: replaces NODE.GetKebabMenuData → FS.GetFileStream → EM.GetEntityRecords.
            // axiosInterceptor({ url: NODE.GetKebabMenuData, ... });
            // axiosInterceptor({ url: FS.GetFileStream, ... });
            // axiosInterceptor({ url: EM.GetEntityRecords, ... });
            // MakeApiCallsForMemoryURL(...);

            if (ExportExcel) {
                exportMultipleDatatablesToExcel(
                    sampleReportDatatableResponses as Record<string, unknown>[],
                    `${selectedReport._ReportProfile || "Report"}.xlsx`
                );
                appqaReportProps.handleShowUserMessage?.(
                    `Excel exported: ${selectedReport._ReportProfile}`
                );
                return;
            }

            const objectData = getSessionVars();
            const updatedJson = await traverseAndEvaluateLabelsSafe(
                structuredClone(sampleReportLayoutJson),
                undefined,
                objectData
            );

            if (typeof updatedJson === "object" && updatedJson !== null) {
                const safeNode = normalizeLayoutNode(
                    updatedJson as Record<string, unknown>
                );
                setDialogContent(safeNode);
                setIsDialogOpen(true);
            }
        } catch (error) {
            console.error("Sample report open error:", error);
            appqaReportProps.handleShowUserMessage?.(
                "Failed to open sample report layout."
            );
        }
    };

    const handleFilterSelect = (option: { uniqueName?: string }) => {
        try {
            if (!option?.uniqueName) return;
            try {
                setFilterValue((prev) =>
                    FnActivateOptionForReport(prev, option.uniqueName!)
                );
            } catch (filterError) {
                console.warn("Error updating filter value:", filterError);
            }
            const filterKey = option.uniqueName.toLowerCase();
            switch (filterKey) {
                case "all":
                    setReportData(
                        sortReportsAZ(
                            reportDataOriginal.filter((item) => !item?.EntityNames)
                        )
                    );
                    setReportHeader("Available Reports");
                    break;
                case "selected node": {
                    const nodeEntityName = getNodeEntityName();
                    setReportData(
                        sortReportsAZ(
                            nodeEntityName
                                ? reportDataOriginal.filter((item) =>
                                    item?.EntityNames?.includes(nodeEntityName)
                                )
                                : []
                        )
                    );
                    setReportHeader(`Available Reports for: ${nodeEntityName}`);
                    break;
                }
                case "selected feature": {
                    const featureName = getFeatureName();
                    const filteredReports = reportDataOriginal.filter((item) =>
                        item?.GroupName?.includes(featureName)
                    );
                    if (filteredReports.length) {
                        setReportData(sortReportsAZ(filteredReports));
                        setReportHeader(`Available Reports: ${featureName}`);
                    } else {
                        const menuName = getMenuName();
                        setReportData(
                            sortReportsAZ(
                                menuName
                                    ? reportDataOriginal.filter((item) =>
                                        item?.GroupName?.includes(menuName)
                                    )
                                    : []
                            )
                        );
                        setReportHeader(`Available Reports: ${menuName}`);
                    }
                    break;
                }
                default:
                    setReportData(sortReportsAZ(reportDataOriginal));
            }
            setSelectedFilter(option.uniqueName);
        } catch (error) {
            console.error("Error in handleFilterSelect:", error);
        }
    };

    function handleClickInformation(): void {
        const handleSaveAs = async () => {
            if (!dialogContent || typeof dialogContent !== "object") {
                console.warn("Invalid dialogContent:", dialogContent);
                return;
            }
            if (!window?.showSaveFilePicker) {
                console.error(
                    "File System Access API not supported in this browser"
                );
                setConfirmMessage("Save not supported in this browser.");
                setIsConfirmOpen(true);
                return;
            }
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: "reportTemplate.json",
                types: [
                    {
                        description: "JSON Files",
                        accept: { "application/json": [".json"] },
                    },
                ],
            });
            const writable = await fileHandle.createWritable();
            try {
                const jsonData = JSON.stringify(dialogContent, null, 2);
                await writable.write(jsonData);
            } catch (writeError) {
                console.error("Error writing file:", writeError);
                throw writeError;
            } finally {
                try {
                    await writable.close();
                } catch (closeError) {
                    console.warn("Error closing file stream:", closeError);
                }
            }
            setConfirmMessage("File saved successfully!");
            setIsConfirmOpen(true);
        };
        try {
            if (dialogContent && typeof dialogContent === "object") {
                void handleSaveAs();
            }
        } catch (error) {
            console.error("Error in handleClickInformation:", error);
        }
    }

    const shouldShowLoading = isLoadingReports || !isDataProcessed;
    const shouldShowNoData = !shouldShowLoading && reportData.length === 0;

    return (
        <div
            key={appqaReportProps.uniqueName}
            className="nz-appqa-report-container"
        >
            <div className="nz-sub-header">
                {filterValue.length > 1 && (
                    <OptionsFilter
                        showIcon={true}
                        uniqueName={"app-qa-filter"}
                        container={"ap-filter"}
                        handleSelect={handleFilterSelect}
                        options={filterValue}
                    />
                )}
                <Label
                    uniqueName={`${appqaReportProps.uniqueName}-task-header`}
                    label={`${reportHeader}${reportData.length ? ` (${reportData.length})` : ""}`}
                />
            </div>
            <div className="nz-appqa-report-content">
                {shouldShowLoading ? (
                    <div className="nz-wh-100 nz-d-flex-hv-left">Loading...</div>
                ) : shouldShowNoData ? (
                    <div className="nz-wh-100 nz-d-flex-hv-left">No Data Found</div>
                ) : (
                    reportData.map((report, index) => (
                        <CardLayout
                            key={String(report.EntID ?? index)}
                            uniqueName={`${appqaReportProps.uniqueName}-report-${index}`}
                            className={`nz-report-card${
                                report.OutputFormat !== "excel"
                                    ? " nz-clickable-report"
                                    : ""
                            } ${report.IsTemplate ? "nz-template-report" : ""} ${
                                report.IsDeprecated ? "nz-deprecated-report" : ""
                            }`}
                            data={report}
                            fields={buildReportCardFields(report)}
                            isSelected={selectedReportId === report.EntID}
                            hideRightMouseMenu={true}
                            onClick={(event) => {
                                if (
                                    (event.target as HTMLElement).closest(
                                        ".nz-excel-icon-wrapper"
                                    )
                                ) {
                                    return;
                                }
                                setSelectedReportId(String(report.EntID ?? ""));
                                handleClickDownloadPdf(event, report);
                            }}
                            ContentImage={{
                                uniqueName: `${appqaReportProps.uniqueName}-reporti-${index}`,
                                source: (
                                    <Report24x24
                                        size={FnGetCssVariable("--image-size-2")}
                                        fill="none"
                                        strokeWidth={1}
                                    />
                                ),
                                w: "var(--image-size-2)",
                                tooltip: report._ReportProfile,
                                type: "svg",
                            }}
                            renderForm={
                                report.OutputFormat === "excel" ? (
                                    <div className="nz-excel-icon-wrapper">
                                        <OverlayTab
                                            uniqueName={`${appqaReportProps.uniqueName}-replacement-overlay`}
                                            ShowOnlyIcon={true}
                                            hideDrager={true}
                                            tabs={[
                                                {
                                                    uniqueName: `${appqaReportProps.uniqueName}-overlay-tab-${index}`,
                                                    label: {
                                                        uniqueName: `${appqaReportProps.uniqueName}-overlay-tab-${index}-label`,
                                                        label: "Excel",
                                                        tooltip: "Save as Excel",
                                                    },
                                                    w: "auto",
                                                    h: "calc(var(--node_height) - var(--spacing-1))",
                                                    actionCode: "Excel",
                                                    handleMouse: function (): void {},
                                                },
                                            ]}
                                            allowUnSelect={true}
                                            selectedTabName={""}
                                            tabAlignment={"horizontal"}
                                            useContainer={false}
                                            handleSelectedTab={() => {
                                                handleClickSaveAsExcel(
                                                    JSON.stringify(report)
                                                );
                                            }}
                                            headerText={""}
                                        />
                                    </div>
                                ) : null
                            }
                        />
                    ))
                )}
            </div>
            {dialogContent && diagnosticLevel !== 0 ? (
                <Dialog
                    open={isDialogOpen}
                    className="nz-dialog-container"
                    maxWidth={"md"}
                    fullWidth={true}
                    hideBackdrop={true}
                    style={{ zIndex: 9999 }}
                >
                    <div className="nz-dialog-header nz-sub-header">
                        <Label
                            uniqueName={`${appqaReportProps.uniqueName}-dialog-title`}
                            label={"Download Report"}
                            fontWeight="bold"
                        />
                        <div className="nz-d-flex-row nz-align-center">
                            {diagnosticLevel !== 0 && (
                                <ActionImage
                                    uniqueName={`${appqaReportProps.uniqueName}-explorer-tree-info-ai`}
                                    image={{
                                        uniqueName: `${appqaReportProps.uniqueName}-layout-save-ai`,
                                        source: (
                                            <Save24x24
                                                size={FnGetCssVariable("--image-size-1")}
                                                fill="none"
                                                strokeWidth={1}
                                            />
                                        ),
                                        w: "var(--image-size-2)",
                                        tooltip: "Click to Save Report Layout json",
                                        type: "svg",
                                    }}
                                    w={"var(--node_height)"}
                                    disabled={false}
                                    h={"var(--node_height)"}
                                    actionCode={"savefloorlayout"}
                                    handleMouse={handleClickInformation}
                                />
                            )}
                            <ActionImage
                                handleMouse={() => {
                                    setIsDialogOpen(false);
                                    setDialogContent(undefined);
                                }}
                                image={{
                                    uniqueName: `${appqaReportProps.uniqueName}-i-close`,
                                    source: (
                                        <Close24x24
                                            size={FnGetCssVariable("--image-size-2")}
                                            fill="none"
                                            strokeWidth={1}
                                        />
                                    ),
                                    type: "svg",
                                    w: "var(--image-size-2)",
                                    h: "var(--image-size-2)",
                                    tooltip: "close",
                                }}
                                uniqueName={`${appqaReportProps.uniqueName}-ai-close`}
                                actionCode="cancel"
                                w="var(--node_height)"
                                h="var(--node_height)"
                            />
                        </div>
                    </div>
                    <DialogContent>
                        {diagnosticLevel !== 0 && (
                            <JsonViewer
                                uniqueName={`${appqaReportProps.uniqueName}-dialog-content`}
                                jsonData={dialogContent}
                                showAsDiv={true}
                            />
                        )}
                        <PdfMaker
                            config={updateLayoutWithSessionVars(
                                dialogContent,
                                getSessionVars
                            )}
                            autoGenerate={false}
                            onSuccess={() => {}}
                        />
                    </DialogContent>
                </Dialog>
            ) : (
                <>
                    {dialogContent && (
                        <div style={{ display: "none" }}>
                            <PdfMaker
                                config={updateLayoutWithSessionVars(
                                    dialogContent,
                                    getSessionVars
                                )}
                                autoGenerate={true}
                                onSuccess={() => {}}
                            />
                        </div>
                    )}
                </>
            )}
            <YesNoFormContainer
                isOpen={isConfirmOpen}
                uniqueName={appqaReportProps.uniqueName + "confirmbox"}
                message={confirmMessage}
                showOkButton={true}
                handleOkButtonClick={() => {
                    setIsConfirmOpen(false);
                }}
            />
        </div>
    );
};

export default AppqaReport;
