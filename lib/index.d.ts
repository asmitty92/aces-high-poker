import { Card, CardHand, Face } from "aces-high-core";
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
export type PokerCard = Card<Face>;
export declare class PokerHand extends CardHand<Face> {
    private myKicker;
    private _fullHouseTop;
    private _fullHouseBottom;
    get kicker(): PokerCard;
    get fullHouseTop(): number;
    get fullHouseBottom(): number;
    constructor(cards: PokerCard[], accessKey: symbol);
    calculateScore(): number;
    protected scoreSevenCardHand(cards: PokerCard[]): number;
    protected scoreFiveCardHand(cards: PokerCard[]): number;
    protected scoreNoSetsHand(cards: PokerCard[]): PokerHands;
    protected findKicker(cards: PokerCard[], score: PokerHands): PokerCard;
    protected buildValuesMap(cards: PokerCard[]): Record<string, number>;
    protected findNonPairFaces(valuesMap: Record<string, number>): string[];
    protected isStraight(cards: PokerCard[]): boolean;
    protected isFlush(cards: PokerCard[]): boolean;
    protected findFullHouseTopAndBottom(valuesMap: Record<string, number>): number[];
    protected containsThree(valuesMap: Record<string, number>): boolean;
}
