package JobFlow.dtos.responses;

import lombok.Data;

import java.util.UUID;

@Data
public class CompanyResponse {

    private UUID id;
    private String name;
    private String website;
    private String location;
}