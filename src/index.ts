import { Card, CardHand, Faces } from "aces-high-core";

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

export const faceValues = new Map<string, number>([
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

class ArrayItem<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export function getCombinations<T>(items: T[], itemCount: number): T[][] {
  let combinations = [];

  function generateCombinations(count: number, start: number, combo: ArrayItem<T>[]) {
    count--;
    for (let i = start; i < items.length; i++) {
      combo[count] = new ArrayItem(items[i]);
      if (count == 0) {
        combinations.push(combo.map((i) => i.value));
      } else {
        start++;
        generateCombinations(count, start, combo);
      }
    }
  }

  generateCombinations(itemCount, 0, []);

  return combinations;
}

export class PokerHand extends CardHand {
  private myKicker: Card;
  private _fullHouseTop: number;
  private _fullHouseBottom: number;

  get kicker(): Card {
    return this.myKicker;
  }

  get fullHouseTop(): number {
    return this._fullHouseTop;
  }

  get fullHouseBottom(): number {
    return this._fullHouseBottom;
  }

  constructor(cards: Card[]) {
    super(cards);
    this.cards.sort((c1: Card, c2: Card) => c1.value - c2.value);
  }

  calculateScore(): number {
    return this.cards.length === 5 ? this.scoreFiveCardHand(this.cards) : this.scoreSevenCardHand(this.cards);
  }

  protected scoreSevenCardHand(cards: Card[]) {
    const combos = getCombinations(cards, 5);
    let score = 0;
    for (const comboCards of combos) {
      comboCards.sort((c1: Card, c2: Card) => c1.value - c2.value);
      const newScore = this.scoreFiveCardHand(comboCards);
      if (newScore >= score) {
        score = newScore;
      }
    }
    return score;
  }

  protected scoreFiveCardHand(cards: Card[]): number {
    const valuesMap = this.buildValuesMap(cards);

    let score: PokerHands;
    let kicker: Card;
    switch (valuesMap.size) {
      case 5:
        score = this.scoreNoSetsHand(cards);
        kicker = this.findKicker([...cards], score);
        this.myKicker = kicker;
        return score;
      case 4:
        score = PokerHands.ONE_PAIR;
        break;
      case 3:
        const containsThree = Array.from(valuesMap.values()).some((v) => v === 3);
        score = containsThree ? PokerHands.THREE_OF_A_KIND : PokerHands.TWO_PAIR;
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

  protected scoreNoSetsHand(cards: Card[]): PokerHands {
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

  protected findKicker(cards: Card[], score: PokerHands): Card {
    const aceIndex = cards.findIndex((c) => c.face === Faces.ACE);
    const containsKing = cards.some((c) => c.face === Faces.KING);
    const isAceLowStraight = score === PokerHands.STRAIGHT && aceIndex >= 0 && !containsKing;
    if (aceIndex >= 0 && !isAceLowStraight) {
      return cards[aceIndex];
    }

    const sortedCards = cards.sort((a: Card, b: Card) => a.value - b.value);
    return sortedCards[sortedCards.length - 1];
  }

  protected buildValuesMap(cards: Card[]): Map<string, number> {
    const map = new Map<string, number>();
    cards.forEach((card) => {
      const value = map.has(card.face) ? map.get(card.face) + 1 : 1;
      map.set(card.face, value);
    });
    return map;
  }

  protected findNonPairFaces(valuesMap: Map<string, number>): string[] {
    return Array.from(valuesMap.entries())
      .filter(([_, value]) => value === 1)
      .map(([key, _]) => key);
  }

  protected isStraight(cards: Card[]): boolean {
    const maxValue = cards.at(-1).value;
    const minValue = cards.at(0).value;
    const containsKing = cards.some((c) => c.face === Faces.KING);
    const containsAce = cards.some((c) => c.face === Faces.ACE);

    if (!(containsKing && containsAce) && maxValue - minValue == 4) {
      return true;
    }

    if (containsKing && containsAce && maxValue - cards.at(1).value == 3) {
      return true;
    }

    return false;
  }

  protected isFlush(cards: Card[]): boolean {
    const suits = new Set(cards.map((card) => card.suit));
    return suits.size === 1;
  }

  protected findFullHouseTopAndBottom(valuesMap: Map<string, number>): number[] {
    let top: number = 0;
    let bottom: number = 0;
    for (const [key, value] of valuesMap.entries()) {
      if (value === 3) {
        top = faceValues.get(key);
      } else if (value === 2) {
        bottom = faceValues.get(key);
      }
    }
    return [top, bottom];
  }
}
