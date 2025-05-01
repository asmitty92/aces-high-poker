# Aces High Poker

Aces High Poker is a TypeScript-based game engine designed to simulate various types of Poker games. Built on the foundational [Aces High Core](https://github.com/asmitty92/aces-high-core), this engine provides flexible and extendable tools for implementing Poker game logic, hand evaluation, and rule enforcement.

## Features

- **Hand Evaluation**:
  - Detects hand rankings such as Royal Flush, Straight Flush, Four of a Kind, etc.
  - Supports tie-breaking logic for determining winners.

- **Game Variants**:
  - Designed to be extendable for multiple Poker variants (e.g., Texas Hold'em, Omaha, Seven-Card Stud).

- **Player Management**:
  - Utilities for managing player actions, bets, and chip stacks.

- **TypeScript Support**:
  - Fully written in TypeScript for type safety and modern JavaScript features.

## Installation

To install the engine, use npm or yarn:

```bash
npm install aces-high-poker
```

or

```bash
yarn add aces-high-poker
```

## Getting Started

Here’s a quick example of how to use Aces High Poker to evaluate a Poker hand:

```typescript
import { PokerHand, Card, Suits, Faces } from 'aces-high-poker';

// Create a Poker hand
const hand = new PokerHand([
  new Card(Suits.HEARTS, Faces.ACE),
  new Card(Suits.HEARTS, Faces.KING),
  new Card(Suits.HEARTS, Faces.QUEEN),
  new Card(Suits.HEARTS, Faces.JACK),
  new Card(Suits.HEARTS, Faces.TEN),
]);

// Evaluate the hand
const ranking = hand.getRanking();
console.log('Hand ranking:', ranking); // Output: Royal Flush
```

## Development

This repository is under active development. Below are some key areas of focus:

- **Core Ranking Logic**: Fully implemented and tested.
- **Game Variants**: Currently focused on Texas Hold'em.
- **Future Plans**: Adding support for additional Poker variants and multiplayer functionality.

## Roadmap

- Add support for additional Poker variants (Omaha, Seven-Card Stud).
- Integrate with a UI for interactive gameplay.
- Create AI opponents with varying skill levels.
- Expand test coverage for edge cases and multiplayer scenarios.

## Contributing

We welcome contributions! To get started:

1. Fork this repository.
2. Clone your fork and install dependencies:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aces-high-poker.git
   cd aces-high-poker
   npm install
   ```
3. Make your changes and ensure all tests pass:
   ```bash
   npm test
   ```
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under The Unlicense. See the [LICENSE](LICENSE) file for details.

## Related Projects

- [Aces High Core](https://github.com/asmitty92/aces-high-core): The foundational library for card game engines.
- [Aces High Cribbage](https://github.com/asmitty92/aces-high-cribbage): A Cribbage game engine utilizing Aces High Core.

## Contact

For questions or suggestions, feel free to open an issue or contact [@asmitty92](https://github.com/asmitty92) directly.