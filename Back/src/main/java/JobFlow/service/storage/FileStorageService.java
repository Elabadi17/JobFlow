package JobFlow.service.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    UploadResult upload(MultipartFile file);

    void delete(String fileUrl);
}