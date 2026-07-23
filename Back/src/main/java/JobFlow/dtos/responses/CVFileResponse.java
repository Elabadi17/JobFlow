package JobFlow.dtos.responses;

import JobFlow.entity.CVFile;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CVFileResponse extends BaseResponse {


    private String hash;

    private String fileName;

    private String fileUrl;

    private String label;

    private String note;

    private boolean isDefault;

}