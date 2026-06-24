package JobFlow.service;
import JobFlow.repository.UserInfoRepository;
import JobFlow.entity.User;

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

@Service
@Primary
public class UserInfoService implements UserDetailsService {

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder encoder;

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

    public User update(UUID id, User user) {
        User existing = getById(id);

        existing.setFirstName(user.getFirstName());
        existing.setEmail(user.getEmail());

        return repository.save(existing);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

}
