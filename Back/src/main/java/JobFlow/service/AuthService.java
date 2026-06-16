package JobFlow.service;

import JobFlow.dtos.requests.AuthRequest;
import JobFlow.dtos.requests.RegisterRequest;
import JobFlow.dtos.responses.AuthResponse;
import JobFlow.entity.UserInfo;

import JobFlow.repository.UserInfoRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final UserInfoService userService;

    private final UserInfoRepository repository;

    public AuthResponse login(AuthRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
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

        String token = jwtService.generateToken(request.getUsername());

        return new AuthResponse(token);
    }
    public void register(RegisterRequest request) {

        UserInfo user = new UserInfo();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRoles("ROLE_USER");

        userService.addUser(user);
    }

}