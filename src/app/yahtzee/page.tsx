"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type Player = {
    id: number;
    name: string;
    scores: number[];
}

const diceMap = [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1]
];

const scoreList = [
    'Ones',
    'Twos',
    'Threes',
    'Fours',
    'Fives',
    'Sixes',
    'Sub-Total',
    'Bonus',
    'Upper Total',
    '3-of-a-Kind',
    '4-of-a-Kind',
    'Full House',
    'Small Straight',
    'Large Straight',
    'Yahtzee',
    'Chance',
    'Lower Total',
    'Upper Total',
    'Total'
];

const buttonStyleClasses = [
    'inline-flex',
    'items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
    'transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
];

const primaryButtonClasses = [
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600'
];

const secondaryButtonClasses = [
    'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600'
];

const textInputClasses = [
    "bg-white dark:bg-slate-900",
    "border-slate-300 dark:border-slate-700",
    "text-slate-900 dark:text-slate-100",
    "placeholder-slate-400 dark:placeholder-slate-500",
    "focus:ring-blue-500 w-full mb-4"
]

export default function YahtzeePage() {
    const [playerList, setPlayerList] = useState([] as Player[]);
    const [editPlayerName, setEditPlayerName] = useState('');
    const [addingPlayer, setAddingPlayer] = useState(false);

    const [activeScoreCard, setActiveScoreCard] = useState(-1);

    const [gameStarted, setGameStarted] = useState(false);
    const [activeTurn, setActiveTurn] = useState(-1);

    const [diceValues, setDiceValues] = useState([] as number[]);
    const [selectedDice, setSelectedDice] = useState(Array.from({ length: 5 }).fill(true) as boolean[]);
    const [remainingRolls, setRemainingRolls] = useState(3);

    const [diceTimeout, setDiceTimeout] = useState(false);

    const playerNameRef = useRef<HTMLInputElement>(null);

    function addPlayer() {
        setActiveScoreCard(0);
        setPlayerList(list => [ ...list, { id: list.length, name: editPlayerName, scores: Array.from({ length: 19 }) as number[] } ]);
    }

    useEffect(() => {
        if (addingPlayer && playerNameRef.current) playerNameRef.current.focus();
    }, [addingPlayer]);

    function stopAddingPlayer() {
        setEditPlayerName('');
        setAddingPlayer(false);
    }

    function handleNameKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            addPlayer();
            e.preventDefault();
            stopAddingPlayer();
        } else if (e.key === 'Escape') {
            stopAddingPlayer();
        }
    }

    function handlePlayerClick(p: Player) {
        if (!gameStarted) setPlayerList(l => l.filter(pl => pl !== p));
        else setActiveScoreCard(playerList.findIndex(pl => pl === p));
    }

    function diceButton() {
        if (!gameStarted) startGame();
        else if (activeTurn !== activeScoreCard) setActiveScoreCard(activeTurn);
        else rollDice();
    }

    function startGame() {
        setGameStarted(true);
        setActiveScoreCard(0);
        setActiveTurn(0);
    }

    function rollDice() {
        const newValues = Array.from({ length: 5 }) as number[];
        for (let i=0; i<5; i++) {
            if (selectedDice[i]) newValues[i] = Math.floor(6*Math.random()) + 1;
            else newValues[i] = diceValues[i];
        }
        setDiceValues(newValues);
        if (remainingRolls > 1) {
            setDiceTimeout(true);
            setTimeout(() => setDiceTimeout(false), 5000);
        }
        setRemainingRolls(p => p - 1);
    }

    function diceButtonLabel() {
        if (!gameStarted) return 'Start Game';
        if (activeScoreCard === activeTurn) return `${diceTimeout ? '...' : ''}Roll (${remainingRolls})${diceTimeout ? '...' : ''}`;
        return 'Reload Score Card';
    }

    function isDiceDisabled() {
        if (!gameStarted) return !playerList.length;
        return remainingRolls === 0 || diceTimeout;
    }

    function scoreDice(scoreIdx: number) {
        if (!diceValues.length) return 0;
        switch (scoreIdx) {
            case 0: case 1: case 2: case 3: case 4: case 5:
                return diceValues.reduce((p, c) => c === (scoreIdx + 1) ? p + (scoreIdx + 1) : p, 0);
            case 6: case 7: case 8: case 16: case 17: case 18:
                return '';
            case 9:
                return [1, 2, 3, 4, 5, 6].map(v => diceValues.reduce((p, c) => p += c === v ? 1 : 0, 0)).some(c => c >= 3) ? diceValues.reduce((p, c) => p + c, 0) : 0;
            case 10:
                return [1, 2, 3, 4, 5, 6].map(v => diceValues.reduce((p, c) => p += c === v ? 1 : 0, 0)).some(c => c >= 4) ? diceValues.reduce((p, c) => p + c, 0) : 0;
            case 11:
                const fhCount = [1, 2, 3, 4, 5, 6].map(v => diceValues.reduce((p, c) => p += c === v ? 1 : 0, 0));
                return fhCount.some(v => v === 2) && fhCount.some(v => v === 3) ? 25 : 0;
            case 12:
                return [
                    [ 1, 2, 3, 4 ],
                    [ 2, 3, 4, 5 ],
                    [ 3, 4, 5, 6 ]
                ].some(seq => !seq.some(v => !diceValues.includes(v))) ? 30 : 0;
            case 13:
                return [
                    [ 1, 2, 3, 4, 5 ],
                    [ 2, 3, 4, 5, 6 ]
                ].some(seq => !seq.some(v => !diceValues.includes(v))) ? 40 : 0;
            case 14:
                return diceValues.some(v => v !== diceValues[0]) ? 0 : 50;
            case 15:
                return diceValues.reduce((p, c) => p + c, 0);
            default:
                return 0;
        }
    }

    function claimScore(idx: number) {
        const score = scoreDice(idx);
        if (isNaN(score as number)) return;
        const listUpdate = Array.from(playerList);
        listUpdate[activeTurn].scores[idx] = score as number;
        updateTotals(listUpdate[activeTurn]);
        setPlayerList([...listUpdate]);
        setSelectedDice(Array.from({ length: 5 }).fill(true) as boolean[]);
        setDiceValues([]);
        setRemainingRolls(3);
        setActiveTurn(p => (p + 1) % playerList.length);
        setActiveScoreCard(p => (p + 1) % playerList.length);
    }

    function updateTotals(player: Player) {
        player.scores[6] = player.scores.slice(0, 6).reduce((p, c) => p + (c || 0), 0);
        if (player.scores[6] >= 63) player.scores[7] = 35;
        else player.scores[7] = 0;
        player.scores[8] = player.scores[6] + player.scores[7];
        player.scores[17] = player.scores[8];
        player.scores[16] = player.scores.slice(9, 16).reduce((p, c) => p + (c || 0), 0);
        player.scores[18] = player.scores[16] + player.scores[17];
    }

    return (
        <div className="w-screen h-screen dark:bg-gray-700 dark:text-gray-200 p-4">
            <div className="flex w-full h-full justify-between">
                <div className="w-[70%] flex flex-col">
                    <div className="border w-full text-4xl font-bold">Yahtzee</div>
                    <div className="flex-1 flex justify-between">
                        <div className="w-[30%] border p-4">
                            {
                                playerList.map((p, pIdx) =>
                                    <button
                                        className={clsx(
                                            buttonStyleClasses,
                                            pIdx === activeScoreCard ? secondaryButtonClasses : primaryButtonClasses,
                                            'w-full mb-4',
                                            pIdx === activeTurn && 'italic',
                                        )}
                                        key={p.id}
                                        onClick={() => handlePlayerClick(p)}
                                    >
                                        {p.name}
                                    </button>
                                )
                            }
                            { addingPlayer && <input
                                className={clsx(textInputClasses)}
                                ref={playerNameRef}
                                value={editPlayerName}
                                onChange={(e) => setEditPlayerName(e.target.value)}
                                onKeyDown={handleNameKey}
                            /> }
                            { !gameStarted && <button className={clsx(buttonStyleClasses, primaryButtonClasses, 'w-full')} onClick={() => setAddingPlayer(true)}>Add Player</button> }
                        </div>
                        <div className="w-[70%] border p-8">
                            <div>{!gameStarted ? '' : playerList[activeScoreCard].name} Score Card</div>
                            <hr className="m-8" />
                            { scoreList.map((v, i) => (
                                <div key={i} className={clsx(
                                    "flex justify-between",
                                    (i === 6 || i === 9 || i === 16) && 'border-t mt-4 pt-4'
                                )}>
                                    <div className="w-30">{v}</div>
                                    {
                                        diceValues.length && activeScoreCard === activeTurn && playerList[activeTurn].scores[i] === undefined ?
                                            <div onClick={() => claimScore(i)} className="hover:underline cursor-pointer">{scoreDice(i)}</div> :
                                                <></>
                                    }
                                    <div>{playerList[activeScoreCard]?.scores[i] ?? '-'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-[30%] border p-8">
                    <div className="grid grid-cols-3 grid-rows-3 gap-4 mb-16">
                        {
                            Array.from({ length: 9 }).map((_, i) => (i % 2) ? <div key={i}></div> :
                                <div className="text-center" key={i}>
                                    <div
                                        onClick={() => setSelectedDice(p => p.map((v, id) => id === i/2 ? !v : v))}
                                        className="border rounded-2xl aspect-square items-center justify-center mb-2 grid grid-rows-3 grid-cols-3 p-3 align-text-top cursor-pointer"
                                    >
                                        { !diceValues.length ? '' :
                                            Array.from({ length: 9 }).map((_, j) => !!diceMap[diceValues[i/2]-1][j] ? <div key={j} className="text-2xl align-text-top pb-2">●</div> : <div key={j}></div>)}
                                    </div>
                                    <input
                                        checked={selectedDice[i/2]}
                                        onChange={() => setSelectedDice(p => p.map((v, id) => id === i/2 ? !v : v))}
                                        type="checkbox"
                                    />
                                </div>
                            )
                        }
                    </div>
                    <button
                        className={clsx(buttonStyleClasses, primaryButtonClasses, 'w-full')}
                        disabled={isDiceDisabled()}
                        onClick={() => diceButton()}
                    >{diceButtonLabel()}</button>
                </div>
            </div>
        </div>
    );
}