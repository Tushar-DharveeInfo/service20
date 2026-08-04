import { SettingSubgroups } from "./Feature"
import { FnGenerateUID } from "../shared/allcommon/settingsform/FnGenerateUID"


enum PowerConfigureGroup {
    DiscoveryAndMonitoring = "Discovery and Monitoring"
}
enum PowerConfigureSubGroup {
    DeviceHealth = "Device Health",
    StepTwoInbandIcmp = "Step-2, Inband (ICMP) Discovery Profiles",
    StepTwoInbandTcp = "Step-2, Inband (TCP) Discovery Profiles",
    StepTwoInbandWmi = "Step-2, Inband (WMI) Discovery Profiles",
    StepTwoOutbandIcmp = "Step-2, Outband (ICMP) Discovery Profiles",
    StepTwoOutbandIpmi = "Step-2, Outband (IPMI) Discovery Profiles",
    StepTwoOutbandSnmp = "Step-2, Outband (SNMP) Discovery Profiles",
    StepTwoOutbandSnpmV3 = "Step-2, Outband (SNMPv3) Discovery Profiles",
    StepTwoOutbandSsh = "Step-2, Outband (SSH) Discovery Profiles",
    StepTwoOutbandWsman = "Step-2, Outband (WSMAN) Discovery Profiles",
    StepThreeDeviceEventsAndAlerts = "Step-3, Device Events and Alerts",
    StepThreePredefinedEventsAndAlerts = "Step-3, Predefined Events and Alerts",
    StepFourSelectDcmInstanceAndItsCredentials = "Step-4, Select DCM Instance and its Credentials"
}

const PowerConfigureWithoutProfile = [
    PowerConfigureSubGroup.DeviceHealth.toString(),
    PowerConfigureSubGroup.StepThreePredefinedEventsAndAlerts.toString(),
    PowerConfigureSubGroup.StepFourSelectDcmInstanceAndItsCredentials.toString()
]

const PowerConfigureWithProfile = [
    PowerConfigureSubGroup.StepTwoInbandIcmp.toString(),
    PowerConfigureSubGroup.StepTwoInbandTcp.toString(),
    PowerConfigureSubGroup.StepTwoInbandWmi.toString(),
    PowerConfigureSubGroup.StepTwoOutbandIcmp.toString(),
    PowerConfigureSubGroup.StepTwoOutbandIpmi.toString(),
    PowerConfigureSubGroup.StepTwoOutbandSnmp.toString(),
    PowerConfigureSubGroup.StepTwoOutbandSnpmV3.toString(),
    PowerConfigureSubGroup.StepTwoOutbandSsh.toString(),
    PowerConfigureSubGroup.StepTwoOutbandWsman.toString(),
    PowerConfigureSubGroup.StepThreeDeviceEventsAndAlerts.toString()
]

const SettingWithoutProfile = [
    SettingSubgroups.DCIMStatistics.toString(),
    SettingSubgroups.Information.toString(),
    SettingSubgroups.MobileApp.toString(),
    SettingSubgroups.OfficeAddin.toString(),
    SettingSubgroups.Configure.toString(),
    SettingSubgroups.ServiceCharges.toString(),
    SettingSubgroups.VisioStencilShapeOptions.toString(),
    SettingSubgroups.ScheduleDataArchive.toString(),
    SettingSubgroups.SchedulePurge.toString(),
    SettingSubgroups.ScheduleReportDelivery.toString(),
    SettingSubgroups.ScheduleWindowsService.toString()
]

const SettingWithProfile = [
    SettingSubgroups.BroadcastTemplate.toString(),
    SettingSubgroups.AIGemini.toString(),
    SettingSubgroups.SMTPServer.toString(),
    SettingSubgroups.CloudAWS.toString(),
    SettingSubgroups.CloudAzure.toString(),
    SettingSubgroups.CloudGoogle.toString(),
    SettingSubgroups.DCM.toString(),
    SettingSubgroups.DeviceLibrary.toString(),
    SettingSubgroups.GoogleMap.toString(),
    SettingSubgroups.HyperV.toString(),
    SettingSubgroups.PowerBI.toString(),
    SettingSubgroups.ServiceNow.toString(),
    SettingSubgroups.Twilio.toString(),
    SettingSubgroups.vSphere.toString(),
    SettingSubgroups.Workday.toString(),
    SettingSubgroups.MSSQL.toString(),
    SettingSubgroups.ScheduleSQLJob.toString(),
    SettingSubgroups.CustomIDTemplate.toString(),
    SettingSubgroups.WatermarkTemplate.toString(),
]

const SettingForTreeForm = [
    SettingSubgroups.Report.toString(),
    SettingSubgroups.Alert.toString(),
    SettingSubgroups.ChartTemplate.toString(),
    SettingSubgroups.ReportTemplate.toString(),
]

