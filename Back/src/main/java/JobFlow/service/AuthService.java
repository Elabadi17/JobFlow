package JobFlow.service;

import JobFlow.dtos.requests.AuthRequest;
import JobFlow.dtos.requests.RegisterRequest;
import JobFlow.dtos.responses.AuthResponse;
import JobFlow.entity.JobApplication;
import JobFlow.entity.User;

import JobFlow.enums.Role;
import JobFlow.mappers.UserMapper;
import JobFlow.repository.UserInfoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    private final UserInfoRepository repository;

    public AuthResponse login(AuthRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
        // Utilisateur désactivé → renvoyer 401 avec message clair
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User disabled");
    } catch (org.springframework.security.authentication.BadCredentialsException e) {
        // Email ou mot de passe incorrect
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));


        var jwt = jwtService.generateToken(user);

        return new AuthResponse(userMapper.entityToResponse(user), jwt);
    }
    public AuthResponse register(RegisterRequest request) {

        var user = new User(
                request.getFirstname(),
                request.getLastname(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.isEnabled(),
                request.getRole(),
                Collections.emptyList(),
                Collections.emptyList()

        );
        user.setEnabled(true);
        user.setRole(Role.ROLE_USER);
        var jwt = jwtService.generateToken(user);

        repository.save(user);
        return new AuthResponse(userMapper.entityToResponse(user), jwt);
    }


    public User getCurrentUser() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return repository.findByEmail(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}