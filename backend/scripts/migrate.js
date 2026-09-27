const fs = require('node:fs')
const path = require('node:path')
const pool = require('../src/db')

const migrationsDirectory = path.join(__dirname, '..', '..', 'database', 'migrations')

async function runMigrations() {
  const client = await pool.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const appliedResult = await client.query(
      'SELECT version FROM schema_migrations',
    )
    const appliedVersions = new Set(
      appliedResult.rows.map((migration) => migration.version),
    )
    const migrationFiles = fs
      .readdirSync(migrationsDirectory)
      .filter((file) => /^\d+.*\.sql$/.test(file))
      .sort()

    for (const file of migrationFiles) {
      if (appliedVersions.has(file)) {
        continue
      }

      const sql = fs.readFileSync(
        path.join(migrationsDirectory, file),
        'utf8',
      )

      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [file],
        )
        await client.query('COMMIT')
        console.log(`Applied migration ${file}`)
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      }
    }
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()
  .catch((error) => {
    console.error(
      'Migration failed:',
      error.message || error.code || 'Unknown PostgreSQL error',
    )
    process.exitCode = 1
  })