package JobFlow.controller;



import JobFlow.dtos.requests.UpdateUserRequest;
import JobFlow.dtos.responses.UserResponse;
import JobFlow.entity.User;
import JobFlow.service.UserInfoDetails;
import JobFlow.service.UserInfoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*") // Autoriser toutes les origines et tous les en-têtes
public class UserController {

    private final UserInfoService service;

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }


    @GetMapping("/user/userProfile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public boolean userProfile() {
        return true;
    }

    @GetMapping("/admin/adminProfile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }



    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id:[0-9a-fA-F-]{36}}")
    public User getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        UserInfoDetails userDetails = (UserInfoDetails) authentication.getPrincipal();

        return service.getMe(userDetails.getId());
    }
    @PutMapping("/{id}")
    public UserResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {

        return service.update(id, request);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

}
