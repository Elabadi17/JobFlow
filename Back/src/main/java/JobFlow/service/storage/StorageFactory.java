package JobFlow.service.storage;

import JobFlow.config.ApplicationProperties;



import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StorageFactory {

    private final LocalFileStorageService local;

    private final S3FileStorageService s3;

    private final ApplicationProperties properties;

    public FileStorageService getStorage() {

        String type =
                properties
                        .getStorage()
                        .getType();

        return switch (
                type.toLowerCase()
                ) {

            case "s3" -> s3;

            case "local" -> local;

            default ->
                    throw new RuntimeException(
                            "Unknown storage type"
                    );

        };

    }

}