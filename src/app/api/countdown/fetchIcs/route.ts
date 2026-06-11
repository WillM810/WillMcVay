import { isPublicHost } from "@/utils/SecurityUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(new URL(request.url).searchParams.get("icsUrl") ?? "");
    if (url.protocol !== "https:") return NextResponse.json({ error: "HTTPS only", status: 400 });
    if (!await isPublicHost(url.hostname)) return NextResponse.json({ error: "Private IP detected", status: 400 });

    const res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(5000),
        redirect: "follow",
    });

    if (!res.ok) return NextResponse.json({ error: "Unable to fetch", status: res.status });

    const text = await res.text();

    if (!text.includes("BEGIN:VCALENDAR")) return NextResponse.json({ error: "Invalid ICS", status: 400 });

    const allEvents = text.split('\r\n').reduce((d, l, i, a) => {
        const [ key, ...valueParts ] = l.split(':');
        const value = valueParts.join(':');

        if (!d.version && key !== "VERSION") return d;
        if (key === "VERSION") return { ...d, version: value };

        if (!d.calName && key !== "X-WR-CALNAME") return d;
        if (key === "X-WR-CALNAME") return { ...d, calName: value };

        if (!d.tzid && key !== "TZID") return d;
        if (key === "TZID") return { ...d, tzid: value };

        if (key !== "BEGIN" || value !== "VEVENT") return d;

        const dateParser = (d: string, exclude: boolean) => new Date(
            parseInt(d.slice(0, 4)),
            parseInt(d.slice(4, 6)) - 1,
            parseInt(d.slice(6, 8)) - (d.length > 8 || !exclude ? 0 : 1),
            // d.length > 8 ? parseInt(d.slice(9, 11)) : 0,
            // d.length > 8 ? parseInt(d.slice(11, 13)) : 0
        );

        const singleEvent = {} as any;
        for (let offset=0; a[i+offset] !== "END:VEVENT"; offset++) {
            if (a[i+offset].includes("UID")) singleEvent.uid = a[i+offset].split(':')[1];
            if (a[i+offset].includes("DTSTART")) singleEvent.start = dateParser(a[i+offset].split(':')[1], false).getTime();
            if (a[i+offset].includes("DTEND")) singleEvent.end = dateParser(a[i+offset].split(':')[1], true).getTime();
            if (a[i+offset].includes("SUMMARY")) singleEvent.label = a[i+offset].split(':')[1];
            if (a[i+offset].includes("DESCRIPTION")) singleEvent.desc = a[i+offset].split(':')[1];
        }

        return { ...d, events: [ ...d.events, singleEvent ] };
    }, { events: [], tzOffset: new Date().getTimezoneOffset() } as any);
    return NextResponse.json(allEvents);
}