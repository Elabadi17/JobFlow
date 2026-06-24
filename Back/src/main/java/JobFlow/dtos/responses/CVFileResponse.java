package JobFlow.dtos.responses;

import lombok.Data;

import java.util.UUID;

@Data
public class CVFileResponse {

    private UUID id;

    private String hash;

    private String fileName;

    private String fileUrl;

    private String label;

    private String note;

}