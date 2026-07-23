package JobFlow.dtos.requests;

import JobFlow.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {

    private String firstName;

    private String lastName;


    private String password;

}