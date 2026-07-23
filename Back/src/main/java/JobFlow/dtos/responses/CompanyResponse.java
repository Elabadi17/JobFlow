package JobFlow.dtos.responses;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CompanyResponse extends BaseResponse {

    private String name;
    private String website;
    private String location;
}