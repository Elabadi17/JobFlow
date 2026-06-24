package JobFlow.init;


import JobFlow.config.ApplicationProperties;
import JobFlow.entity.User;
import JobFlow.enums.Role;
import JobFlow.repository.UserInfoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserInitializer implements CommandLineRunner {

    private final UserInfoRepository repository;

    private final PasswordEncoder encoder;

    private final ApplicationProperties properties;

    @Override
    public void run(String... args) {
/*
        for (ApplicationProperties.InitialUser seedUser :
                properties.getUsers().getSeed()) {

            if (repository.findByEmail(seedUser.getEmail()).isPresent()) {
                continue;
            }

            User user = new User();

            user.setFirstName(seedUser.getName());
            user.setEmail(seedUser.getEmail());

            user.setPassword(
                    encoder.encode(seedUser.getPassword())
            );

            user.setRole(Role.valueOf(seedUser.getRole()));

            repository.save(user);
        }*/
    }
}