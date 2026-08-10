import { FnFormatDateWithAppFormat } from '../../../appcontainer/allcommon/FnFormatDateWithAppFormat'

/** Force MM/dd/yyyy regardless of app locale. */
const TICKET_DATE_LOCALE = 'USA'

/** Ticket date + time (MM/dd/yyyy h:mm AM/PM). Used in detail form. */
function FnFormatTicketDate(value: Date | string | null | undefined): string {
    if (value == null || value === '') return ''
    return FnFormatDateWithAppFormat(value, true, TICKET_DATE_LOCALE)
}

/** Ticket date only (MM/dd/yyyy). Used for tree day group labels. */
function FnFormatTicketDateOnly(value: Date | string | null | undefined): string {
    if (value == null || value === '') return ''
    return FnFormatDateWithAppFormat(value, false, TICKET_DATE_LOCALE)
}
export { FnFormatTicketDate, FnFormatTicketDateOnly }