const SettingForIntegration = [
    SettingSubgroups.AIGemini.toString(),
    SettingSubgroups.SMTPServer.toString(),
    SettingSubgroups.CloudAWS.toString(),
    SettingSubgroups.CloudAzure.toString(),
    SettingSubgroups.CloudGoogle.toString(),
    SettingSubgroups.DCM.toString(),
    SettingSubgroups.DeviceLibrary.toString(),
    SettingSubgroups.GoogleMap.toString(),
    SettingSubgroups.HyperV.toString(),
    SettingSubgroups.PowerBI.toString(),
    SettingSubgroups.ServiceNow.toString(),
    SettingSubgroups.Twilio.toString(),
    SettingSubgroups.vSphere.toString(),
    SettingSubgroups.Workday.toString(),
    SettingSubgroups.MSSQL.toString()
]

const SettingForEntityForm = [
    SettingSubgroups.Api.toString(),
    SettingSubgroups.BackgroundTaskProfile.toString()
]

const SettingHeaderNotRequired = [
    SettingSubgroups.DataCenterInterconnect.toString(),
    SettingSubgroups.Alert.toString(),
    SettingSubgroups.Report.toString()
]

enum RtmLabelForDataCenterHirerarchy {
    AddRoom = 'Add Room',
    AddNewDataCenterSite = 'Add New Data Center Site',
    AddFloor = 'Add Floor',
    EmptyDataCenterSite = 'Empty Data Center Site',
    DeleteDataCenterSite = 'Delete Data Center Site',
    EmptyRoom = 'Empty Room',
    DeleteRoom = 'Delete Room',
    EmptyFloor = 'Empty Floor',
    DeleteFloor = 'Delete Floor',
    EmptyStore = 'Empty Store',
    AddBin = "Add Bin",
    EmptyBin = 'Empty Bin',
    DeleteBin = 'Delete Bin',
    Refresh = 'Refresh'
}

enum RtmLabelForDCI {
    AddDCI = "Add DCI",
    DeleteDciSegment = "Delete DCI Segment"
}

enum EntityNameEnums {
    ReportProfile = "ReportProfile",
    AlertProfile = "AlertProfile",
    AuditSession = "AuditSession",
    AP = "AP",
    Room = "Room",
    Site = "Site",
    Floor = "Floor",
    Bin = "Bin",
    BS = "BS",
    DCI = "DCI",
    Role = "Role",
    LayoutFilterProfile = 'LayoutFilterProfile',
    ChartProfile = 'ChartProfile',
    ApiProfile = "ApiProfile",
    BackgroundTaskProfile = "BackgroundTaskProfile",
    User = "User",
    Partner = "Partner",
    NZLicenseKey = "NZLicenseKey",
    WorkorderProfile = "WorkorderProfile"
}

const RootNode = {
    EntID: FnGenerateUID(),
    Name: "NetZoom Settings",
    Description: "NetZoom Settings",
    NodeType: "Helptip",
    HasChildren: 1,
    children: undefined,
}
enum FeatureState {
    Stopped = -1,
    Running = 0,
    Paused = 1,
}

enum SettingsIntegrationFormUniquName {
    AiGemini = "aigemini",
    CloudAws = "cloudaws",
    CloudAzure = "cloudazure",
    CloudGoogle = "cloudgoogle",
    DbMail = "dbmail",
    Dcm = "dcm",
    DeviceLibrary = "devicelibrary",
    GoogleMap = "googlemap",
    HyperV = "hyperv",
    MSSQL = "mssql",
    PowerBi = "powerbi",
    ServiceNow = "servicenow",
    Twilio = "twilio",
    Vsphere = "vsphere",
    Workday = "workday",
}

enum FileGroupNameEnums {
    Icon = "Icon",
    Report = "Report",
    WM = "WM",
    Other = "Other"
}

enum SettingApNames {
    HideFloorLayout = "HideFloorLayout",
    DateFormat = "DateFormat",
    DiagnosticLevel = "DiagnosticLevel",
    Measurement = "Measurement",
    DisplayTheme = "DisplayTheme",
    HelpTip = "HelpTip",
    maxAudioRecordingTime = "maxAudioRecordingTime",
    maxVideoRecordingTime = "maxVideoRecordingTime"

}

const SettingsToggleControl = {
    Enabled: "Enabled"
}
export {
    SettingWithoutProfile, SettingWithProfile, SettingForTreeForm
    , RtmLabelForDataCenterHirerarchy
    , RtmLabelForDCI
    , EntityNameEnums
    , RootNode
    , SettingHeaderNotRequired
    , FeatureState
    , SettingsIntegrationFormUniquName,
    FileGroupNameEnums,
    PowerConfigureSubGroup,
    PowerConfigureGroup,
    PowerConfigureWithProfile,
    PowerConfigureWithoutProfile,
    SettingForEntityForm,
    SettingForIntegration,
    SettingApNames,
    SettingsToggleControl,
}
