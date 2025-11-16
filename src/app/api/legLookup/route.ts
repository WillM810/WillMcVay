import * as cheerio from "cheerio";
import { count } from "console";
import { url } from "inspector";
import { NextResponse } from "next/server";

const GEO_URL = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=`;
const DIS_URL = `https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Boundaries/DE_Political_Boundaries/MapServer/XX/`+
  `query?f=json&geometryType=esriGeometryPoint&outFields=*&geometry=`;

export async function POST(request: Request) {
  const { address, location, spatialReferenceWkID } = await lookupAddress(request);

  const districtInfo = await lookupDistrict(location, spatialReferenceWkID);

  const senInfo = await legislatorInfo(districtInfo[1].URL);
  const repInfo = await legislatorInfo(districtInfo[2].URL);

  const responsePayload = {
    address,
    location,
    county: districtInfo[3].COUNTY,
    ed: districtInfo[0].RDED.split('-')[1],
    rd: districtInfo[0].DISTRICT,
    sd: districtInfo[1].DISTRICT,
    cd: districtInfo[3].DISTRICT,
    senator: {
      name: districtInfo[1].NAME,
      party: districtInfo[1].PARTY,
      email: senInfo.email.toLocaleLowerCase(),
      photo: senInfo.imgSrc,
      url: districtInfo[1].URL,
    },
    representative: {
      name: districtInfo[2].NAME,
      party: districtInfo[2].PARTY,
      email: repInfo.email.toLocaleLowerCase(),
      photo: repInfo.imgSrc,
      url: districtInfo[2].URL,
    },
    countyCouncil: {
      name: districtInfo[3].COMMISSION,
      title: districtInfo[3].TITLE,
    },
    countyAtLarge: {
      name: districtInfo[3].ATLARGE,
      title: districtInfo[3].TITLE_AL,
    },
  };

  return new NextResponse(JSON.stringify(responsePayload));
}

async function lookupAddress(request: Request) {
  const addressQuery = (await request.json()).address;

  const geoResponse = await fetch(`${GEO_URL}${encodeURIComponent(addressQuery)}`);
  const geoData = await geoResponse.json();

  const address = geoData.candidates[0].address;
  const location = geoData.candidates[0].location;
  const spatialReferenceWkID = geoData.spatialReference.wkid;

  return { address, location, spatialReferenceWkID };
}

async function lookupDistrict(location: { x: number; y: number }, wkID: number) {
  const layerData = await Promise.all([0, 1, 2, 3].map(async (layer) => {
    const response = await fetch(`${DIS_URL.replace('XX', layer.toString())}${location.x},${location.y}&inSR=${wkID}`);
    const data = await response.json();
    return data.features[0].attributes;
  }));

  return layerData;
}

async function legislatorInfo(url: string) {
  const response = await fetch(url);
  const data = await response.text();
  const $ = cheerio.load(data);
  const mailtoLink = $('a[href^="mailto:"]').attr('href');
  const email = mailtoLink?.replace('mailto:', '') || 'N/A';
  const imgSrc = $('img.img-avatar').attr('src') || '';
  const ret = { email, imgSrc };
  return ret;
}