import type { IUserProfileRecord } from "../../shared/context/allinterface/IMainApp";
import {
    type ISampleUserLicense
} from "../../../sampledata/features/MySubscriptionsSampleData";

type TSubscriberProduct = "NetZoom" | "Visio Stencils";



/* Maps license ProductName to the status-bar subscriber label. */
const FnGetSubscriberProduct = (
    licenses?: ISampleUserLicense[]
): TSubscriberProduct | undefined => {

    return "NetZoom";

};

/**
 * Builds the status-bar login identity line from the current user profile
 * and available subscription licenses.
 */
const FnGetLoggedInStatusMessage = (
    userProfileRecord?: IUserProfileRecord,
    licenses?: ISampleUserLicense[]
): string => {
    if (!userProfileRecord) {
        return "You are logged in as a guest user";
    }

    const subscriberProduct = FnGetSubscriberProduct(licenses);
    if (!subscriberProduct) {
        return "You are logged in as a guest user";
    }

    return `You are logged in as a ${subscriberProduct} subscriber`;
};

export { FnGetLoggedInStatusMessage };
export type { TSubscriberProduct };
