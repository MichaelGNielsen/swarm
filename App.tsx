
import React, { useRef, useEffect, useState } from 'react';
import { useSwarmSimulation } from './hooks/useSwarmSimulation';
import { WaspIcon, BeeIcon } from './components/Icons';
import type { Boid } from './types';

const Insect: React.FC<{ boid: Boid, children: React.ReactNode }> = ({ boid, children }) => {
    return (
        <div
            className="absolute"
            style={{
                width: `${boid.size}px`,
                height: `${boid.size}px`,
                left: -boid.size / 2,
                top: -boid.size / 2,
                transform: `translate(${boid.position.x}px, ${boid.position.y}px) rotate(${boid.angle}deg)`,
                transition: 'transform 16ms linear',
            }}
        >
            {children}
        </div>
    );
};


const App: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const { wasps, bees } = useSwarmSimulation(dimensions.width, dimensions.height);

    return (
        <main
            ref={containerRef}
            className="relative w-screen h-screen bg-gradient-to-br from-sky-800 via-slate-900 to-black"
        >
            <div className="absolute top-4 left-4 text-white p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-yellow-300">Swarm Simulator</h1>
                <p className="text-slate-300">3 wasps pursued by swarms of bees.</p>
            </div>
            {wasps.map((wasp) => (
                <Insect key={wasp.id} boid={wasp}>
                    <WaspIcon className="w-full h-full" />
                </Insect>
            ))}
            {bees.map((bee) => (
                <Insect key={bee.id} boid={bee}>
                    <BeeIcon className="w-full h-full" />
                </Insect>
            ))}
        </main>
    );
};

export default App;
