import { IControl } from "../../component/shared/allinterface/settingsform/ISettingsLibForm";
import {
    fnBusinessType,
    fnContactStatus,
    fnContactType,
    fnDistinctAssignedTo,
    fnDistinctCountry,
    fnDistinctState,
    fnDistinctTag,
    fnFinYearMonth,
    fnNoticePeriod,
    fnStatus,
    fnVerified,
    toComboOptions,
} from "./BusinessFilterOptions";

const baseControl = (
    name: string,
    propertyLabel: string,
    displayGroup: string,
    sortOrder: number,
    displayControl: string,
    options?: { label: string; value: string }[]
): IControl => ({
    CanChange: 1,
    IsRequired: 0,
    GroupName: "APForm_BusinessFilter",
    GroupNameDesc: "",
    SubGroupEntID: "",
    SubGroupName: "FormControl",
    SubGroupNameDesc: "",
    _AP: name,
    PropertyLabel: propertyLabel,
    NameDesc: propertyLabel,
    DefaultAPValue: "",
    Value: "",
    ValueDesc: "",
    SortOrder: sortOrder,
    MaxInstances: 0,
    InputMask: "",
    RegEx: "",
    DisplayGroupControl: displayGroup,
    DisplayControl: displayControl,
    ChangeEvent: "",
    Secured: false,
    IsNZ: false,
    EntID: name,
    RecID: name,
    LastUpdated: "",
    EntityName: "AP",
    Name: name,
    disabled: false,
    ...(options ? { Options: options } : {}),
});

const FILTER_BUSINESS = "Filter Business";
const FILTER_CONTACT = "Filter Contact";
const FILTER_COUNTRY = "Filter Country";

/**
 * Business + Contact AND filters for the businesses explorer tree.
 */
export const formControlsBusinessFilter: IControl[] = [
    // Filter Business
    baseControl("status", "Status", FILTER_BUSINESS, 1, "ComboBoxControl", toComboOptions(fnStatus().options)),
    baseControl("verified", "Verified", FILTER_BUSINESS, 2, "ComboBoxControl", toComboOptions(fnVerified().options)),
    baseControl("noticePeriod", "NoticePeriod", FILTER_BUSINESS, 5, "ComboBoxControl", toComboOptions(fnNoticePeriod().options)),
    baseControl("finYearMonth", "FinYear/Month", FILTER_BUSINESS, 6, "ComboBoxControl", toComboOptions(fnFinYearMonth().options)),
    baseControl("StartDate", "dateUpdated", FILTER_BUSINESS, 7, "DateControl"),
    baseControl("EndDate", "dateUpdated", FILTER_BUSINESS, 8, "DateControl"),
    baseControl("btype", "Type", FILTER_BUSINESS, 9, "ComboBoxControl", toComboOptions(fnBusinessType().options)),
    baseControl("assignedTo", "AssignedTo", FILTER_BUSINESS, 10, "ComboBoxControl", toComboOptions(fnDistinctAssignedTo().options)),
    baseControl("tag", "Tag", FILTER_BUSINESS, 11, "ComboBoxControl", toComboOptions(fnDistinctTag().options)),

    // Filter Contact
    baseControl("contactType", "Contact Type", FILTER_CONTACT, 12, "ComboBoxControl", toComboOptions(fnContactType().options)),
    baseControl("contactStatus", "Contact Status", FILTER_CONTACT, 13, "ComboBoxControl", toComboOptions(fnContactStatus().options)),
    baseControl("contactVerified", "Contact Verified", FILTER_CONTACT, 14, "ComboBoxControl", toComboOptions(fnVerified().options)),
    baseControl("contactTag", "Contact Tag", FILTER_CONTACT, 17, "ComboBoxControl", toComboOptions(fnDistinctTag().options)),

    // Filter Country/State → SettingsLibForm renders CountryForm for this group
    baseControl("country", "Country", FILTER_COUNTRY, 15, "ComboBoxControl"),
    baseControl("state", "State", FILTER_COUNTRY, 16, "ComboBoxControl"),
];
