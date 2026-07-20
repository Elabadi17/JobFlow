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
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")    private String password;
    private boolean enabled ;
    private Role role;


}