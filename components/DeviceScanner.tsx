import React from 'react';
import type { UsbDevice } from '../types';

interface DeviceScannerProps {
    devices: UsbDevice[];
    onSelectDevice: (device: UsbDevice) => void;
    selectedDevice: UsbDevice | null;
}

export const DeviceScanner: React.FC<DeviceScannerProps> = ({ devices, onSelectDevice, selectedDevice }) => {
    return (
        <div className="p-4 border border-green-400/50">
            <h2 className="text-xl text-shadow-green mb-4">USB DEVICE SCAN</h2>
            <div className="space-y-2">
                {devices.map((device) => (
                    <button
                        key={device.id}
                        onClick={() => onSelectDevice(device)}
                        className={`w-full text-left p-2 border transition-all duration-200 ${
                            selectedDevice?.id === device.id
                                ? 'bg-cyan-900/70 border-cyan-400 text-cyan-300'
                                : 'bg-black/50 border-green-700 hover:bg-green-900/50 hover:border-green-500'
                        }`}
                    >
                        <p className="font-bold">{device.model}</p>
                        <p className="text-xs text-gray-400">{device.id} - <span className={device.isTarget ? 'text-red-500 animate-pulse' : ''}>{device.status}</span></p>
                    </button>
                ))}
            </div>
        </div>
    );
};
