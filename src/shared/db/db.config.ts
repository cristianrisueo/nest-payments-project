import { registerAs } from '@nestjs/config';

// DbOptions is an interface that defines the options for database connections.
export interface DbOptions {
  maxPoolSize: number;
  serverSelectionTimeoutMS: number;
  socketTimeoutMS: number;
}

// DbConnection is an interface that defines the structure of a database connection configuration.
export interface DbConnection {
  uri: string;
  options: DbOptions;
}

// DbConfig is an interface that defines the structure of the database configuration object.
export interface DbConfig {
  users: DbConnection;
  payments: DbConnection;
}

/**
 * Database configuration for the application.
 * This configuration is used to set up connections to the users and payments databases.
 * It retrieves the database URLs from environment variables and applies default options.
 */
export const dbConfig = registerAs('db', (): DbConfig => {
  // Retrieves the database URLs from environment variables
  const usersDbUrl = process.env.USERS_DB_URL;
  const paymentsDbUrl = process.env.PAYMENTS_DB_URL;

  // Validates that the database URLs are defined
  if (!usersDbUrl) throw new Error('USERS_DB_URL is not defined');
  if (!paymentsDbUrl) throw new Error('PAYMENTS_DB_URL is not defined');

  // Returns the databases configuration object
  return {
    users: {
      uri: usersDbUrl,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      },
    },
    payments: {
      uri: paymentsDbUrl,
      options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      },
    },
  };
});
