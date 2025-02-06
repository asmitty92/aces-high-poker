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
      combo[count] = new ArrayItem(items[i])
      if (count == 0) {
        combinations.push(
            combo
                .map(i => i.value)
        );
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
    if (this.cards.length === 5) {
      return this.scoreFiveCardHand(this.cards);
    } else if(this.cards.length === 7) {
      const combos = getCombinations(this.cards, 5);
      let score = 0;
      for (const cards of combos) {
        const newScore = this.scoreFiveCardHand(cards);
        if (newScore >= score) {
          score = newScore;
        }
      }
      return score;
    }
  }

  protected scoreFiveCardHand(cards: Card[]): number {
    const valuesMap = this.buildValuesMap(cards);

    let score: PokerHands;
    switch (valuesMap.size) {
      case 5:
        const sortedCards = cards.sort((c1, c2) => c1.value - c2.value);
        const isStraight = this.isStraight(sortedCards);
        const isFlush = this.isFlush(sortedCards);
        if (isStraight && isFlush) score = PokerHands.STRAIGHT_FLUSH;
        else if (isStraight) score = PokerHands.STRAIGHT;
        else if (isFlush) score = PokerHands.FLUSH;
        else score = PokerHands.HIGH_CARD;
        this.myKicker = this.findKicker([...cards], score);
        return score;
      case 4:
        score = PokerHands.ONE_PAIR;
        break;
      case 3:
        const containsThree = Array.from(valuesMap.values()).some(
          (v) => v === 3,
        );
        score = containsThree
          ? PokerHands.THREE_OF_A_KIND
          : PokerHands.TWO_PAIR;
        break;
      case 2:
        [this._fullHouseTop, this._fullHouseBottom] =
          this.findFullHouseTopAndBottom(valuesMap);
        score =
          this.fullHouseTop > 0
            ? PokerHands.FULL_HOUSE
            : PokerHands.FOUR_OF_A_KIND;
        break;
    }

    const nonPairFaces = this.findNonPairFaces(valuesMap);
    const nonPairCards = cards.filter((c) =>
      nonPairFaces.some((f) => c.face === f),
    );
    this.myKicker = this.findKicker(nonPairCards, score);

    return score;
  }

  protected findKicker(cards: Card[], score: PokerHands): Card {
    const aceIndex = cards.findIndex((c) => c.face === Faces.ACE);
    const containsKing = cards.some((c) => c.face === Faces.KING);
    const isAceLowStraight =
      score === PokerHands.STRAIGHT && aceIndex >= 0 && !containsKing;
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
    const maxValue = Math.max(...cards.map((card) => card.value));
    const minValue = Math.min(...cards.map((card) => card.value));
    const containsKing = cards.some((c) => c.face === Faces.KING);
    const containsAce = cards.some((c) => c.face === Faces.ACE);

    if (maxValue - minValue !== 4 && !(containsKing && containsAce)) {
      return false;
    }

    const startIndex = containsAce ? 2 : 1;
    for (let i = startIndex; i < cards.length; i++) {
      if (cards[i].value - cards[i - 1].value !== 1) {
        return false;
      }
    }
    return true;
  }

  protected isFlush(cards: Card[]): boolean {
    const suits = new Set(cards.map((card) => card.suit));
    return suits.size === 1;
  }

  protected findFullHouseTopAndBottom(
    valuesMap: Map<string, number>,
  ): number[] {
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
