import React, { memo } from "react";

export interface ProgressBarProps {
    min: number
    max: number
    value: number
    className: string
}

export const ProgressBar = memo(function ProgressBar({min, max, value, className}: ProgressBarProps) {
    const progress = 100 * (value - min) / (max - min);
    return <div className={`progress-bar ${className}`}>
        <div className="progress-bar-fill" style={{width: progress + "%"}}></div>
    </div>
});