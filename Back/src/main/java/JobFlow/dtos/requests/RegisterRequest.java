package JobFlow.dtos.requests;

import JobFlow.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class RegisterRequest {

    private String firstname;

    private String lastname;
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;
    @NotBlank
    @Size(max = 50)
    @Email
    private String password;
    private boolean enabled = true;
    private Role role=Role.ROLE_USER;


}