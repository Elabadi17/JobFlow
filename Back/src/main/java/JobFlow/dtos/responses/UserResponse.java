package JobFlow.dtos.responses;

import JobFlow.enums.Role;
import lombok.Data;

@Data
public class UserResponse extends BaseResponse{
    private String firstName;
    private String lastName;
    private String email;
    private boolean enabled;
    private Role role;

}