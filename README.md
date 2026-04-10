# What Play Next Back

REST API that syncs your Steam library and calculates a **quality-per-hour score** for every game by combining review data from **Metacritic** with completion times from **HowLongToBeat**. The result is a prioritized backlog that surfaces the best gaming experiences relative to time investment.

> Frontend repository: [wpn_front](https://github.com/AdrianMayorDev/wpn_front)

## Features

- **Steam Library Sync** — imports your owned games via the Steam Web API
- **Quality-per-Hour Scoring** — computes ratio scores (Metacritic user/press score ÷ completion time) across main story, extras, completionist, and combined playthroughs
- **Metacritic Scraping** — fetches press scores, user scores, genres, platforms, and release dates
- **HowLongToBeat Scraping** — fetches main story, main + extras, completionist, and combined completion times
- **Custom Game Statuses** — create, assign, update, and delete custom status categories (e.g. "Playing", "Backlog", "Completed")
- **JWT Authentication** — secure registration, login, and token-based route protection
- **User Management** — full CRUD for user accounts with bcrypt password hashing

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MySQL 2 (connection pooling)
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Scraping:** Puppeteer (headless browser)
- **Validation:** Custom middleware + input validators
- **Logging:** Custom file-rotating logger with log levels
- **Dev Tooling:** ESLint, Prettier, Husky, lint-staged, Nodemon

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8.0
- A [Steam Web API key](https://steamcommunity.com/dev/apikey)

### Installation

```bash
git clone git@github.com:AdrianMayorDev/wpn_back.git
cd wpn_back
npm install
```

### Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable        | Description                                  |
| --------------- | -------------------------------------------- |
| `NODE_ENV`      | `development` / `production` / `test`        |
| `SERVER_PORT`   | Port the server listens on (default: `3005`) |
| `JWT_SECRET`    | Secret key for signing JWT tokens            |
| `STEAM_API_KEY` | Your Steam Web API key                       |
| `DB_HOST`       | MySQL host                                   |
| `DB_PORT`       | MySQL port (default: `3306`)                 |
| `DB_USER`       | MySQL user                                   |
| `DB_PASSWORD`   | MySQL password                               |
| `DB_NAME`       | MySQL database name                          |
| `LOG_LEVEL`     | `debug` / `info` / `warn` / `error`          |

### Running

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint      | Description           | Auth |
| ------ | ------------- | --------------------- | ---- |
| `POST` | `/user`       | Register a new user   | No   |
| `POST` | `/user/login` | Login and receive JWT | No   |

### Users

| Method   | Endpoint        | Description         | Auth |
| -------- | --------------- | ------------------- | ---- |
| `GET`    | `/user/:userId` | Get user by ID      | No   |
| `PUT`    | `/user`         | Update current user | Yes  |
| `DELETE` | `/user`         | Delete current user | Yes  |

### Library

| Method | Endpoint                | Description                  | Auth |
| ------ | ----------------------- | ---------------------------- | ---- |
| `GET`  | `/library`              | Get user's game library      | Yes  |
| `GET`  | `/library/game/:gameId` | Get game details with scores | No   |
| `POST` | `/library/sync`         | Sync Steam library           | Yes  |

### Game Statuses

| Method   | Endpoint                 | Description              | Auth |
| -------- | ------------------------ | ------------------------ | ---- |
| `GET`    | `/library/status`        | Get game status          | Yes  |
| `POST`   | `/library/status`        | Create a status category | Yes  |
| `POST`   | `/library/assign-status` | Assign status to a game  | Yes  |
| `PUT`    | `/library/status`        | Update a status category | Yes  |
| `DELETE` | `/library/status`        | Delete a status category | Yes  |
| `DELETE` | `/library/game`          | Remove game from library | Yes  |

## Project Structure

```
src/
├── controllers/         # Route handlers
│   ├── libraryController/
│   └── userController/
├── DTO/                 # Data Transfer Objects (database layer)
│   ├── base/            # BaseQuery class + connection pool
│   ├── gamesModel/
│   ├── gameStatusModel/
│   ├── libraryModel/
│   └── usersModel/
├── interfaces/          # TypeScript interfaces + field mappings
├── middlewares/          # Auth, error handling, service injection
├── routes/              # Express route definitions
├── services/            # Business logic
│   ├── libraryService/
│   ├── scrapingService/
│   └── userService/
├── types/               # Express type augmentations
├── utils/               # Logger, validation, errors, response helpers
├── app.ts               # Express app setup
├── config.ts            # Environment configuration
└── server.ts            # Route mounting + middleware chain
```

## Author

**Adrian Mayor** — [GitHub](https://github.com/AdrianMayorDev)
