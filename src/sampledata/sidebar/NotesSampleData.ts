import type { INoteItems } from "../../component/shared/allinterface/sidebar/IFqaNotes";

const sampleNotesItems: INoteItems[] = [
    {
        EntityName: "Site",
        LastUpdated: "2026-07-28T09:30:00.000Z",
        NodeType: "Site",
        NotesMAX: "Site inspection completed for Bay Room 1.",
        NotesType: "Message",
        UserName: "demo.user",
    },
    {
        EntityName: "Site",
        LastUpdated: "2026-07-27T15:10:00.000Z",
        NodeType: "Site",
        NotesMAX: "Need to verify cooling near Rack1.",
        NotesType: "Message",
        UserName: "ops.oncall",
    },
    {
        EntityName: "Site",
        LastUpdated: "2026-07-26T11:05:00.000Z",
        NodeType: "Site",
        NotesMAX: "Photo attachment placeholder for floor layout.",
        NotesType: "Message",
        UserName: "demo.user",
    },
];

const sampleNotesEntityRecordsResponse = JSON.stringify({
    EntityRecords: [
        {
            Dataset: {
                "PG.Notes": sampleNotesItems,
            },
        },
    ],
});

const sampleNotesFileProfileResponse = {
    propertyJson: JSON.stringify({
        "PG.FileProfile": [
            {
                FileUID: "sample-file-uid-001",
                FileName: "floor-note",
                Extension: "png",
                FileType: "image",
            },
        ],
    }),
};

export {
    sampleNotesEntityRecordsResponse,
    sampleNotesFileProfileResponse,
};
