import { Card, StandardDeck } from "aces-high-core";
import { PokerHand, PokerHands } from "./src";
import fiveCardScores from "./five-card-scores.json";
import sevenCardScores from "./seven-card-scores.json";
import * as fs from "fs";

function clearScores(scores: any): void {
  scores.high_card = 0;
  scores.one_pair = 0;
  scores.two_pair = 0;
  scores.three_of_a_kind = 0;
  scores.straight = 0;
  scores.flush = 0;
  scores.full_house = 0;
  scores.four_of_a_kind = 0;
  scores.straight_flush = 0;
  scores.above_one_pair.count = 0;
  scores.above_one_pair.percent = 0.0;
}

function scoreHands(deck: StandardDeck, numberOfHands: number, numberOfCards: number, scores: any) {
  clearScores(scores);
  let index = 0;
  const lines: string[] = [];
  for (let i = 0; i < numberOfHands; i++) {
    deck.fullShuffle();

    const handCards: Card[][] = [[], [], [], [], []];

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
      scores[PokerHands[score].toLowerCase()] += 1;
      if (score > PokerHands.ONE_PAIR) lines.push(`${++index}: ${PokerHands[score]}: ${hand.cards}`);
    });

    for (const cards of handCards) {
      deck.cards.push(...cards);
    }
  }

  scores.above_one_pair.count = lines.length;
  scores.above_one_pair.percent = (lines.length / (numberOfHands * 5)) * 100;

  const handSize = numberOfCards === 5 ? "five" : "seven";
  fs.writeFileSync(`${handSize}-card-scores.json`, JSON.stringify(scores));
  fs.writeFileSync(`${handSize}-card-hands.txt`, lines.join("\n"));

  console.log(scores.high_card);
}

const deck = new StandardDeck();
const hands = 2000;

scoreHands(deck, hands, 5, fiveCardScores);
scoreHands(deck, hands, 7, sevenCardScores);
