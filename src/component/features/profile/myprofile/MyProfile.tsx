
import { useEffect, useState } from 'react'
import { AddressForm, type IAddress } from '@n20a/libform'
import '../../allcss/profile/MyProfile.css'
import { Label } from '../../../shared/basic/label/Label.tsx'
import { sampleUserProfile } from '../../../../sampledata/features/MyProfileSampleData.ts'
import { IMyProfile } from '../../allinterface/profile/IMyProfile.ts'

const MyProfile = (myProfileProps: IMyProfile) => {
    const [address, setAddress] = useState<IAddress>(sampleUserProfile.Address);
    const defaultHeaderText = myProfileProps.headerText ?? "My Activities";
    const [headerTitle, setHeaderTitle] = useState<string>(defaultHeaderText);

    const handleAddressChange = (updatedAddress: IAddress) => {
        setAddress(updatedAddress);
    };

    useEffect(() => {
        setHeaderTitle(defaultHeaderText);
    }, [defaultHeaderText]);
    const handleAddressSave = (updatedAddress: IAddress) => {
        setAddress(updatedAddress);
        // SAMPLE DATA: EM.AddUpdateTableRecord for the user address is not called.
        myProfileProps.handleShowUserMessage?.("Profile address saved.");
    };

    return (
        <div key={myProfileProps.uniqueName} className='nz-my-profile-container nz-wh-100'>
            <div className='nz-sub-header'>
                <Label
                    uniqueName={`${myProfileProps.uniqueName}-address-header`}
                    label={headerTitle}
                    fontWeight='600' />
            </div>
            <div className='nz-my-profile-address'>
                <AddressForm
                    key={`${myProfileProps.uniqueName}-address-form`}
                    initialAddress={address}
                    saveButtonLabel={"Save"}
                    onChange={handleAddressChange}
                    onSave={handleAddressSave} />
            </div>
        </div>
    )
}

export { MyProfile }
export default MyProfile
