
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../allcss/deviceview/ViewContainer.css'
import { IViewContainer, IViewImageItem } from '../allinterface/viewcontainer/IViewContainer';
import { IView } from '../allinterface/deviceview/IView';
import { DevicePreview } from '../deviceview/devicepreview/DevicePreview';
import { ITab } from '../allinterface/deviceview/ITab';
import { ResponsiveDeviceView } from '../deviceview/responsivedeviceview/ResponsiveDeviceView';
import { ThreeDView } from '../deviceview/threedview/ThreeDView';
import { OverlayTab } from '../basic/overlaytab/OverlayTab';
import { useStatusBarContext } from '../context/hooks/StatusBarHooks';
import { AIContainer } from '../aicontainer/AIContainer';
import { useSessionContext } from '../context/hooks/SessionHooks';
import { FnCreateReportForPrint } from '../allcommon/generatepdf/FnCreateReportForPrint';
import { GeneratePdf } from '../generatepdf/GeneratePdf';
import { TReportLayoutJson } from '../../appqa/allinterface/IGeneratePdf';

const CHART_TABS: ITab[] = [
	{
		label: "Chart",
		tooltip: "Click to view Chart"
	}
];

const PRINT_TABS: ITab[] = [
	{
		label: "Print",
		tooltip: "Click to Print",
	}
];

const CHART_AND_ASK_TABS: ITab[] = [
	...CHART_TABS,
	{
		label: "Ask",
		tooltip: "Click to Ask"
	}
];

const createVirtualViewItem = (label: string): IViewImageItem => ({
	uniqueName: label,
	label,
	tabName: label,
	image: {
		uniqueName: label,
		source: label,
		h: "100%",
		w: "100%",
		type: "svg"
	},
	className: label
});

const createSvgViewItem = (view: IView, svg: string, fallbackUniqueName: string): IViewImageItem => {
	const uniqueName = view?.uniqueName ? view.uniqueName : fallbackUniqueName;

	return {
		uniqueName,
		label: view.viewTitle,
		tabName: view.tab.label,
		image: {
			uniqueName,
			source: svg,
			h: "100%",
			w: "100%",
			type: "svg"
		},
		className: view.customClassName
	};
};

const getSelectedDataKey = (selectedTabData: Array<ITab | IView | IViewImageItem> | IViewImageItem[] | undefined) => {
	if (!selectedTabData) return '';

	return selectedTabData.map((item) => {
		if ('image' in item) {
			return `${item.tabName}|${item.uniqueName}|${item.image.source}`;
		}

		if ('tab' in item) {
			return `${item.tab.label}|${item.uniqueName}|${item.svg}`;
		}

		return item.label;
	}).join('|');
}

const resolveDeviceViewSide = (tabName?: string): "Front" | "Rear" | null => {
	const normalized = String(tabName ?? "").trim().toLowerCase();
	if (normalized.includes("rear")) {
		return "Rear";
	}
	if (normalized.includes("front")) {
		return "Front";
	}
	return null;
};

