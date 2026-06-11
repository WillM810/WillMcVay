export type ICSImportResponse = {
    version: string;
    calName: string;
    tzOffset: number;
    events: {
        label: string;
        start: number;
        end: number;
        uid: string;
    }[]
};