
import { useEffect, useMemo, useState } from 'react'
import '../allcss/devicemodel/SearchTab.css'
import { SearchControl } from '../searchfilter/searchcontrol/SearchControl'
import {
	ISearchComboOption,
	ISearchOptionFieldKey,
	ISearchTab,
} from '../allinterface/devicemodel/ISearchTab'
import { IDeviceModelProfileString, IDeviceSearchOption } from '../allinterface/devicemodel/IDeviceModel'
import { DeviceModelFEnums } from '../alldefaultprops/devicemodel/DeviceModelEnums'
import { debounce } from 'lodash'
import { CascadingComboForm, IChangeMeta, ICombo, IOptionItem, RadioButtonGroupControl } from '@n20a/libform'
import { FnGenerateUID } from '../allcommon/settingsform/FnGenerateUID'
import { ISearchControl } from '../allinterface/searchfilter/ISearchControl'

/* Default SearchControl props before parent handlers are attached. */
export const searchProps: Pick<
	ISearchControl,
	'uniqueName' | 'isShowFilterControl' | 'lensDirty' | 'filterDirty' | 'searchInputValue'
> & { hiderightmousemenu: boolean } = {
	uniqueName: 'filtericon',
	isShowFilterControl: false,
	lensDirty: false,
	filterDirty: false,
	searchInputValue: '',
	hiderightmousemenu: false,
}

/* Deduplicates option rows by mty, pno, or full object key. */
const getUniqueOptionArray = (data: IDeviceSearchOption[]): IDeviceSearchOption[] => {
	const seen = new Set<string>();

	return data.filter((item) => {
		const key = item.mty || item.pno || JSON.stringify(item);

		if (seen.has(key)) {
			return false;
		}

		seen.add(key);
		return true;
	});
};

/* Builds cascading combo Option list for a given optionData field key. */
const buildComboOptions = (
	data: IDeviceSearchOption[],
	key: ISearchOptionFieldKey
): ISearchComboOption[] => {
	const options: ISearchComboOption[] = [];
	const filteredData = data.filter((item) => item[key]);

	for (let index = 0; index < filteredData.length; index++) {
		const element = filteredData[index];
		const optionValue = element[key];
		if (optionValue !== undefined && optionValue !== null) {
			options.push({ Option: String(optionValue) });
		}
	}

	return options;
};

/* Static attribute filter options for the Filter By Attribute combo. */
const attributeFilterOptions: ISearchComboOption[] = [
	{ Option: 'All' },
	{ Option: 'Racks/Cabinets' },
	{ Option: 'Rackmountable' },
	{ Option: 'Cards/Modules' },
	{ Option: 'Chassis' },
];

/* String key/value map accepted by CascadingComboForm initialValues. */
type ICascadingComboInitialValues = Record<string, string | null>;

/* Converts device profile to string values expected by CascadingComboForm. */
const toComboInitialValues = (
	profile?: IDeviceModelProfileString
): ICascadingComboInitialValues | undefined => {
	if (!profile) {
		return undefined;
	}

	const result: ICascadingComboInitialValues = {};

	for (const [key, rawValue] of Object.entries(profile)) {
		if (rawValue === undefined || rawValue === null) {
			result[key] = null;
		} else if (typeof rawValue === 'string') {
			result[key] = rawValue;
		} else if (typeof rawValue === 'object') {
			const option = rawValue as IDeviceSearchOption;
			const comboValue = option.value ?? option.mfg ?? option.label;
			result[key] = comboValue != null ? String(comboValue) : null;
		} else {
			result[key] = String(rawValue);
		}
	}

	return result;
};

