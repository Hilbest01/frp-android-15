import React, { useState, useEffect } from 'react';
import type { ProtocolStage, UsbDevice } from '../types';

interface ControlPanelProps {
    isRunning: boolean;
    onStart: () => void;
    currentStage: ProtocolStage | undefined;
    progress: number;
    selectedDevice: UsbDevice | null;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-green-900/50 border border-green-400/50 p-1">
        <div
            className="bg-green-400 h-4 transition-all duration-150 ease-linear box-shadow-green"
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);

const StatusItem: React.FC<{ label: string; value: string; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className={`font-bold ${colorClass}`}>{value}</span>
    </div>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ isRunning, onStart, currentStage, progress, selectedDevice }) => {
    const [coreTemp, setCoreTemp] = useState(45.2);
    const [networkIntegrity, setNetworkIntegrity] = useState(99.8);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCoreTemp(t => parseFloat((t + (Math.random() - 0.5) * (isRunning ? 5 : 2)).toFixed(1)));
            setNetworkIntegrity(n => parseFloat(Math.min(100, n + (Math.random() - 0.45)).toFixed(1)));
        }, 1500);

        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <div className="p-4 border border-green-400/50 h-full flex flex-col">
            <h2 className="text-xl text-shadow-green mb-4">CONTROL PANEL</h2>
            <button
                onClick={onStart}
                disabled={isRunning || !selectedDevice?.isTarget}
                className="w-full px-4 py-2 mb-4 text-lg font-bold transition-all duration-300
                           border-2 border-red-500 bg-red-900/50 text-red-400
                           hover:bg-red-500 hover:text-black hover:shadow-[0_0_15px_rgba(239,68,68,0.8)]
                           disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
                {isRunning ? 'PROTOCOL RUNNING' : 'INITIATE PROTOCOL'}
            </button>

            <div className="mt-2">
                <h3 className="text-lg">TARGET INFO:</h3>
                {selectedDevice ? (
                    <div className="p-2 bg-black/50 border border-green-700 mt-2 text-sm">
                        <p>MODEL: <span className="text-cyan-400">{selectedDevice.model}</span></p>
                        <p>ID: <span className="text-cyan-400">{selectedDevice.id}</span></p>
                        <p>STATUS: <span className={selectedDevice.isTarget ? 'text-red-400 animate-pulse' : 'text-green-400'}>{selectedDevice.status}</span></p>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">No target selected...</p>
                )}
            </div>

            <div className="mt-6">
                <h3 className="text-lg">CURRENT STAGE:</h3>
                {isRunning && currentStage ? (
                     <div className="p-2 bg-black/50 border border-green-700 mt-2">
                         <p className="text-cyan-400 animate-pulse">{currentStage.name}</p>
                         <div className="mt-4">
                            <ProgressBar progress={progress} />
                            <p className="text-right text-sm mt-1">{Math.round(progress)}%</p>
                         </div>
                     </div>
                ) : (
                    <p className="text-gray-500 mt-2">Awaiting initiation...</p>
                )}
            </div>

            <div className="mt-auto pt-4">
                <h3 className="text-lg text-shadow-green mb-2">SYSTEM STATUS</h3>
                <div className="space-y-1">
                    <StatusItem label="CORE TEMP" value={`${coreTemp}°C`} colorClass={coreTemp > 75 ? "text-red-500 animate-pulse" : "text-green-400"} />
                    <StatusItem label="NETWORK" value={`${networkIntegrity}%`} colorClass={networkIntegrity < 95 ? "text-yellow-500" : "text-green-400"} />
                    <StatusItem label="STEALTH MODE" value={isRunning ? "ACTIVE" : "INACTIVE"} colorClass={isRunning ? "text-cyan-400 animate-pulse" : "text-gray-500"} />
                    <StatusItem label="C2 CONNECTION" value={isRunning ? "SECURE" : "OFFLINE"} colorClass={isRunning ? "text-green-400" : "text-gray-500"} />
                </div>
            </div>
        </div>
    );
};
