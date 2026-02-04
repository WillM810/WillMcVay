'use client';

import { useState } from "react";
import clsx from "clsx";

import OSVG from "@/components/TicTacToe/ui/OSVG";
import XSVG from "@/components/TicTacToe/ui/XSVG";

const borders = [
    'border-b border-r',
    'border-b border-r border-l',
    'border-b border-l',
    'border-t border-r border-b',
    'border',
    'border-t border-l border-b',
    'border-t border-r',
    'border-t border-r border-l',
    'border-t border-l',
];

const winConditions = [
    [ 0, 1, 2 ],
    [ 3, 4, 5 ],
    [ 6, 7, 8 ],
    [ 0, 3, 6 ],
    [ 1, 4, 7 ],
    [ 2, 5, 8 ],
    [ 0, 4, 8 ],
    [ 2, 4, 6 ],
];

export default function TicTacToePage() {
    const [board, setBoard] = useState(Array.from({ length: 9 }).fill('-') as string[]);
    const [xTurn, setXTurn] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [isTie, setIsTie] = useState(false);

    function play(idx: number) {
        if (gameOver) return;
        if (board[idx] !== '-') return;

        const newBoard = Array.from(board);
        newBoard[idx] = xTurn ? 'x' : 'o';
        setBoard(newBoard);

        const win = winConditions.find(winPredicate(newBoard));
        const tie = !win && !newBoard.some(v => v === '-');
        setIsTie(tie)

        if (!win && !tie)
            setXTurn(!xTurn);
        else
            setGameOver(true);
    }

    function reset() {
        setBoard(Array.from({ length: 9 }).fill('-') as string[]);
        setXTurn(true);
        setGameOver(false);
        setIsTie(false);
    }

    function isWinner(idx: number) {
        if (isTie || !gameOver) return false;

        const win = winConditions.find(winPredicate(board));
        if (!win) return false;

        return win.includes(idx);
    }

    function winPredicate(board: string[]) {
        return (c: number[]) => board[c[0]] === board[c[1]] && board[c[1]] === board[c[2]] && board[c[0]] !== '-';
    }
    
    return (
        <div className="m-4">
            <h1 className="text-2xl font-bold mb-2">TicTacToe</h1>
            <div className="grid grid-cols-3 grid-rows-3 w-3xs">
                { Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "aspect-square flex items-center justify-center text-xl font-semibold cursor-pointer",
                            isWinner(i) ? 'bg-green-300' : 'bg-slate-200',
                            borders[i],
                        )}
                        onClick={() => play(i)}
                    >
                        {
                            board[i] === 'x' ? <XSVG /> :
                                board[i] === 'o' ? <OSVG /> :
                                    <></>
                        }
                    </div>
                ))}
            </div>
            <div className="w-3xs mt-4 grid grid-cols-3 grid-rows-1">
                <div></div>
                <div
                    onClick={() => reset()}
                    className={clsx(
                        `aspect-square flex items-center justify-center text-xl font-semibold border cursor-wait`,
                        `${isTie ? 'bg-yellow-300' : gameOver ? 'bg-green-300' : 'bg-slate-200'}`,
                    )}
                >
                    { xTurn ? <XSVG /> : <OSVG /> }
                </div>
                <div className="flex items-center justify-center text-lg font-bold">
                    { isTie ? 'TIE' : gameOver && xTurn ? 'X WINS' : gameOver ? 'O WINS' : '' }
                </div>
            </div>
        </div>
    );
}