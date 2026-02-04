"use client";

import { useEffect, useState } from "react";

class World {
    worldSize: number = 64;
    chunks: Chunk[] = [];
    workers: Resource[] = [];
    jobs: Job[] = [];
    lastTick: number = Date.now();

    constructor() {}

    doTick() {
        if (Date.now() - this.lastTick < 1000) return false;

        const tickResult = this.chunks.map(c => {
            const workers = c.resources.find(r => r.name === 'Worker')?.amount ?? 0;
            if (workers) {
                c.consumeResources([{ name: 'Worker', amount: workers }]);
                if (this.workers.length) this.workers[0].amount += workers;
                else this.workers.push({ name: 'Science', amount: workers });
            }
            return c.doTick();
        });
        this.lastTick = Date.now();

        return true;
    }

    getChunkNeighbors(idx: number) {
        const neighbors = [idx-1, idx, idx+1]
        if (idx + this.worldSize < this.chunks.length) neighbors.push(idx + this.worldSize);
        if (idx + this.worldSize + 1 < this.chunks.length) neighbors.push(idx + this.worldSize + 1);
        if (idx - this.worldSize >= 0) neighbors.push(idx - this.worldSize);
        if (idx - this.worldSize - 1 >= 0) neighbors.push(idx - this.worldSize - 1);
        return neighbors;
    }

    dup() {
        const c = new World();
        c.chunks = this.chunks;
        c.workers = this.workers;
        c.jobs = this.jobs;
        c.lastTick = this.lastTick;

        return c;
    }
}

class Chunk {
    resources: Resource[] = [];
    activeJobs: Job[] = [];
    coords: { x: number, y: number } = { x: 0, y: 0 };

    constructor() {}

    toString = () => JSON.stringify(this.resources);

    doTick() {
        return this.activeJobs.map(j => {
            if (!this.checkResources(j.requirements) || !this.checkResources(j.consumes)) {
                this.activeJobs = this.activeJobs.filter(rj => rj !== j);
                return { job: j, chunk: this, success: false };
            }

            this.consumeResources(j.consumes);
            this.createResources(j.creates);
            return { job: j, chunk: this, success: true };
        });
    }

    checkResources(resourcesNeeded: Resource[]) {
        return resourcesNeeded.reduce((p, c) => {
            return p && ((this.resources.find(r => r.name === c.name)?.amount ?? 0) >= c.amount);
        }, true);
    }

    consumeResources(resourcesConsumed: Resource[]) {
        if (!this.checkResources(resourcesConsumed)) return false;
        resourcesConsumed.forEach(r => this.resources.find(n => n.name === r.name)!.amount -= r.amount);
        return true;
    }

    createResources(resourcesCreated: Resource[]) {
        resourcesCreated.forEach(r => {
            if (!this.resources.find(n => n.name === r.name)) this.resources.push({ name: r.name, amount: r.amount });
            else this.resources.find(n => n.name === r.name)!.amount += r.amount;
        });
    }

    canStartJob(job: Job) {
        let meetsReqs;

        this.activeJobs.forEach(j => this.consumeResources(j.requirements));
        
        if (!this.checkResources(job.requirements) || !this.checkResources(job.consumes)) meetsReqs = false;
        else meetsReqs = true;
        
        this.activeJobs.forEach(j => this.createResources(j.requirements));

        return meetsReqs;
    }

    startJob(job: Job) {
        if (!this.canStartJob(job)) return false;
        
        this.activeJobs.push(job);
        return true;
    }
}

class Resource {
    name: string = '';
    amount: number = 0;
}

class Job {
    requirements: Resource[] = [];
    consumes: Resource[] = [];
    creates: Resource[] = [];
    time: number = 1;
}

const gatherFoodJob: Job = {
    requirements: [],
    consumes: [{ name: 'Worker', amount: 1 }],
    creates: [{ name: 'Food', amount: 2 }],
    time: 1
};

const gatherWoodJob: Job = {
    requirements: [],
    consumes: [{ name: 'Worker', amount: 1 }],
    creates: [{ name: 'Wood', amount: 2 }],
    time: 1
};

const gatherStoneJob: Job = {
    requirements: [],
    consumes: [{ name: 'Worker', amount: 1 }],
    creates: [{ name: 'Stone', amount: 2 }],
    time: 1
};

const supportWorkerJob: Job = {
    requirements: [{ name: 'Camp', amount: 1 }],
    consumes: [
        { name: 'Food', amount: 10 },
        { name: 'Wood', amount: 5 },
        { name: 'Stone', amount: 2 },
    ],
    creates: [{ name: 'Worker', amount: 10 }],
    time: 1
};

export default function CivClickerPage() {
    const [world, setWorld] = useState(new World());
    
    useEffect(() => {
        // World Setup
        world.chunks.push(new Chunk());

        world.chunks[0].resources.push({ name: 'Food', amount: 10 });
        world.chunks[0].resources.push({ name: 'Wood', amount: 10 });
        world.chunks[0].resources.push({ name: 'Stone', amount: 10 });

        world.chunks[0].resources.push({ name: 'Camp', amount: 1 });

        world.jobs = [ supportWorkerJob, gatherStoneJob, gatherWoodJob, gatherFoodJob ];

        world.chunks[0].activeJobs.push(supportWorkerJob);

        world.chunks[0].activeJobs.push(gatherFoodJob);
        world.chunks[0].activeJobs.push(gatherFoodJob);
        world.chunks[0].activeJobs.push(gatherFoodJob);
        world.chunks[0].activeJobs.push(gatherFoodJob);
        world.chunks[0].activeJobs.push(gatherFoodJob);

        world.chunks[0].activeJobs.push(gatherWoodJob);
        world.chunks[0].activeJobs.push(gatherWoodJob);
        world.chunks[0].activeJobs.push(gatherWoodJob);

        world.chunks[0].activeJobs.push(gatherStoneJob);

        // Start Clock
        const tickInterval = setInterval(() => {
            if (world.doTick()) setWorld(w =>  w.dup());
        }, 100);

        return () => clearInterval(tickInterval);
    }, []);


    return (
        <div className="dark:bg-gray-900 dark:text-gray-200 h-screen">
            {world.chunks.map(c =>
                <span style={{display: 'block'}} key={c.toString()}>
                    {c.resources.map(r => <span style={{display: 'block'}} key={r.name}>{r.name}: {r.amount}</span>)}
                    {c.activeJobs.map(j => j.creates.map(r =>
                        <span className="dark: text-gray-700 block" key={r.name} onClick={() => c.activeJobs.splice(c.activeJobs.findIndex(rj => rj === j), 1)}>{r.name}: {r.amount}</span>
                    ))}
                    {
                        world.jobs.filter(j => c.canStartJob(j))
                            .map(j => j.creates.map(r =>
                                <span className="dark:text-gray-500 italic block" onClick={() => c.startJob(j)} key={r.name}>{r.name}: {r.amount}</span>
                            )
                        )
                    }
                </span>
            )}
            <br/>
            Science: {world.workers[0]?.amount}
        </div>
    );
}