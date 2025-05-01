import { CardHand, Faces, getCombinations } from "aces-high-core";
export var PokerHands;
(function (PokerHands) {
    PokerHands[PokerHands["HIGH_CARD"] = 1] = "HIGH_CARD";
    PokerHands[PokerHands["ONE_PAIR"] = 2] = "ONE_PAIR";
    PokerHands[PokerHands["TWO_PAIR"] = 3] = "TWO_PAIR";
    PokerHands[PokerHands["THREE_OF_A_KIND"] = 4] = "THREE_OF_A_KIND";
    PokerHands[PokerHands["STRAIGHT"] = 5] = "STRAIGHT";
    PokerHands[PokerHands["FLUSH"] = 6] = "FLUSH";
    PokerHands[PokerHands["FULL_HOUSE"] = 7] = "FULL_HOUSE";
    PokerHands[PokerHands["FOUR_OF_A_KIND"] = 8] = "FOUR_OF_A_KIND";
    PokerHands[PokerHands["STRAIGHT_FLUSH"] = 9] = "STRAIGHT_FLUSH";
})(PokerHands || (PokerHands = {}));
export const faceValues = Object.fromEntries([
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
export class PokerHand extends CardHand {
    myKicker;
    _fullHouseTop;
    _fullHouseBottom;
    get kicker() {
        return this.myKicker;
    }
    get fullHouseTop() {
        return this._fullHouseTop;
    }
    get fullHouseBottom() {
        return this._fullHouseBottom;
    }
    constructor(cards) {
        super(cards);
        this.cards.sort((c1, c2) => c1.value - c2.value);
    }
    calculateScore() {
        return this.cards.length === 5 ? this.scoreFiveCardHand(this.cards) : this.scoreSevenCardHand(this.cards);
    }
    scoreSevenCardHand(cards) {
        const combos = getCombinations(cards, 5);
        let score = 0;
        for (const comboCards of combos) {
            comboCards.sort((c1, c2) => c1.value - c2.value);
            const newScore = this.scoreFiveCardHand(comboCards);
            if (newScore >= score) {
                score = newScore;
            }
        }
        return score;
    }
    scoreFiveCardHand(cards) {
        const valuesMap = this.buildValuesMap(cards);
        let score;
        let kicker;
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
    scoreNoSetsHand(cards) {
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
    findKicker(cards, score) {
        const aceIndex = cards.findIndex((c) => c.face === Faces.ACE);
        const containsKing = cards.some((c) => c.face === Faces.KING);
        const isAceLowStraight = score === PokerHands.STRAIGHT && aceIndex >= 0 && !containsKing;
        if (aceIndex >= 0 && !isAceLowStraight) {
            return cards[aceIndex];
        }
        const sortedCards = cards.sort((a, b) => a.value - b.value);
        return sortedCards[sortedCards.length - 1];
    }
    buildValuesMap(cards) {
        const map = {};
        cards.forEach((card) => {
            map[card.face] = card.face in map ? map[card.face] + 1 : 1;
        });
        return map;
    }
    findNonPairFaces(valuesMap) {
        return Array.from(Object.entries(valuesMap))
            .filter(([_, value]) => value === 1)
            .map(([key, _]) => key);
    }
    isStraight(cards) {
        const maxValue = cards.at(-1).value;
        const minValue = cards.at(0).value;
        const containsKing = cards.some((c) => c.face === Faces.KING);
        const containsAce = cards.some((c) => c.face === Faces.ACE);
        if (!(containsKing && containsAce) && maxValue - minValue == 4) {
            return true;
        }
        return containsKing && containsAce && maxValue - cards.at(1).value == 3;
    }
    isFlush(cards) {
        const suits = new Set(cards.map((card) => card.suit));
        return suits.size === 1;
    }
    findFullHouseTopAndBottom(valuesMap) {
        let top = 0;
        let bottom = 0;
        for (const [key, value] of Object.entries(valuesMap)) {
            if (value === 3) {
                top = faceValues[key];
            }
            else if (value === 2) {
                bottom = faceValues[key];
            }
        }
        return [top, bottom];
    }
    containsThree(valuesMap) {
        return Array.from(Object.values(valuesMap)).some((v) => v === 3);
    }
}
//# sourceMappingURL=index.js.map