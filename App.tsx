
import React, { useRef, useEffect, useState } from 'react';
import { useSwarmSimulation } from './hooks/useSwarmSimulation';

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
                <div
                    key={wasp.id}
                    className="absolute rounded-full"
                    style={{
                        width: `${wasp.size}px`,
                        height: `${wasp.size}px`,
                        backgroundColor: '#facc15', // Yellow-400 for wasps
                        left: -wasp.size / 2,
                        top: -wasp.size / 2,
                        transform: `translate(${wasp.position.x}px, ${wasp.position.y}px)`,
                    }}
                />
            ))}
            {bees.map((bee) => (
                <div
                    key={bee.id}
                    className="absolute rounded-full"
                    style={{
                        width: `${bee.size}px`,
                        height: `${bee.size}px`,
                        backgroundColor: '#f97316', // Orange-500 for bees
                        left: -bee.size / 2,
                        top: -bee.size / 2,
                        transform: `translate(${bee.position.x}px, ${bee.position.y}px)`,
                    }}
                />
            ))}
        </main>
    );
};

export default App;
