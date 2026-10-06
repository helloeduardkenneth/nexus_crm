package io.github.helloeduardkenneth.nexuscrm;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.postgresql.PostgreSQLContainer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Import(PostgreSqlMigrationIT.PostgresConfiguration.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class PostgreSqlMigrationIT {

    private final DataSource dataSource;
    private final Flyway flyway;
    private final PostgreSQLContainer postgres;
    private final JdbcTemplate jdbc;

    @Autowired
    PostgreSqlMigrationIT(DataSource dataSource, Flyway flyway, PostgreSQLContainer postgres) {
        this.dataSource = dataSource;
        this.flyway = flyway;
        this.postgres = postgres;
        this.jdbc = new JdbcTemplate(dataSource);
    }

    @Test
    void productionConfigurationConnectsAndMigratesFreshPostgres() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            assertEquals(postgres.getJdbcUrl(), connection.getMetaData().getURL());
        }
        assertEquals(postgres.getDatabaseName(),
                jdbc.queryForObject("SELECT current_database()", String.class));
        String serverVersion = jdbc.queryForObject("SHOW server_version", String.class);
        assertEquals("18.6", serverVersion.split(" ", 2)[0]);
        assertMigrationState();
    }

    @Test
    void migratingAgainDoesNotReapplyV1OrChangeHistory() {
        assertMigrationState();
        List<Map<String, Object>> historyBefore = migrationHistory();

        assertEquals(0, flyway.migrate().migrationsExecuted);

        assertMigrationState();
        assertEquals(historyBefore, migrationHistory());
    }

    private void assertMigrationState() {
        assertEquals(1, jdbc.queryForObject("""
                SELECT count(*) FROM information_schema.schemata
                WHERE schema_name = 'nexuscrm'
                """, Integer.class));
        assertEquals("flyway_schema_history", jdbc.queryForObject("""
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'flyway_schema_history'
                """, String.class));

        List<Map<String, Object>> history = migrationHistory();
        assertEquals(1, history.size());
        Map<String, Object> migration = history.getFirst();
        assertEquals(1, migration.get("installed_rank"));
        assertEquals("1", migration.get("version"));
        assertEquals("create nexuscrm schema", migration.get("description"));
        assertEquals("SQL", migration.get("type"));
        assertEquals("V1__create_nexuscrm_schema.sql", migration.get("script"));
        assertEquals(Boolean.TRUE, migration.get("success"));
        assertNotNull(migration.get("checksum"));
        assertEquals(0, jdbc.queryForObject("""
                SELECT count(*) FROM information_schema.tables
                WHERE table_schema = 'nexuscrm'
                """, Integer.class));
    }

    private List<Map<String, Object>> migrationHistory() {
        return jdbc.queryForList("""
                SELECT installed_rank, version, description, type, script, checksum,
                       installed_by, installed_on, execution_time, success
                FROM public.flyway_schema_history
                ORDER BY installed_rank
                """);
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class PostgresConfiguration {

        @Bean
        @ServiceConnection
        PostgreSQLContainer postgres() {
            return new PostgreSQLContainer("postgres:18.6")
                    .withDatabaseName("nexuscrm_test")
                    .withUsername("nexuscrm_test")
                    .withPassword(UUID.randomUUID().toString())
                    .withStartupTimeout(Duration.ofSeconds(60))
                    .withReuse(false)
                    .withLabel("nexuscrm.task", "TASK-0008");
        }
    }
}
