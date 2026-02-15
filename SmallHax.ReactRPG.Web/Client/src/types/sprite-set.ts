import { Point } from "./point";

export interface SpriteData {
    name: string;
    fileName?: string;
    scale?: number;
    x?: number;
    y?: number;
    shadowScale?: number;
    shadowMass?: number;
}

export interface SpriteSet {
    default?: SpriteData;
    variants: SpriteData[];
}