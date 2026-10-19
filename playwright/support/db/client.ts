import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from './types';

let db: Kysely<Database> | undefined;

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Variável de ambiente ${name} não definida. Veja .env.example.`);
    }
    return value;
}

export function getDb(): Kysely<Database> {
    if (!db) {
        db = new Kysely<Database>({
            dialect: new PostgresDialect({
                pool: new Pool({
                    host: requireEnv('DB_HOST'),
                    port: Number(process.env.DB_PORT ?? 5432),
                    database: process.env.DB_NAME ?? 'postgres',
                    user: process.env.DB_USER ?? 'postgres',
                    password: requireEnv('DB_PASSWORD'),
                    ssl: { rejectUnauthorized: false }, // Supabase exige SSL
                    max: 2,
                }),
            }),
        });
    }
    return db;
}

export async function closeDb(): Promise<void> {
    await db?.destroy();
    db = undefined;
}