const ViewContainer = (props: IViewContainer) => {
	console.log('props ViewContainer', props)
	const [selectedTabName, setSelectedTabName] = useState<string>('')
	const [selectedNodeAllProperties, setSelectedNodeAllProperties] = useState<object>();
	const [isAskLoading, setIsAskLoading] = useState(false);
	const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
	const [reportTemplateJson, setReportTemplateJson] = useState<TReportLayoutJson | null>(null);
	const handleSelectedTabChangesRef = useRef(props.handleSelectedTabChanges);
	const lastNotifiedTabRef = useRef('');
	const sessionContext = useSessionContext();
	const statusBarContext = useStatusBarContext();

	useEffect(() => {
		handleSelectedTabChangesRef.current = props.handleSelectedTabChanges;
	}, [props.handleSelectedTabChanges])


	const {
		tabsObj,
		SvgImageObj,
		defaultSelectedTab,
		defultSelectedData
	} = useMemo(() => {
		// No view data means there is nothing to render or select.
		if (!props.views) {
			return {
				tabsObj: undefined,
				SvgImageObj: undefined,
				defaultSelectedTab: '',
				defultSelectedData: [] as Array<ITab | IView>
			};
		}

		const tabs: ITab[] = []
		const deviceView: IViewImageItem[] = []
		let defaultSelectedTab = ''
		const defultSelectedData: Array<ITab | IView> = []
		const hasMultipleViews = props.views.length > 1;

		for (let index = 0; index < props.views.length; index++) {

			const element = props.views[index];
			const isFirstView = index === 0;
			let svg = element?.svg ? element.svg : ''

			if (props.isEncrypted) {
				svg = element.svg ? window && window.atob(element.svg) : ''
			}

			// Add the 3D tab before the first real SVG view when multiple views exist.
			if (isFirstView && !props.hideTreeDView && hasMultipleViews) {
				const threeDTab: ITab = {
					label: "3D",
					tooltip: "Click to view 3d view",
				}

				deviceView.push(createVirtualViewItem("3D"))
				tabs.push(threeDTab)

				defaultSelectedTab = "3D"
				defultSelectedData.push(threeDTab)
			} else if (isFirstView && hasMultipleViews) {
				if (index == 0) {
					defaultSelectedTab = element.tab.label
				}
				defultSelectedData.push(element)
			}

			// Add the actual SVG view from the API/config.
			deviceView.push(createSvgViewItem(element, svg, props.uniqueName))
			tabs.push(element.tab)
		}

		// Device nodes support both Chart and Ask; other node types only show Chart.
		if (!props.hideChartAndAsk) {
			let analyticsTabs =
				props.selectedNode?.treetype === "Device"
					? CHART_AND_ASK_TABS
					: CHART_TABS;

			if (props.selectedNode?.NodeEntityname?.toLowerCase().includes("cable")) {
				analyticsTabs = analyticsTabs.filter(
					(tab) => tab.label.toLowerCase() !== "chart"
				);
			}

			tabs.push(...analyticsTabs, ...PRINT_TABS);
		}

		// Keep single-tab headers hidden only when the caller explicitly asks for that behavior.
		const shouldShowTabs = tabs.length > 1 || !props.hideSignalTabHeader;
		const nextTabsObj = shouldShowTabs ? tabs : undefined;

		return {
			tabsObj: nextTabsObj,
			SvgImageObj: deviceView,
			defaultSelectedTab,
			defultSelectedData
		};
	}, [props.hideChartAndAsk, props.hideSignalTabHeader, props.hideTreeDView, props.isEncrypted, props.selectedNode?.treetype, props.uniqueName, props.views])

	useEffect(() => {
		if (!props.views) return;

		if (props.selectedTabName) {
			if (props.viewType === 'mounted') {
				const data = SvgImageObj && SvgImageObj.length > 1
					? SvgImageObj.filter((item) => item.tabName === props.selectedTabName)
					: SvgImageObj;
				const notifyKey = `${props.selectedTabName}|${getSelectedDataKey(data)}`;
				if (lastNotifiedTabRef.current !== notifyKey) {
					lastNotifiedTabRef.current = notifyKey;
					handleSelectedTabChangesRef.current?.(props.selectedTabName, data)
				}
			}
			setSelectedTabName((currentTabName) => currentTabName === props.selectedTabName ? currentTabName : props.selectedTabName ?? '')
		} else {
			if (props.viewType === 'mounted') {
				const notifyKey = `${defaultSelectedTab}|${getSelectedDataKey(defultSelectedData)}`;
				if (lastNotifiedTabRef.current !== notifyKey) {
					lastNotifiedTabRef.current = notifyKey;
					handleSelectedTabChangesRef.current?.(defaultSelectedTab, defultSelectedData)
				}
			}
			setSelectedTabName(defaultSelectedTab)
		}

	}, [SvgImageObj, defaultSelectedTab, defultSelectedData, props.selectedTabName, props.viewType, props.views])

	const getDeviceViewSideForPrint = useCallback((): "Front" | "Rear" => {
		const fromSelected = resolveDeviceViewSide(selectedTabName);
		if (fromSelected) {
			return fromSelected;
		}

		for (const view of props.views ?? []) {
			const side = resolveDeviceViewSide(view.tab.label);
			if (side) {
				return side;
			}
		}

		return "Front";
	}, [props.views, selectedTabName]);

	const handlePrintReport = useCallback(async () => {
		statusBarContext.setIsLoading(true)
		const diplayDeviceView = getDeviceViewSideForPrint();
		const result = await FnCreateReportForPrint(
			"DeviceView",
			statusBarContext,
			undefined,
			diplayDeviceView
		);

		if (result?.template) {
			setReportTemplateJson(result.template);
			setIsReportDialogOpen(true);
			statusBarContext.setIsLoading(false)
			return;
		}
		statusBarContext.setIsLoading(false)
		statusBarContext?.setUserActionData?.("Device view report template not found.");
	}, [getDeviceViewSideForPrint, statusBarContext]);

	const handleMouse = useCallback((actionCode: string[]) => {
		if (actionCode && actionCode[0].toLowerCase() === "print") {

			void handlePrintReport();

			return;
		}

		setSelectedTabName(actionCode[0])

		if (props.viewType === 'mounted') {
			const selectedTabObj = SvgImageObj?.filter((item) => item.tabName === actionCode[0])
			handleSelectedTabChangesRef.current?.(actionCode[0], selectedTabObj)
		}
	}, [SvgImageObj, handlePrintReport, props.viewType])

	const handleApiCallForDeviceInfo = useCallback(async () => {
		if (props.selectedNode && props.selectedNode.NodeEntID && props.selectedNode.NodeEntityname) {
			setIsAskLoading(true);

		} else {
			setSelectedNodeAllProperties({})
			setIsAskLoading(false);
		}
	}, [props.selectedNode])

	useEffect(() => {
		if (selectedTabName === "Ask") {
			handleApiCallForDeviceInfo();
		}
	}, [handleApiCallForDeviceInfo, selectedTabName])
	const isStandaloneTab = selectedTabName === "Chart" || selectedTabName === "Ask";
	const visibleSvgImageObj = SvgImageObj;
	const isThreeDSelected = selectedTabName === "3D";
	const shouldRenderSvgViews = visibleSvgImageObj && visibleSvgImageObj.length > 0
		&& (selectedTabName || visibleSvgImageObj.length === 1)
		&& !isStandaloneTab
		&& (!isThreeDSelected || Boolean(props.SvgParentJSONForThreeD));
	const shouldRenderChart = selectedTabName === "Chart" && props.selectedNode;
	const shouldRenderAsk = selectedTabName === "Ask" && props.selectedNode;

	return (
		<div className='nz-two-d-view-container'>
			{props.title && <div className='nz-sub-header '>
				{tabsObj && tabsObj?.length > 1 ? <OverlayTab
					uniqueName={`${props.uniqueName}-replacement-overlay`}
					tabs={tabsObj && tabsObj.map((t, index) => ({
						uniqueName: `${props.uniqueName}-overlay-tab-${index}`,
						label: {
							uniqueName: `${props.uniqueName}-overlay-tab-${index}-label`,
							label: t.label,
							tooltip: t.tooltip
						},
						w: "auto",
						h: "calc(var(--node_height) - var(--spacing-1))",
						actionCode: t.label,
						handleMouse: function (): void {
						}
					}))}
					ShowOnlyIcon={true}
					disableSelectionKey={['Print']}
					selectedTabName={selectedTabName ?? ""}
					tabAlignment={"horizontal"}
					headerText={props.title}
					useContainer={false}
					handleSelectedTab={handleMouse}

				/> : props.title}
			</div>}

			<div className={`nz-svg-container ${visibleSvgImageObj && visibleSvgImageObj.length === 1 ? "nz-single-svg" : ""}`}>
				{shouldRenderSvgViews && visibleSvgImageObj?.map((item) => {
					console.log('visibleSvgImageObj', visibleSvgImageObj)
					return <div className={`nz-svg-device-preview ${item.tabName === selectedTabName || visibleSvgImageObj.length === 1 ? "" : "nz-hidden"}`}
						key={item.uniqueName || item.tabName} >

						{/* 3D View */}
						{item.tabName === "3D" && selectedTabName === "3D" && props.selectedNode && props.SvgParentJSONForThreeD && (
							<div className='nz-3d-view'>
								<ThreeDView
									ParentJSON={props.SvgParentJSONForThreeD}
									label={props.viewLabel ?? item.label}
									handleMouse={(event, entID) => props.handleMouse?.(event, entID)}
								/>
							</div>
						)}
						{/* Responsive SVG View */}
						{item.tabName !== "3D" && props.responsive && props.selectedNode && (
							<ResponsiveDeviceView
								{...item}
								key={item.uniqueName}
								selectedTabName={selectedTabName}
								imageSource={item.image.source as string}
								label={props.viewLabel ?? item.label}
								allowZoom={props.disableZoom}
								outputFormat="JSX"
								selectedDeviceViewId={props.selectedDeviceViewId}
								selectedNode={props.selectedNode}
								handleMouse={(event, actionCode) =>
									props.handleMouse?.(event, actionCode)
								}
								handleMouseDoubleClick={(event, actionCode) =>
									props.handleMouseDoubleClick?.(event, actionCode)
								}
							/>
						)}

						{/* Default SVG Preview */}
						{item.tabName !== "3D" && !props.responsive && (
							<DevicePreview
								{...item}
								label={props.viewLabel ?? item.label}
								allowZoom={props.disableZoom}
								handleMouse={(event) => props.handleMouse?.(event, props.entID)}
							/>
						)}

					</div>
				})}
				{
					shouldRenderAsk && <div className='nz-Floor-ask-componet'>
						{isAskLoading || !selectedNodeAllProperties ? (
							<div className="nz-w-100 nz-h-100 nz-d-flex-hv-left">Loading...</div>
						) : (
							<AIContainer uniqueName={`${props.uniqueName}-fqa-info`}
								selectedNode={props.selectedNode}
								featureId={props.featureId ?? ""}
								sessionVars={sessionContext.SessionList}
								selectedAllProperties={selectedNodeAllProperties} />
						)}
					</div>
				}
			</div>
			{isReportDialogOpen && <GeneratePdf
				uniqueName={`${props.uniqueName}-device-view-report`}
				isOpen={isReportDialogOpen}
				reportJson={reportTemplateJson}
				title="Device View Report"
				selectedNode={props.selectedNode}
				onClose={() => {
					setIsReportDialogOpen(false);
					setReportTemplateJson(null);
				}}
			/>}
		</div>
	)
}

export { ViewContainer }
