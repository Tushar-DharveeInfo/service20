
import { useState } from 'react'
import '../../allcss/profile/MySubscriptions.css'
import { Label } from '../../../shared/basic/label/Label.tsx'
import { CardLayout } from '../../../shared/cardlayout/CardLayout.tsx'
import { ICardLayoutField } from '../../../shared/allinterface/cardlayout/ICardLayout.ts'
import { FnConvertDateToUtcOrUtcToDate } from '../../../appcontainer/allcommon/FnConvertDateToUtcOrUtcToDate.ts'
import { sampleUserLicenses, type ISampleUserLicense } from '../../../../sampledata/features/MySubscriptionsSampleData.ts'
import { IMySubscriptions } from '../../allinterface/profile/IMySubscriptions.ts'

/* Card rows matching the NZLicenseKey license-card layout. */
const getLicenseFields = (license: ISampleUserLicense): ICardLayoutField[] => {
    const fields: ICardLayoutField[] = [
        { Name: "", Value: license._NZLicenseKey, Header: 1 },
        {
            Name: "Start Date",
            Value: FnConvertDateToUtcOrUtcToDate(license.StartDate, false, false),
            Group: "dates",
            Row: "inline"
        },
        {
            Name: "End Date",
            Value: FnConvertDateToUtcOrUtcToDate(license.EndDate, false, false),
            Group: "dates",
            Row: "inline"
        },
        {
            Name: "Product Name",
            Value: license.ProductName,
            Group: "product",
            Row: "inline"
        }
    ];

    if (license.RackCount > 0) {
        fields.push({
            Name: "Rack Count",
            Value: String(license.RackCount),
            Group: "product",
            Row: "inline"
        });
    } else {
        fields.push({
            Name: "User Count",
            Value: String(license.UserCount),
            Group: "product",
            Row: "inline"
        });
    }

    return fields;
};

const MySubscriptions = (mySubscriptionsProps: IMySubscriptions) => {
    const [selectedLicenseId, setSelectedLicenseId] = useState<string>();

    return (
        <div key={mySubscriptionsProps.uniqueName} className='nz-my-subscriptions-container nz-wh-100'>
            <div className='nz-sub-header'>
                <Label
                    uniqueName={`${mySubscriptionsProps.uniqueName}-header`}
                    label={mySubscriptionsProps.headerText ?? "My Subscriptions"}
                    fontWeight='600' />
            </div>
            <div className='nz-my-subscriptions-list'>
                {sampleUserLicenses.map((license) => (
                    <CardLayout
                        key={license.EntID}
                        uniqueName={`${mySubscriptionsProps.uniqueName}-${license.EntID}`}
                        featureId={mySubscriptionsProps.featureId}
                        data={license}
                        fields={getLicenseFields(license)}
                        className='nz-my-subscriptions-card'
                        isSelected={selectedLicenseId === license.EntID}
                        hideRightMouseMenu={true}
                        keyboardNavigationOrientation={'vertical'}
                        tabIndex={0}
                        onClick={() => setSelectedLicenseId(license.EntID)} />
                ))}
            </div>
        </div>
    )
}

export { MySubscriptions }
export default MySubscriptions
