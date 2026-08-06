
import { useEffect, useState } from 'react'
import '../../allcss/profile/MyActivities.css'
import { Label } from '../../../shared/basic/label/Label.tsx'
import { ForensicLog } from '../../../shared/sidebar/forensiclog/ForensicLog.tsx'
import { IMyActivities } from '../../allinterface/profile/IMyActivities.ts'

/* Profile/MyActivities is the forensic log scoped to the logged in user,
   so it reuses the same ForensicLog the sidebar renders with loginType "user". */
const MyActivities = (myActivitiesProps: IMyActivities) => {
    const defaultHeaderText = myActivitiesProps.headerText ?? "My Activities";
    const [headerTitle, setHeaderTitle] = useState<string>(defaultHeaderText);

    useEffect(() => {
        setHeaderTitle(defaultHeaderText);
    }, [defaultHeaderText]);

    /* ForensicLog appends the active filter summary to the header. */
    const handleUpdateHeaderTitle = (title: string) => {
        setHeaderTitle(title.length ? title : defaultHeaderText);
    };

    return (
        <div key={myActivitiesProps.uniqueName} className='nz-my-activities-container nz-wh-100'>
            <div className='nz-sub-header'>
                <Label
                    uniqueName={`${myActivitiesProps.uniqueName}-header`}
                    label={headerTitle}
                    fontWeight='600' />
            </div>
            <div className='nz-my-activities-content'>
                <ForensicLog
                    uniqueName={`${myActivitiesProps.uniqueName}-forensic-log`}
                    featureId={myActivitiesProps.featureId}
                    isSetting={true}
                    loginType={'user'}
                    hideSearchControl={true}
                    allowSort={myActivitiesProps.allowSort ?? true}
                    handleUpdateHeaderTitle={handleUpdateHeaderTitle}
                    handleShowUserMessage={myActivitiesProps.handleShowUserMessage} />
            </div>
        </div>
    )
}

export { MyActivities }
export default MyActivities
