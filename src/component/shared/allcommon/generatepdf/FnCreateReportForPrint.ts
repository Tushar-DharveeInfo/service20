/** Stub report builder — returns empty template so print UI can open without full PDF pipeline. */
const FnCreateReportForPrint = async (
	_sourceType: string,
	_statusBarContext?: unknown,
	_chartData?: unknown,
	_displayDeviceView?: "Front" | "Rear",
): Promise<{ report: null; template: null }> => {
	return { report: null, template: null };
};

export { FnCreateReportForPrint };
