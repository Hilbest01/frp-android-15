import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { Terminal } from './components/Terminal';
import { DeviceScanner } from './components/DeviceScanner';
import { PROTOCOL_STAGES, MEI_MONOLOGUE, USB_DEVICES } from './constants';
import type { LogLine, ProtocolStage, UsbDevice } from './types';

let ai: GoogleGenAI | null = null;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
}

const App: React.FC = () => {
    const [isProtocolRunning, setIsProtocolRunning] = useState<boolean>(false);
    const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
    const [logLines, setLogLines] = useState<LogLine[]>([]);
    const [progress, setProgress] = useState<number>(0);
    const [selectedDevice, setSelectedDevice] = useState<UsbDevice | null>(null);

    const addLogLine = useCallback((text: string, type: LogLine['type'] = 'info') => {
        const timestamp = new Date().toISOString();
        setLogLines(prev => [...prev, { timestamp, text, type }]);
    }, []);

    useEffect(() => {
        addLogLine("System Initialized. Awaiting user command.", "success");
        addLogLine("Operator: Mei // Session ID: 7b2c8a1f-4e9d-4f3a-8b1e-6c9f0a2d4e7b");
        addLogLine("Please select a target device from the USB scanner.", "warning");
        if (!ai) {
            addLogLine("AI Core failed to initialize. Log generation will be limited.", "error");
        }
    }, [addLogLine]);

    const handleSelectDevice = (device: UsbDevice) => {
        setSelectedDevice(device);
        addLogLine(`Device selected: ${device.model} [${device.id}]`);
        if (device.isTarget) {
            addLogLine("Vulnerable target confirmed. Protocol can be initiated.", "success");
        } else {
            addLogLine("Selected device is not the designated target.", "warning");
        }
    };
    
    const generateStageLogs = useCallback(async (stageName: string): Promise<string[]> => {
        if (!ai) return [];
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `You are a log generator for a fictional cyberpunk hacking tool. Generate 3 short, technical-sounding log messages for the following operation: '${stageName}'. The logs should be concise and dramatic. Example: "Injecting FRP bypass payload into bootloader."`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            logs: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING
                                }
                            }
                        }
                    }
                }
            });
            const jsonText = response.text.trim();
            const parsed = JSON.parse(jsonText);
            return parsed.logs || [];
        } catch (error) {
            console.error("Gemini log generation failed:", error);
            addLogLine("AI log generation failed. Using cached logs.", "warning");
            return [];
        }
    }, [addLogLine]);


    const runProtocol = useCallback(() => {
        if (!selectedDevice || !selectedDevice.isTarget) {
            addLogLine("Cannot initiate: No valid target selected.", "error");
            return;
        }
        setIsProtocolRunning(true);
        setCurrentStageIndex(0);
        setProgress(0);
        setLogLines([]);
        addLogLine(`SMA06F Subjugation Protocol Initiated on ${selectedDevice.model} by Operator Mei.`, "success");
        MEI_MONOLOGUE.forEach((line, index) => {
            setTimeout(() => addLogLine(line, 'monologue'), index * 1500);
        });
    }, [addLogLine, selectedDevice]);

    useEffect(() => {
        if (!isProtocolRunning) return;

        const monologueDuration = MEI_MONOLOGUE.length * 1500;
        const currentStage = PROTOCOL_STAGES[currentStageIndex];

        if (!currentStage) {
            addLogLine("Protocol complete. Device subjugated. Standing by.", "success");
            setIsProtocolRunning(false);
            return;
        }
        
        let dynamicLogs: string[] = [];

        const stageStartTimeout = setTimeout(async () => {
            addLogLine(`Starting Stage ${currentStageIndex + 1}/${PROTOCOL_STAGES.length}: ${currentStage.name}`);
            dynamicLogs = await generateStageLogs(currentStage.name);

            const allLogs = [...currentStage.logs, ...dynamicLogs];

            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        addLogLine(`Stage ${currentStage.name} complete.`, "success");
                        setCurrentStageIndex(i => i + 1);
                        return 0;
                    }
                    const increment = Math.random() * 10 + 5;
                    const nextProgress = Math.min(prev + increment, 100);
                    
                    if(Math.random() > 0.6 && allLogs.length > 0) {
                       const logMsg = allLogs.splice(Math.floor(Math.random() * allLogs.length), 1)[0];
                       addLogLine(logMsg);
                    }

                    return nextProgress;
                });
            }, currentStage.duration / 10);
            
            return () => clearInterval(progressInterval);

        }, currentStageIndex === 0 ? monologueDuration + 1000 : 500);


       return () => clearTimeout(stageStartTimeout);
    }, [isProtocolRunning, currentStageIndex, addLogLine, generateStageLogs]);


    return (
        <div className="min-h-screen bg-black text-green-400 font-mono p-4 flex flex-col scanline relative">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow mt-4">
                <div className="md:col-span-1 flex flex-col gap-4">
                    <ControlPanel
                        isRunning={isProtocolRunning}
                        onStart={runProtocol}
                        currentStage={PROTOCOL_STAGES[currentStageIndex]}
                        progress={progress}
                        selectedDevice={selectedDevice}
                    />
                     <DeviceScanner 
                        devices={USB_DEVICES}
                        onSelectDevice={handleSelectDevice}
                        selectedDevice={selectedDevice}
                     />
                </div>
                <div className="md:col-span-3">
                    <Terminal logLines={logLines} />
                </div>
            </div>
            <footer className="text-center text-xs text-green-700 mt-4">
                <p>FICTIONAL INTERFACE - FOR ARTISTIC PURPOSES ONLY</p>
            </footer>
        </div>
    );
};

export default App;
