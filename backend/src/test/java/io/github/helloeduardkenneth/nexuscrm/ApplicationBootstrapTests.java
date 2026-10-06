package io.github.helloeduardkenneth.nexuscrm;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mockStatic;

class ApplicationBootstrapTests {

    @Test
    void mainForwardsArgumentsToSpringBoot() {
        String[] arguments = {"--server.port=0"};

        try (MockedStatic<SpringApplication> spring = mockStatic(SpringApplication.class)) {
            NexusCrmApplication.main(arguments);

            spring.verify(() -> SpringApplication.run(NexusCrmApplication.class, arguments));
            spring.verifyNoMoreInteractions();
        }
    }

    @Test
    void mainDoesNotHideStartupFailure() {
        String[] arguments = {};
        IllegalStateException failure = new IllegalStateException("Startup failed");

        try (MockedStatic<SpringApplication> spring = mockStatic(SpringApplication.class)) {
            spring.when(() -> SpringApplication.run(NexusCrmApplication.class, arguments))
                    .thenThrow(failure);

            assertSame(failure, assertThrows(IllegalStateException.class,
                    () -> NexusCrmApplication.main(arguments)));
        }
    }
}
