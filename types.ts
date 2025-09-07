export interface LogLine {
    timestamp: string;
    text: string;
    type: 'info' | 'success' | 'error' | 'monologue' | 'warning';
}

export interface ProtocolStage {
    name: string;
    duration: number; // in ms
    logs: string[];
}

export interface UsbDevice {
    id: string;
    model: string;
    status: 'Awaiting Handshake' | 'Connected' | 'Vulnerable' | 'Unknown Device';
    isTarget: boolean;
}
