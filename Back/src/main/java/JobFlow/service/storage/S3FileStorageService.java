package JobFlow.service.storage;



import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class S3FileStorageService implements FileStorageService {

    @Override
    public UploadResult upload(MultipartFile file) {
        // TODO: AWS SDK integration later
        return null;
    }

    @Override
    public void delete(String fileUrl) {
        // TODO: delete from S3
    }
}