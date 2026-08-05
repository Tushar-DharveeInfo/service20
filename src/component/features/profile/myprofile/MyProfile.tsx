
import { useMemo } from 'react'
import '../../allcss/profile/MyProfile.css'
import { Label } from '../../../shared/basic/label/Label.tsx'
import { SettingsLibForm } from '../../../shared/settingsform/settingslibform/SettingsLibForm.tsx'
import { useMainAppContext } from '../../../shared/context/hooks/MainAppHooks.ts'
import { sampleUserAddress, sampleUserProfile } from '../../../../sampledata/features/MyProfileSampleData.ts'
import { myProfileControls } from '../../../../sampledata/features/MyProfileControls.ts'
import { FnBuildMyProfileProfileString } from './FnBuildMyProfileProfileString.ts'
import { IMyProfile } from '../../allinterface/profile/IMyProfile.ts'

const MyProfile = (myProfileProps: IMyProfile) => {
    const mainAppContext = useMainAppContext();
    const headerTitle = myProfileProps.headerText ?? "My Profile";

    const authUser = useMemo(() => {
        if (mainAppContext.authSession) {
            return mainAppContext.authSession;
        }

        return {
            tenantNickname: sampleUserProfile.CompanyName,
            username: sampleUserProfile.LoginUserName,
            displayName: sampleUserProfile.DisplayName,
            email: sampleUserProfile.LoginUserEmail,
            phoneNumber: sampleUserProfile.Phone,
        };
    }, [mainAppContext.authSession]);

    const profileString = useMemo(
        () => FnBuildMyProfileProfileString(authUser, sampleUserAddress),
        [authUser]
    );

    const handleSaveProfile = () => {
        // SAMPLE DATA: EM.AddUpdateTableRecord for the user address is not called.
        myProfileProps.handleShowUserMessage?.("Profile address saved.");
    };

    return (
        <div key={myProfileProps.uniqueName} className='nz-my-profile-container nz-wh-100'>
            <div className='nz-sub-header'>
                <Label
                    uniqueName={`${myProfileProps.uniqueName}-header`}
                    label={headerTitle}
                    fontWeight='600' />
            </div>
            <div className='nz-my-profile-form'>
                <SettingsLibForm
                    id={`${myProfileProps.uniqueName}-profile`}
                    uniqueName={`${myProfileProps.uniqueName}-profile-form`}
                    controls={myProfileControls}
                    profileString={profileString}
                    featureId={myProfileProps.featureId}
                    allowShowHeader={false}
                    allowShowSectionHeader={true}
                    isDisableForm={false}
                    isAddressFormRequired={true}
                    isAutoSave={false}
                    handleSaveForm={handleSaveProfile} />
            </div>
        </div>
    )
}

export { MyProfile }
export default MyProfile