/* DeviceModel search tab: source radio, keyword search, and cascading filters. */
export const SearchTab = (searchTabProps: ISearchTab) => {
	const [searchControlProps, setSearchControlProps] = useState(searchProps);
	const [searchText, setSearchText] = useState<string>('');
	const [optionConfig, setOptionConfig] = useState<ICombo[]>();
	const [optionData, setOptionData] = useState<IDeviceSearchOption[]>([]);
	const [redioFromControls, setRedioFromControls] = useState<IOptionItem[] | null>(null);
	const [hideRedioBtn, setHideRedioBtn] = useState<boolean>(
		!!searchTabProps.ShowOnlyLibraryRedio
	);
	const [selectedRedio, setSelectedRedio] = useState<string>(
		DeviceModelFEnums.NetZoomDeviceLibrary
	);

	/* Sync keyword text when parent searchText changes. */
	useEffect(() => {
		if (searchTabProps.searchText) {
			setSearchText(searchTabProps.searchText);
		}
	}, [searchTabProps.searchText]);

	/* Deduplicate and store manufacturer/equipment/product option rows. */
	useEffect(() => {
		try {
			if (searchTabProps.optionData) {
				setOptionData(getUniqueOptionArray(searchTabProps.optionData));
			}
		} catch (error) {
			console.error('SearchTab: failed to process option data', error);
			setOptionData([]);
		}
	}, [searchTabProps.optionData]);

	/* Build CascadingComboForm config when optionData changes. */
	useEffect(() => {
		try {
			const myConfig: ICombo[] = [
				{
					id: 'Manufacturer',
					label: 'Manufacturer',
					populateOptions: () => buildComboOptions(optionData, 'mfg'),
					onChange: (value) => {
						searchTabProps.handeleValueChangeForForm(value ?? '', 'Manufacturer', false);
					},
				},
				{
					id: 'Equipment Type',
					label: 'Equipment Type',
					populateOptions: () => buildComboOptions(optionData, 'mty'),
					onChange: (value) => {
						searchTabProps.handeleValueChangeForForm(value ?? '', 'Equipment Type', false);
					},
				},
				{
					id: 'Product Number',
					label: 'Product Number',
					populateOptions: () => buildComboOptions(optionData, 'pno'),
					onChange: (value) => {
						searchTabProps.handeleValueChangeForForm(value ?? '', 'Product Number', false);
					},
				},
			];

			if (!searchTabProps.ShowOnlyLibraryRedio) {
				myConfig.push({
					id: 'Filter By Attribute',
					label: 'Filter By Attribute',
					populateOptions: () => attributeFilterOptions,
					onChange: (value) => {
						searchTabProps.handeleValueChangeForForm(value ?? '', 'Filter By Attribute', false);
					},
				});
			}
			setOptionConfig(myConfig);
		} catch (error) {
			console.error('SearchTab: failed to build combo config', error);
			setOptionConfig(undefined);
		}
	}, [optionData, searchTabProps.ShowOnlyLibraryRedio]);

	/* Radio options for search source selection. */
	const sampleDataForRadio: IOptionItem[] = [
		{ label: DeviceModelFEnums.NetZoomDeviceLibrary, value: DeviceModelFEnums.NetZoomDeviceLibrary },
		{ label: DeviceModelFEnums.Inventory, value: DeviceModelFEnums.Inventory },
		{ label: DeviceModelFEnums.CurrentSite, value: DeviceModelFEnums.CurrentSite },
		{ label: DeviceModelFEnums.AllSites, value: DeviceModelFEnums.AllSites },
	];

	/* Set available source radios based on feature and selected node type. */
	useEffect(() => {
		try {
			if (searchTabProps.ShowOnlyLibraryRedio) {
				setHideRedioBtn(true);
				setSelectedRedio(DeviceModelFEnums.NetZoomDeviceLibrary);
				setRedioFromControls([
					{ label: DeviceModelFEnums.NetZoomDeviceLibrary, value: DeviceModelFEnums.NetZoomDeviceLibrary },
				]);
				return;
			}

			setHideRedioBtn(false);
			setRedioFromControls(sampleDataForRadio);
		} catch (error) {
			console.error('SearchTab: failed to set radio controls', error);
			setRedioFromControls(sampleDataForRadio);
		}
	}, [searchTabProps.selectedNode, searchTabProps.treeData, searchTabProps.searchTypeValue, searchTabProps.ShowOnlyLibraryRedio, searchTabProps.featureId]);

	/* Debounced keyword search callback to parent. */
	const debouncedSearch = useMemo(
		() =>
			debounce((value: string) => {
				searchTabProps.searchValueChange(value);
			}, 500),
		[searchTabProps.searchValueChange]
	);

	/* Cancel pending debounced search on unmount. */
	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	/* Updates local search text, lens dirty state, and debounces parent notification. */
	const searchValueChange = (value: string) => {
		setSearchText(value);
		setSearchControlProps({ ...searchControlProps, lensDirty: Boolean(value) });
		debouncedSearch(value);
	};

	/* Sync lens dirty icon when parent isLensDirty changes. */
	useEffect(() => {
		setSearchControlProps({ ...searchControlProps, lensDirty: Boolean(searchTabProps.isLensDirty) });
	}, [searchTabProps.isLensDirty]);

	/* Handles search source radio selection. */
	function handleValueRedio(value: unknown, meta: IChangeMeta): void {
		const radioValue = typeof value === 'string' ? value : String(value ?? '');
		searchTabProps.handleValueChangeRadio(radioValue, '', false);
		setSelectedRedio(radioValue);
	}

	/* Profile as string map for CascadingComboForm (manufacturer objects are flattened). */
	const comboInitialValues = useMemo(
		(): ICascadingComboInitialValues | undefined =>
			toComboInitialValues(searchTabProps.profileString),
		[searchTabProps.profileString]
	);

	return (
		<div className='nz-searchtab-container'>
			<div className='nz-searchtab-radio'>
				{!hideRedioBtn && redioFromControls && (
					<RadioButtonGroupControl
						options={redioFromControls}
						value={selectedRedio}
						onChange={handleValueRedio}
					/>
				)}
			</div>
			<div className='nz-search-control'>
				{searchControlProps && (
					<SearchControl
						{...searchControlProps}
						hideRightMouseMenu={false}
						isDisableSearch={searchTabProps.isDisableForm ?? false}
						searchInputValue={searchText}
						handleFilterMouse={() => undefined}
						handleLensMouse={(value) => {
							searchTabProps.handleLensMouse(value);
						}}
						searchValueChange={searchValueChange}
					/>
				)}
			</div>
			{searchTabProps.errorMessage && (
				<div className="nz-import-error-msg">
					{searchTabProps.errorMessage}
				</div>
			)}
			<div className='nz-form-list-container'>
				{optionConfig && (
					<CascadingComboForm
						key={searchTabProps.profileString ? FnGenerateUID() : searchProps.uniqueName}
						initialValues={comboInitialValues}
						cascadingComboArray={optionConfig}
						buttons={[]}
						autoSubmit={true}
					/>
				)}
			</div>
		</div>
	);
};
