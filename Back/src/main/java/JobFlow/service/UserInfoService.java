package JobFlow.service;
import JobFlow.dtos.requests.UpdateUserRequest;
import JobFlow.dtos.responses.UserResponse;
import JobFlow.repository.UserInfoRepository;
import JobFlow.entity.User;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import JobFlow.mappers.UserMapper;
@Service
@Primary
@RequiredArgsConstructor
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userDetail = repository.findByEmail((username))
                .orElseThrow(() -> new UsernameNotFoundException(
                "User Not Found with username: " + username));

        return UserInfoDetails.build(userDetail);
    }


    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserResponse getMe(UUID id) {
        User user =  repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.entityToResponse(user);
    }

    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        repository.save(user);

        return userMapper.entityToResponse(user);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

}
