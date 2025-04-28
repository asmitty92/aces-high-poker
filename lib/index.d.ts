import { Card, CardHand } from "aces-high-core";
export declare enum PokerHands {
    HIGH_CARD = 1,
    ONE_PAIR = 2,
    TWO_PAIR = 3,
    THREE_OF_A_KIND = 4,
    STRAIGHT = 5,
    FLUSH = 6,
    FULL_HOUSE = 7,
    FOUR_OF_A_KIND = 8,
    STRAIGHT_FLUSH = 9
}
export declare const faceValues: Record<string, number>;
export declare function getCombinations<T>(items: T[], itemCount: number): T[][];
export declare class PokerHand extends CardHand {
    private myKicker;
    private _fullHouseTop;
    private _fullHouseBottom;
    get kicker(): Card;
    get fullHouseTop(): number;
    get fullHouseBottom(): number;
    constructor(cards: Card[]);
    calculateScore(): number;
    protected scoreSevenCardHand(cards: Card[]): number;
    protected scoreFiveCardHand(cards: Card[]): number;
    protected scoreNoSetsHand(cards: Card[]): PokerHands;
    protected findKicker(cards: Card[], score: PokerHands): Card;
    protected buildValuesMap(cards: Card[]): Record<string, number>;
    protected findNonPairFaces(valuesMap: Record<string, number>): string[];
    protected isStraight(cards: Card[]): boolean;
    protected isFlush(cards: Card[]): boolean;
    protected findFullHouseTopAndBottom(valuesMap: Record<string, number>): number[];
    protected containsThree(valuesMap: Record<string, number>): boolean;
}
