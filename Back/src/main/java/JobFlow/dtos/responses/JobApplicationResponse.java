package JobFlow.dtos.responses;

import JobFlow.entity.Company;
import JobFlow.enums.ApplicationStatus;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class JobApplicationResponse extends BaseResponse {


    private String position;

    private ApplicationStatus status;

    private String notes;

    private Integer salaryMin;

    private Integer salaryMax;

    private CompanyResponse company;

    private CVFileResponse cvFile;
}