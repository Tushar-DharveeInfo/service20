import type { INoteItems } from "../../component/shared/allinterface/sidebar/IFqaNotes";

const sampleNotesItems: INoteItems[] = [
    {
        EntityName: "test",
        LastUpdated: "2026-07-28T09:30:00.000Z",
        NodeType: "test",
        NotesMAX: "test inspection completed for Test 1.",
        NotesType: "Message",
        UserName: "demo.user",
    },
    {
        EntityName: "test",
        LastUpdated: "2026-07-27T15:10:00.000Z",
        NodeType: "test",
        NotesMAX: "Need to verify cooling near Rack1.",
        NotesType: "Message",
        UserName: "ops.oncall",
    },
    {
        EntityName: "test",
        LastUpdated: "2026-07-26T11:05:00.000Z",
        NodeType: "test",
        NotesMAX: "Photo attachment placeholder for layout.",
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
                FileName: "test-note",
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
