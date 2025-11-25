type MapEmbedProps = {
    lat: number;
    lon: number;
};

export default function MapEmbed({ lat, lon }: MapEmbedProps) {
    const mapSrc = `https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

    return (
        <div className="w-full h-64 rounded overflow-hidden shadow">
            <iframe
                title="Location Map"
                src={mapSrc}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                className="border-0"
            ></iframe>
        </div>
    );
}
