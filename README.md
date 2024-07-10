# Node.js API Project

## Description
This project is a Node.js API with MySQL database integration using Sequelize ORM. It includes features for user management, database migrations, and seeding.

## Installation


npm install


## Database Setup

To set up the database, run the following commands:


### Environment Variables

To set up your environment variables:

1. Locate the `.env.example` file in the root directory of the project.
2. Create a copy of this file and name it `.env`.
3. Open the `.env` file and fill in the necessary values for each variable.

#### For Linux/macOS users:

You can create the `.env` file by running the following command in your terminal:

```bash
cp .env.example .env
```

#### For Windows users:

You can create the `.env` file by running the following command in Command Prompt:

```cmd
copy .env.example .env
```

After creating the `.env` file:

1. Open the `.env` file in a text editor.
2. Replace the placeholder values with your actual configuration details.


# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed

# To reset the database (undo all migrations, migrate again, and seed)
npm run db:reset


## Usage

To start the server:


npm start


For development with auto-restart:


npm run dev


## Features
- User authentication
- Database migrations
- Database seeding
- Environment-based configuration
- Logging

## Project Structure

.
├── src
│   ├── config
│   │   ├── database.js
│   │   └── logger.js
│   ├── migrations
│   ├── models
│   ├── seeders
│   └── app.js
├── .sequelizerc
├── server.js
└── package.json


## Key Files
- `.sequelizerc`: Configures paths for Sequelize CLI
- `src/config/database.js`: Database configuration and connection setup
- `server.js`: Entry point of the application

## Scripts
- `npm start`: Start the server
- `npm run dev`: Start the server with nodemon for development
- `npm test`: Run tests
- `npm run db:migrate`: Run database migrations
- `npm run db:seed`: Run database seeders
- `npm run db:reset`: Reset database (undo migrations, migrate, and seed)

## Generating Migrations and Seeders

To generate migrations and seeders using sequelize-cli, use the following commands:

# Generate a new migration
npx sequelize-cli migration:generate --name migration-name

# Generate a new seeder
npx sequelize-cli seed:generate --name seeder-name

Replace 'migration-name' and 'seeder-name' with appropriate names for your migration or seeder.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
