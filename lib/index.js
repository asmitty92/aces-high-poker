"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokerHand = exports.getCombinations = exports.faceValues = exports.PokerHands = void 0;
const aces_high_core_1 = require("aces-high-core");
var PokerHands;
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
})(PokerHands = exports.PokerHands || (exports.PokerHands = {}));
exports.faceValues = new Map([
    [aces_high_core_1.Faces.ACE, 1],
    [aces_high_core_1.Faces.TWO, 2],
    [aces_high_core_1.Faces.THREE, 3],
    [aces_high_core_1.Faces.FOUR, 4],
    [aces_high_core_1.Faces.FIVE, 5],
    [aces_high_core_1.Faces.SIX, 6],
    [aces_high_core_1.Faces.SEVEN, 7],
    [aces_high_core_1.Faces.EIGHT, 8],
    [aces_high_core_1.Faces.NINE, 9],
    [aces_high_core_1.Faces.TEN, 10],
    [aces_high_core_1.Faces.JACK, 11],
    [aces_high_core_1.Faces.QUEEN, 12],
    [aces_high_core_1.Faces.KING, 13],
]);
class ArrayItem {
    constructor(value) {
        this.value = value;
    }
}
function getCombinations(items, itemCount) {
    let combinations = [];
    function generateCombinations(count, start, combo) {
        count--;
        for (let i = start; i < items.length; i++) {
            combo[count] = new ArrayItem(items[i]);
            if (count == 0) {
                combinations.push(combo
                    .map(i => i.value));
            }
            else {
                start++;
                generateCombinations(count, start, combo);
            }
        }
    }
    generateCombinations(itemCount, 0, []);
    return combinations;
}
exports.getCombinations = getCombinations;
class PokerHand extends aces_high_core_1.CardHand {
    constructor(cards) {
        super(cards);
        this.cards.sort((c1, c2) => c1.value - c2.value);
    }
    get kicker() {
        return this.myKicker;
    }
    get fullHouseTop() {
        return this._fullHouseTop;
    }
    get fullHouseBottom() {
        return this._fullHouseBottom;
    }
    calculateScore() {
        const valuesMap = this.buildValuesMap();
        let score;
        switch (valuesMap.size) {
            case 5:
                const sortedCards = this.cards.sort((c1, c2) => c1.value - c2.value);
                const isStraight = this.isStraight(sortedCards);
                const isFlush = this.isFlush(sortedCards);
                if (isStraight && isFlush)
                    score = PokerHands.STRAIGHT_FLUSH;
                else if (isStraight)
                    score = PokerHands.STRAIGHT;
                else if (isFlush)
                    score = PokerHands.FLUSH;
                else
                    score = PokerHands.HIGH_CARD;
                this.myKicker = this.findKicker([...this.cards], score);
                return score;
            case 4:
                score = PokerHands.ONE_PAIR;
                break;
            case 3:
                const containsThree = Array.from(valuesMap.values()).some((v) => v === 3);
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
        const nonPairCards = this.cards.filter((c) => nonPairFaces.some((f) => c.face === f));
        this.myKicker = this.findKicker(nonPairCards, score);
        return score;
    }
    findKicker(cards, score) {
        const aceIndex = cards.findIndex((c) => c.face === aces_high_core_1.Faces.ACE);
        const containsKing = cards.some((c) => c.face === aces_high_core_1.Faces.KING);
        const isAceLowStraight = score === PokerHands.STRAIGHT && aceIndex >= 0 && !containsKing;
        if (aceIndex >= 0 && !isAceLowStraight) {
            return cards[aceIndex];
        }
        const sortedCards = cards.sort((a, b) => a.value - b.value);
        return sortedCards[sortedCards.length - 1];
    }
    buildValuesMap() {
        const map = new Map();
        this.cards.forEach((card) => {
            const value = map.has(card.face) ? map.get(card.face) + 1 : 1;
            map.set(card.face, value);
        });
        return map;
    }
    findNonPairFaces(valuesMap) {
        return Array.from(valuesMap.entries())
            .filter(([_, value]) => value === 1)
            .map(([key, _]) => key);
    }
    isStraight(cards) {
        const maxValue = Math.max(...cards.map((card) => card.value));
        const minValue = Math.min(...cards.map((card) => card.value));
        const containsKing = cards.some((c) => c.face === aces_high_core_1.Faces.KING);
        const containsAce = cards.some((c) => c.face === aces_high_core_1.Faces.ACE);
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
    isFlush(cards) {
        const suits = new Set(cards.map((card) => card.suit));
        return suits.size === 1;
    }
    findFullHouseTopAndBottom(valuesMap) {
        let top = 0;
        let bottom = 0;
        for (const [key, value] of valuesMap.entries()) {
            if (value === 3) {
                top = exports.faceValues.get(key);
            }
            else if (value === 2) {
                bottom = exports.faceValues.get(key);
            }
        }
        return [top, bottom];
    }
}
exports.PokerHand = PokerHand;
//# sourceMappingURL=index.js.map