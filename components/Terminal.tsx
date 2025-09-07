import React, { useState, useEffect, useRef } from 'react';
import type { LogLine } from '../types';

interface TerminalProps {
    logLines: LogLine[];
}

const getLineColor = (type: LogLine['type']) => {
    switch (type) {
        case 'success':
            return 'text-green-400';
        case 'error':
            return 'text-red-500';
        case 'monologue':
            return 'text-cyan-300 italic';
        case 'warning':
            return 'text-yellow-400';
        case 'info':
        default:
            return 'text-gray-400';
    }
}

const TYPE_SPEED = 15; // ms per character

const TypingLogLine: React.FC<{ line: LogLine }> = ({ line }) => {
    const [displayedText, setDisplayedText] = useState('');
    const { timestamp, text, type } = line;

    useEffect(() => {
        // Reset when the line changes (due to the key changing in the parent)
        setDisplayedText(''); 
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, TYPE_SPEED);
        return () => clearInterval(intervalId);
    }, [text]);

    const isTyping = displayedText.length < text.length;
    
    return (
        <div className="flex text-sm">
            <span className="text-green-700 mr-4">{timestamp.split('T')[1].replace('Z','')}</span>
            <p className={`${getLineColor(type)} flex-1 whitespace-pre-wrap break-words`}>
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1 align-bottom"></span>}
            </p>
        </div>
    );
};


export const Terminal: React.FC<TerminalProps> = ({ logLines }) => {
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logLines]);
    
    const previousLines = logLines.slice(0, -1);
    const lastLine = logLines.length > 0 ? logLines[logLines.length - 1] : null;

    return (
        <div className="bg-black/80 border border-green-400/50 h-[75vh] md:h-full p-4 overflow-y-auto">
            <h2 className="text-xl text-shadow-green mb-2">LIVE LOG</h2>
            <div>
                {previousLines.map((line, index) => (
                    <div key={`${line.timestamp}-${index}`} className="flex text-sm">
                        <span className="text-green-700 mr-4">{line.timestamp.split('T')[1].replace('Z','')}</span>
                        <p className={`${getLineColor(line.type)} flex-1 whitespace-pre-wrap break-words`}>
                            {line.text}
                        </p>
                    </div>
                ))}
                {lastLine && <TypingLogLine line={lastLine} key={lastLine.timestamp} />}
                <div ref={terminalEndRef} />
            </div>
        </div>
    );
};
