
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center p-2 border-2 border-cyan-400/50 box-shadow-cyan">
            <h1 className="text-2xl md:text-4xl font-bold text-cyan-400 text-shadow-cyan glitch" data-text="SMA06F SUBJUGATION PROTOCOL">
                SMA06F SUBJUGATION PROTOCOL
            </h1>
            <p className="text-green-400 text-sm">SYSTEM INTERFACE // OPERATOR: MEI</p>
        </header>
    );
};
