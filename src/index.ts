import { Card, CardHand, Faces, Face, getCombinations } from "aces-high-core";

export enum PokerHands {
  HIGH_CARD = 1,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  STRAIGHT,
  FLUSH,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  STRAIGHT_FLUSH,
}

export const faceValues: Record<string, number> = Object.fromEntries([
  [Faces.ACE, 1],
  [Faces.TWO, 2],
  [Faces.THREE, 3],
  [Faces.FOUR, 4],
  [Faces.FIVE, 5],
  [Faces.SIX, 6],
  [Faces.SEVEN, 7],
  [Faces.EIGHT, 8],
  [Faces.NINE, 9],
  [Faces.TEN, 10],
  [Faces.JACK, 11],
  [Faces.QUEEN, 12],
  [Faces.KING, 13],
]);

export type PokerCard = Card<Face>;

export class PokerHand extends CardHand<Face> {
  private myKicker: PokerCard;
  private _fullHouseTop: number;
  private _fullHouseBottom: number;

  get kicker(): PokerCard {
    return this.myKicker;
  }

  get fullHouseTop(): number {
    return this._fullHouseTop;
  }

  get fullHouseBottom(): number {
    return this._fullHouseBottom;
  }

  constructor(cards: PokerCard[], accessKey: symbol) {
    super(cards, accessKey);
    this._cards.sort((c1: PokerCard, c2: PokerCard) => c1.value - c2.value);
  }

  calculateScore(): number {
    return this.cards.length === 5 ? this.scoreFiveCardHand(this._cards) : this.scoreSevenCardHand(this._cards);
  }

  protected scoreSevenCardHand(cards: PokerCard[]) {
    const combos = getCombinations(cards, 5);
    let score = 0;
    for (const comboCards of combos) {
      comboCards.sort((c1: PokerCard, c2: PokerCard) => c1.value - c2.value);
      const newScore = this.scoreFiveCardHand(comboCards);
      if (newScore >= score) {
        score = newScore;
      }
    }
    return score;
  }

  protected scoreFiveCardHand(cards: PokerCard[]): number {
    const valuesMap = this.buildValuesMap(cards);

    let score: PokerHands;
    let kicker: PokerCard;
    switch (Object.keys(valuesMap).length) {
      case 5:
        score = this.scoreNoSetsHand(cards);
        kicker = this.findKicker([...cards], score);
        this.myKicker = kicker;
        return score;
      case 4:
        score = PokerHands.ONE_PAIR;
        break;
      case 3:
        score = this.containsThree(valuesMap) ? PokerHands.THREE_OF_A_KIND : PokerHands.TWO_PAIR;
        break;
      case 2:
        [this._fullHouseTop, this._fullHouseBottom] = this.findFullHouseTopAndBottom(valuesMap);
        score = this.fullHouseTop > 0 ? PokerHands.FULL_HOUSE : PokerHands.FOUR_OF_A_KIND;
        break;
    }

    const nonPairFaces = this.findNonPairFaces(valuesMap);
    const nonPairCards = cards.filter((c) => nonPairFaces.some((f) => c.face === f));
    kicker = this.findKicker(nonPairCards, score);

    this.myKicker = kicker;
    return score;
  }

  protected scoreNoSetsHand(cards: PokerCard[]): PokerHands {
    const sortedCards = cards.sort((c1, c2) => c1.value - c2.value);
    const isStraight = this.isStraight(sortedCards);
    const isFlush = this.isFlush(sortedCards);

    if (isStraight && isFlush) {
      return PokerHands.STRAIGHT_FLUSH;
    }
    if (isStraight) {
      return PokerHands.STRAIGHT;
    }
    if (isFlush) {
      return PokerHands.FLUSH;
    }
    return PokerHands.HIGH_CARD;
  }

  protected findKicker(cards: PokerCard[], score: PokerHands): PokerCard {
    const aceIndex = cards.findIndex((c) => c.face === Faces.ACE);
    const containsKing = cards.some((c) => c.face === Faces.KING);
    const isAceLowStraight = score === PokerHands.STRAIGHT && aceIndex >= 0 && !containsKing;
    if (aceIndex >= 0 && !isAceLowStraight) {
      return cards[aceIndex];
    }

    const sortedCards = cards.sort((a: PokerCard, b: PokerCard) => a.value - b.value);
    return sortedCards[sortedCards.length - 1];
  }

  protected buildValuesMap(cards: PokerCard[]): Record<string, number> {
    const map: Record<string, number> = {};
    cards.forEach((card) => {
      map[card.face] = card.face in map ? map[card.face] + 1 : 1;
    });
    return map;
  }

  protected findNonPairFaces(valuesMap: Record<string, number>): string[] {
    return Array.from(Object.entries(valuesMap))
      .filter(([_, value]) => value === 1)
      .map(([key, _]) => key);
  }

  protected isStraight(cards: PokerCard[]): boolean {
    const maxValue = cards.at(-1).value;
    const minValue = cards.at(0).value;
    const containsKing = cards.some((c) => c.face === Faces.KING);
    const containsAce = cards.some((c) => c.face === Faces.ACE);

    if (!(containsKing && containsAce) && maxValue - minValue == 4) {
      return true;
    }

    return containsKing && containsAce && maxValue - cards.at(1).value == 3;
  }

  protected isFlush(cards: PokerCard[]): boolean {
    const suits = new Set(cards.map((card) => card.suit));
    return suits.size === 1;
  }

  protected findFullHouseTopAndBottom(valuesMap: Record<string, number>): number[] {
    let top: number = 0;
    let bottom: number = 0;
    for (const [key, value] of Object.entries(valuesMap)) {
      if (value === 3) {
        top = faceValues[key];
      } else if (value === 2) {
        bottom = faceValues[key];
      }
    }
    return [top, bottom];
  }

  protected containsThree(valuesMap: Record<string, number>): boolean {
    return Array.from(Object.values(valuesMap)).some((v) => v === 3);
  }
}
