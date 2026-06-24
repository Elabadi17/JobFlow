package JobFlow.service.storage;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UploadResult {

    private String path;

    private String hash;

}