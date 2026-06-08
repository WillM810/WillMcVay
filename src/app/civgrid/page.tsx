'use client';

import { HexOutlineSVG } from "@/components/CivGrid/ui/HexSVG";
import React from "react";

export default function CivGridPage() {
    function clickGrid(i: number, j: number) {
        console.log(i, j);
    }

    // const cols = 20, rows = 20;
    const size = 40 // px
    const cols = 20
    const rows = 20

    return (
        <div>
            <div>CivGrid</div>

            <div
                className="grid justify-center"
                style={{
                    gridTemplateColumns: `repeat(${cols * 2}, ${size / 2}px)`,
                    gridAutoRows: `${size * 0.75}px`
                }}
            >
                {Array.from({ length: rows }).map((_, row) =>
                    Array.from({ length: cols }).map((_, col) => {
                        const colStart = col * 2 + (row % 2)

                        return (
                            <div
                                key={`${row}-${col}`}
                                onClick={() => clickGrid(row, col)}
                                className="col-span-2"
                                style={{
                                    gridColumnStart: colStart + 1,
                                    height: `${size}px`,
                                    width: `${size}px`
                                }}
                            >
                                <HexOutlineSVG className="w-full h-full text-slate-400 hover:text-red-500 transition-colors cursor-pointer" />
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}