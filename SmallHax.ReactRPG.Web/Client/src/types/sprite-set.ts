import { Point } from "./point";

export interface SpriteData {
    name: string;
    fileName?: string;
    scale?: number;
    anchor?: Point;
    shadowScale?: number;
}
export interface DefaultSpriteData extends SpriteData {
    scale: number;
    anchor: Point;
}
export interface SpriteSet {
    default?: DefaultSpriteData;
    variants: SpriteData[];
}