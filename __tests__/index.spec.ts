import {Card, Faces, Suits} from "aces-high-core";
import {faceValues, PokerHand, PokerHands} from "../src";

describe("PokerHand", () => {
  describe("calculateScore", () => {
    describe("HIGH_CARD hands", () => {
      let cards: Card[];
      beforeEach(() => {
        cards = [];
        cards.push(new Card(Suits.CLUBS, Faces.ACE));
        cards.push(new Card(Suits.HEARTS, Faces.THREE));
        cards.push(new Card(Suits.CLUBS, Faces.EIGHT));
        cards.push(new Card(Suits.CLUBS, Faces.SIX));
        cards.push(new Card(Suits.CLUBS, Faces.FOUR));
      });

      it("should correctly identify a HIGH_CARD hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.HIGH_CARD);
      });

      it("should find the kicker card when hand contains ace", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.ACE);
      });

      it("should find the kicker card when hand contains no ace", async () => {
        cards.splice(0, 1, new Card(Suits.CLUBS, Faces.TWO));
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.EIGHT);
      });

      it("should not set FULL_HOUSE top and bottom", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseBottom).toBe(undefined);
        expect(hand.fullHouseTop).toBe(undefined);
      });
    });

    describe("ONE_PAIR hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
          new Card(Suits.CLUBS, Faces.TWO),
          new Card(Suits.CLUBS, Faces.FOUR),
          new Card(Suits.HEARTS, Faces.FOUR),
          new Card(Suits.CLUBS, Faces.NINE),
          new Card(Suits.CLUBS, Faces.JACK),
        ];
      });

      it("should correctly identify a ONE_PAIR hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.ONE_PAIR);
      });

      it("should find the kicker card when hand contains ace", async () => {
        cards.splice(0, 1, new Card(Suits.CLUBS, Faces.ACE));
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.ACE);
      });

      it("should find the kicker card when hand contains no ace", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.JACK);
      });

      it("should find the kicker card when hand contains pair of aces", async () => {
        cards.splice(
          1,
          2,
          new Card(Suits.CLUBS, Faces.ACE),
          new Card(Suits.DIAMONDS, Faces.ACE),
        );
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.JACK);
      });

      it("should find the kicker card when pair is highest value", async () => {
        cards.splice(
          1,
          2,
          new Card(Suits.CLUBS, Faces.KING),
          new Card(Suits.SPADES, Faces.KING),
        );
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.JACK);
      });

      it("should not set FULL_HOUSE top and bottom", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseBottom).toBe(undefined);
        expect(hand.fullHouseTop).toBe(undefined);
      });
    });

    describe("TWO_PAIR hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
          new Card(Suits.CLUBS, Faces.TWO),
          new Card(Suits.CLUBS, Faces.FOUR),
          new Card(Suits.HEARTS, Faces.FOUR),
          new Card(Suits.SPADES, Faces.NINE),
          new Card(Suits.DIAMONDS, Faces.NINE),
        ];
      });

      it("should correctly identify a TWO_PAIR hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.TWO_PAIR);
      });

      it("should find the kicker card when hand contains no ace", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.TWO);
      });

      it("should find the kicker card when hand contains ace", async () => {
        cards.splice(0, 1, new Card(Suits.CLUBS, Faces.ACE));
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.ACE);
      });

      it("should not set FULL_HOUSE top and bottom", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseBottom).toBe(undefined);
        expect(hand.fullHouseTop).toBe(undefined);
      });
    });

    describe("THREE_OF_A_KIND hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
          new Card(Suits.CLUBS, Faces.TWO),
          new Card(Suits.CLUBS, Faces.FOUR),
          new Card(Suits.HEARTS, Faces.NINE),
          new Card(Suits.SPADES, Faces.NINE),
          new Card(Suits.CLUBS, Faces.NINE),
        ];
      });

      it("should correctly identify a THREE_OF_A_KIND hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.THREE_OF_A_KIND);
      });

      it("should find the kicker card when hand contains no ace", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.FOUR);
      });

      it("should find the kicker card when hand contains an ace", async () => {
        cards.splice(0, 1, new Card(Suits.CLUBS, Faces.ACE));
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.ACE);
      });

      it("should correctly find the kicker card when it is higher than matched value", async () => {
        cards.splice(0, 1, new Card(Suits.CLUBS, Faces.KING));
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.KING);
      });

      it("should not set FULL_HOUSE top and bottom", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseBottom).toBe(undefined);
        expect(hand.fullHouseTop).toBe(undefined);
      });
    });

    describe("STRAIGHT hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
          new Card(Suits.DIAMONDS, Faces.TWO),
          new Card(Suits.CLUBS, Faces.FOUR),
          new Card(Suits.SPADES, Faces.THREE),
          new Card(Suits.DIAMONDS, Faces.SIX),
          new Card(Suits.SPADES, Faces.FIVE),
        ];
      });

      it("should correctly identify a STRAIGHT hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.STRAIGHT);
      });

      it("should correctly identify an ace high STRAIGHT hand", async () => {
        cards = [
          new Card(Suits.DIAMONDS, Faces.JACK),
          new Card(Suits.CLUBS, Faces.QUEEN),
          new Card(Suits.CLUBS, Faces.TEN),
          new Card(Suits.SPADES, Faces.ACE),
          new Card(Suits.DIAMONDS, Faces.KING),
        ];
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.STRAIGHT);
      });

      it("should find the correct kicker card when hand contains no ace", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.SIX);
      });

      it("should find the correct kicker card when the straight is ace low", async () => {
        cards.splice(3, 1, new Card(Suits.CLUBS, Faces.ACE));
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.FIVE);
      });

      it("should find the correct kicker card when the straight is ace high", async () => {
        cards = [
          new Card(Suits.DIAMONDS, Faces.JACK),
          new Card(Suits.CLUBS, Faces.QUEEN),
          new Card(Suits.CLUBS, Faces.TEN),
          new Card(Suits.SPADES, Faces.ACE),
          new Card(Suits.DIAMONDS, Faces.KING),
        ];
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.ACE);
      });

      it("should not set FULL_HOUSE top and bottom", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseBottom).toBe(undefined);
        expect(hand.fullHouseTop).toBe(undefined);
      });
    });

    describe("FLUSH hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
          new Card(Suits.CLUBS, Faces.KING),
          new Card(Suits.CLUBS, Faces.FIVE),
          new Card(Suits.CLUBS, Faces.THREE),
          new Card(Suits.CLUBS, Faces.EIGHT),
          new Card(Suits.CLUBS, Faces.NINE),
        ];
      });

      it("should correctly identify a FLUSH hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.FLUSH);
      });

      it("should find the kicker card when hand contains no ace", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.KING);
      });

      it("should find the kicker card when hand contains an ace", async () => {
        cards.splice(0, 1, new Card(Suits.CLUBS, Faces.ACE));
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.ACE);
      });

      it("should not set FULL_HOUSE top and bottom", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseBottom).toBe(undefined);
        expect(hand.fullHouseTop).toBe(undefined);
      });
    });

    describe("FULL_HOUSE hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
          new Card(Suits.DIAMONDS, Faces.ACE),
          new Card(Suits.CLUBS, Faces.NINE),
          new Card(Suits.HEARTS, Faces.ACE),
          new Card(Suits.HEARTS, Faces.NINE),
          new Card(Suits.SPADES, Faces.NINE),
        ];
      });

      it("should correctly identify a FULL_HOUSE hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.FULL_HOUSE);
      });

      it("should find the correct top", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseTop).toBe(faceValues.get(Faces.NINE));
      });

      it("should find the correct bottom", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.fullHouseBottom).toBe(faceValues.get(Faces.ACE));
      });
    });

    describe("FOUR_OF_A_KIND hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
          new Card(Suits.CLUBS, Faces.KING),
          new Card(Suits.DIAMONDS, Faces.FOUR),
          new Card(Suits.CLUBS, Faces.FOUR),
          new Card(Suits.SPADES, Faces.FOUR),
          new Card(Suits.HEARTS, Faces.FOUR),
        ];
      });

      it("should correctly identify a FOUR_OF_A_KIND hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.FOUR_OF_A_KIND);
      });

      it("should find the correct kicker card", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.KING);
      });
    });

    describe("STRAIGHT_FLUSH hands", () => {
      let cards: Card[];
      beforeEach(async () => {
        cards = [
            new Card(Suits.DIAMONDS, Faces.NINE),
            new Card(Suits.DIAMONDS, Faces.JACK),
            new Card(Suits.DIAMONDS, Faces.KING),
            new Card(Suits.DIAMONDS, Faces.QUEEN),
            new Card(Suits.DIAMONDS, Faces.TEN),
        ];
      });

      it("should correctly identify a STRAIGHT_FLUSH hand", async () => {
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.STRAIGHT_FLUSH);
      });

      it("should find the correct kicker card when hand contains no ace", async () => {
        const hand = new PokerHand(cards);

        hand.calculateScore();

        expect(hand.kicker.face).toBe(Faces.KING);
      });

      it("should find the correct kicker card when hand contains one ace", async () => {
        cards.splice(0, 1, new Card(Suits.DIAMONDS, Faces.ACE));
        const hand = new PokerHand(cards);

        const score = hand.calculateScore();

        expect(score).toBe(PokerHands.STRAIGHT_FLUSH);
        expect(hand.kicker.face).toBe(Faces.ACE);
      })
    });
  });
});
