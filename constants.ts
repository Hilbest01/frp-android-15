import type { ProtocolStage, UsbDevice } from './types';

export const PROTOCOL_STAGES: ProtocolStage[] = [
    {
        name: "Establish Handshake",
        duration: 4000,
        logs: [
            "Pinging device on low-band frequency...",
            "Device responded. Encrypted key exchange initiated.",
            "Vulnerability found: CVE-202X-XXXX.",
            "Escalating privileges via kernel exploit..."
        ]
    },
    {
        name: "Bypass FRP & Knox",
        duration: 6000,
        logs: [
            "Injecting FRP bypass payload into bootloader.",
            "Factory Reset Protection neutralized.",
            "Analyzing Knox security layers...",
            "Deconstructing Hypervisor integrity checks.",
            "Knox container disabled. Full access granted."
        ]
    },
    {
        name: "Inject 'Phantom' Rootkit",
        duration: 8000,
        logs: [
            "Compiling rootkit for target architecture.",
            "Writing payload to /system partition.",
            "Masking process... PID spoofed.",
            "Establishing persistent backdoor...",
            "Rootkit active. Stealth mode enabled."
        ]
    },
    {
        name: "Clean Traces & Establish C2",
        duration: 5000,
        logs: [
            "Wiping logs from /var/log...",
            "Scrubbing command history.",
            "Connecting to Command & Control server...",
            "Heartbeat signal confirmed. Awaiting orders.",
            "Disconnecting terminal. Mission complete."
        ]
    }
];

export const MEI_MONOLOGUE: string[] = [
    "They build these walls of silicon and light, thinking they're safe.",
    "But they forget... every wall has a door. Every lock, a key.",
    "And I am the one who forges them.",
    "This device... it thinks it's a fortress. It's just a cage.",
    "Time to open it."
];

export const USB_DEVICES: UsbDevice[] = [
    { id: 'DEV_ID:0x1a86', model: 'CH340 Serial', status: 'Connected', isTarget: false },
    { id: 'DEV_ID:0x04e8', model: 'SM-A06F', status: 'Vulnerable', isTarget: true },
    { id: 'DEV_ID:0x22b8', model: 'ADB Interface', status: 'Awaiting Handshake', isTarget: false },
    { id: 'DEV_ID:0x99c1', model: 'Unknown Cygnus Device', status: 'Unknown Device', isTarget: false },
];
