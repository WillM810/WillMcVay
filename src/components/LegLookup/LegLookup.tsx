"use client";

import { useState } from "react";
import TextInput from "../Utils/TextInput";
import PrimaryButton from "../Utils/PrimaryButton";
import MapEmbed from "../MapEmbed";

type LegLookupResponse = {
  address: string;
  location: { x: number; y: number };
  county: string;
  ed: string;
  rd: string;
  sd: string;
  cd: string;
  senator: {
    name: string;
    party: string;
    email: string;
    photo: string;
    url: string;
  };
  representative: {
    name: string;
    party: string;
    email: string;
    photo: string;
    url: string;
  };
  countyCouncil: {
    name: string;
    title: string;
  };
  countyAtLarge: {
    name: string;
    title: string;
  };
} | null;

export default function LegLookup() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null as LegLookupResponse);

  async function lookupAddress() {
    setLoading(true);
    setData(null);
    const response = await fetch('/api/legLookup', {
      method: 'POST',
      body: JSON.stringify({ address }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setData(await response.json());
    setLoading(false);
  }

  return (
    <div className="p-5 sm:p-10">
      <h1 className="font-bold text-2xl mb-2">Legislator Lookup</h1>
      <div className="flex flex-nowrap justify-between">
        <TextInput
          id="leg-lookup-address"
          placeholder="Enter Delaware Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onEnter={lookupAddress}
        />
        <PrimaryButton onClick={lookupAddress} disabled={loading}>
          Lookup
        </PrimaryButton>
      </div>
      {data && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h2 className="font-semibold text-lg">{data.address}, {data.county} County</h2>
          <div className="mb-8">
            { Math.abs(data.location.y).toFixed(2)+(data.location.y > 0 ? 'N' : 'S') },{ ' ' }
            { Math.abs(data.location.x).toFixed(2)+(data.location.x > 0 ? 'E' : 'W') }
          </div>
          <div className="flex flex-wrap justify-between gap-4 mb-12">
            <div id="sen" className="flex items-start gap-4 flex-1 min-w-[320px] max-w-[40%]">
              <img
                src={data.senator.photo}
                alt="Senator Photo"
                className="h-24 w-auto rounded"
              />

              <div>
                <h3 className="font-semibold">
                  Senator:{ ' ' }
                  <span className="whitespace-nowrap">{data.senator.name} ({data.senator.party}-{data.sd})</span>
                </h3>
                <p>Email: {data.senator.email}</p>
                <a
                  href={data.senator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Legislator Profile
                </a>
              </div>
            </div>
            <div id="rep" className="flex items-start gap-4 flex-1 min-w-[320px] max-w-[40%]">
              <img
                src={data.representative.photo}
                alt="Representative Photo"
                className="h-24 w-auto rounded"
              />

              <div>
                <h3 className="font-semibold">
                  Representative:{ ' ' }
                  <span className="whitespace-nowrap">{data.representative.name} ({data.representative.party}-{data.rd})</span>
                </h3>
                <p>Email: {data.representative.email}</p>
                <a
                  href={data.representative.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Legislator Profile
                </a>
              </div>
            </div>
          </div>
          <div className="mb-12 px-5">
            <h3 className="font-semibold">County Officials</h3>
            <p>
              {data.countyCouncil.title}{ ' ' }
              <span className="whitespace-nowrap">{data.countyCouncil.name} <span className="italic">(District {data.cd})</span></span>
            </p>
            <p>
              {data.countyAtLarge.title}{ ' ' }
              <span className="whitespace-nowrap">{data.countyAtLarge.name} <span className="italic">(At-Large)</span></span></p>
          </div>
          <MapEmbed lat={data.location.y} lon={data.location.x} />
        </div>
      )}
    </div>
  );
}