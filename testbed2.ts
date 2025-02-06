import {Card, StandardDeck} from "aces-high-core";
import {PokerHand, PokerHands} from "./src";
import scores from './seven-card-scores.json'

const deck = new StandardDeck();
const numberOfHands = 10;
const numberOfCards = 7
const lines = [];
let index = 0;

for (let i = 0; i < numberOfHands; i++) {
    deck.fullShuffle();

    const handCards: Card[][] = [
        [],
        [],
        [],
        [],
        [],
    ]

    for (let i = 0; i < numberOfCards; i++) {
        for (const cards of handCards) {
            cards.push(<Card>deck.deal());
        }
    }

    const hands: PokerHand[] = [];
    for (const cards of handCards) {
        hands.push(new PokerHand(cards));
    }

    hands.forEach((hand) => {
        const score = hand.calculateScore();
        scores[PokerHands[score]] += 1;
        if (score > PokerHands.ONE_PAIR)
            lines.push(`${++index}: ${PokerHands[score]}: ${hand.cards}`);
    });

    for (const cards of handCards) {
        deck.cards.push(...cards);
    }
}

console.log(scores);