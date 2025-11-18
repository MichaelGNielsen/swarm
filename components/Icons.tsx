
import React from 'react';

export const WaspIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(50,50) scale(1.2)">
            {/* Body */}
            <path d="M 0,-25 C 20,-25 20,25 0,25 C -20,25 -20,-25 0,-25 Z" fill="#FFC700"/>
            <path d="M 0,-15 C 15,-15 15,15 0,15 C -15,15 -15,-15 0,-15 Z" fill="#000000"/>
            <path d="M 0,-5 C 8,-5 8,5 0,5 C -8,5 -8,-5 0,-5 Z" fill="#FFC700"/>

            {/* Head */}
            <circle cx="-15" cy="0" r="10" fill="#000000"/>
            <circle cx="-18" cy="-2" r="2" fill="white"/>

            {/* Stinger */}
            <path d="M 20,0 L 35,0 L 20,0 Z" stroke="#000000" strokeWidth="4" strokeLinecap="round"/>

            {/* Wings */}
            <path d="M 0,-10 C -20,-30 -30,-30 -10,-10 Z" fill="rgba(255,255,255,0.7)" transform="rotate(20)"/>
            <path d="M 0,10 C -20,30 -30,30 -10,10 Z" fill="rgba(255,255,255,0.7)" transform="rotate(-20)"/>
        </g>
    </svg>
);

export const BeeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(50,50) scale(1.1)">
             {/* Body */}
            <ellipse cx="0" cy="0" rx="20" ry="15" fill="#FFC700"/>
            <path d="M -15,0 Q -10, -15 0, -15 Q 10, -15 15,0" fill="none" stroke="#000" strokeWidth="7"/>
            <path d="M -15,0 Q -10, 15 0, 15 Q 10, 15 15,0" fill="none" stroke="#000" strokeWidth="7"/>

             {/* Head */}
            <circle cx="-18" cy="0" r="8" fill="#000"/>
            <circle cx="-20" cy="-2" r="1.5" fill="#FFF"/>

             {/* Wings */}
            <ellipse cx="-5" cy="-15" rx="12" ry="7" fill="rgba(255,255,255,0.8)" transform="rotate(-20, -5, -15)"/>
            <ellipse cx="-5" cy="15" rx="12" ry="7" fill="rgba(255,255,255,0.8)" transform="rotate(20, -5, 15)"/>
        </g>
    </svg>
);
