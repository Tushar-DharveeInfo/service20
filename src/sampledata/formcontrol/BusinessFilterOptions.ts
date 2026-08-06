/**
 * Combo option helpers for business / contact explorer filters.
 * Distinct country/state/assignedTo/tag are stubs until API is wired.
 */

export function fnVerified() {
    return { options: [true, false] as (boolean | string)[] };
}

export function fnFinYearMonth() {
    return {
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    };
}

export function fnNoticePeriod() {
    return { options: ["30", 60, 90, 120, 150, "180"] as (string | number)[] };
}

export function fnStatus() {
    return { options: ["Active", "Inactive", "Blocked"] };
}

export function fnContactStatus() {
    return { options: ["Active", "Inactive", "Blocked"] };
}

export function fnBusinessType() {
    return { options: ["Client", "Reseller", "Vendor", "MCS", "Government"] };
}

export function fnContactType() {
    return { options: ["User", "BillTo", "ShipTo", "Contact", "Executive", "Prospect"] };
}

/** Call API to get distinct country — stub options for now. */
export function fnDistinctCountry() {
    return { options: ["USA", "Canada", "UK", "Australia"] };
}

/** Call API to get distinct state based on country — stub options for now. */
export function fnDistinctState(_country: string) {
    return {
        options: ["California", "Texas", "New York", "Florida", "Colorado"],
    };
}

/** Call API to get distinct AssignedTo names — stub options for now. */
export function fnDistinctAssignedTo() {
    return {
        options: ["John Smith", "Jane Doe", "Alice Johnson", "Bob Brown"],
    };
}

/** Call API to get distinct Tag names — stub options for now. */
export function fnDistinctTag() {
    return { options: ["Tag1", "Tag2", "Tag3"] };
}

export function toComboOptions(options: (string | number | boolean)[]) {
    return options
        .filter((option) => option !== "" && option !== null && option !== undefined)
        .map((option) => ({
            label: String(option),
            value: String(option),
        }));
}
