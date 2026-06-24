package JobFlow.dtos.requests;

import JobFlow.enums.ApplicationStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class JobApplicationRequest {

    private String position;

    private String notes;

    private Integer salaryMin;

    private Integer salaryMax;

    private UUID companyId;

    private UUID cvId;
}