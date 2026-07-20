package JobFlow.entity;

import JobFlow.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    private String firstName;
    private String lastName;
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    private boolean enabled = true;
    @Enumerated
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<JobApplication> applications;

    @OneToMany(mappedBy = "user")
    private List<CVFile> cvs;

}
