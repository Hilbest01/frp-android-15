
import React, { useState, useEffect } from 'react';

const StatusItem: React.FC<{ label: string; value: string; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className={`font-bold ${colorClass}`}>{value}</span>
    </div>
);

export const StatusBar: React.FC = () => {
    const [coreTemp, setCoreTemp] = useState(45.2);
    const [networkIntegrity, setNetworkIntegrity] = useState(99.8);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCoreTemp(t => parseFloat((t + (Math.random() - 0.5) * 2).toFixed(1)));
            setNetworkIntegrity(n => parseFloat(Math.min(100, n + (Math.random() - 0.45)).toFixed(1)));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 border border-green-400/50">
            <h2 className="text-xl text-shadow-green mb-4">SYSTEM STATUS</h2>
            <div className="space-y-2">
                <StatusItem label="CORE TEMP" value={`${coreTemp}°C`} colorClass={coreTemp > 75 ? "text-red-500 animate-pulse" : "text-green-400"} />
                <StatusItem label="NETWORK" value={`${networkIntegrity}%`} colorClass={networkIntegrity < 95 ? "text-yellow-500" : "text-green-400"} />
                <StatusItem label="STEALTH MODE" value="ACTIVE" colorClass="text-cyan-400 animate-pulse" />
                <StatusItem label="C2 CONNECTION" value="SECURE" colorClass="text-green-400" />
            </div>
        </div>
    );
};
