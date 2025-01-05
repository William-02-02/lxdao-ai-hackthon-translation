# Translation Task Platform

A decentralized translation task platform built with Next.js that enables DAO organizers to publish translation tasks, leverages AI for initial translations, and implements a community-driven review and voting system.

## Features

### Task Management
- **Task Creation**: DAO organizers can publish translation tasks with source content
- **Multi-language Support**: Support for multiple source and target languages
- **Task Status Tracking**: Complete task lifecycle management from creation to completion

### Translation Process
- **AI-Powered Translation**: Initial translations performed by AI
- **Paragraph-Level Translation**: Content is divided into paragraphs for granular translation management
- **Translation Status**: Track status of each paragraph (pending, translated, reviewing, voting, approved, rejected)

### Review System
- **Professional Review**: Qualified reviewers can approve or edit translations
- **Direct Edit Capability**: Reviewers can make direct modifications to translations
- **Review Comments**: Reviewers can provide feedback and comments

### Voting Mechanism
- **Community Voting**: Users can vote on reviewer decisions
- **2/3 Majority System**: Implements a 2/3 majority voting mechanism for approval/rejection
- **Vote Tracking**: Comprehensive tracking of votes with user comments
- **Progress Visualization**: Visual representation of voting progress

### User Roles
- DAO Organizers: Create and manage translation tasks
- Translators: Submit translations
- Reviewers: Review and edit translations
- Community Members: Vote on reviews

### Bounty System
- Task-based bounty allocation
- Performance-based rewards
- Transparent distribution system

## Technical Stack

- **Frontend**: Next.js
- **State Management**: React Hooks
- **UI Components**: Tailwind CSS, HeadlessUI
- **Storage**: Local Storage (current implementation)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── tasks/          # Task-related components
│   ├── review/         # Review system components
│   ├── vote/           # Voting system components
│   └── common/         # Shared components
├── types/              # TypeScript type definitions
├── services/           # Business logic and storage services
└── utils/             # Utility functions
```

## Development Mode Features

- **Account Switcher**: Easily switch between different user roles for testing
- **Mock Data**: Pre-configured mock data for testing various scenarios
- **Local Storage**: Persistent storage for development testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js
- Styled with Tailwind CSS
- UI Components from HeadlessUI
