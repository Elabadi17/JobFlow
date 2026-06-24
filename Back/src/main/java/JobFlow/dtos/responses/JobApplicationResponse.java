package JobFlow.dtos.responses;

import JobFlow.enums.ApplicationStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class JobApplicationResponse {

    private UUID id;

    private String position;

    private ApplicationStatus status;

    private String notes;

    private Integer salaryMin;

    private Integer salaryMax;

    private String companyName;

    private String cvFileName;
}