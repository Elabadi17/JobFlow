package JobFlow.mappers;

import JobFlow.dtos.requests.CVFileRequest;
import JobFlow.dtos.responses.CVFileResponse;
import JobFlow.entity.CVFile;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CVFileMapper {

    @Mapping(
            target = "fileUrl",
            expression =
                    "java(extractFileName(entity.getFileUrl()))"
    )
    CVFileResponse toResponse(CVFile entity);

    CVFile toEntity(CVFileRequest request);

    default String extractFileName(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        // déjà juste un nom
        if (!value.contains("/") && !value.contains("\\")) {
            return value;
        }

        // URL HTTP
        if (value.startsWith("http")) {

            int index = value.lastIndexOf('/');

            if (index >= 0) {
                return value.substring(index + 1);
            }

            return value;
        }

        // ancien chemin Windows
        value = value.replace("\\", "/");

        int index = value.lastIndexOf('/');

        if (index >= 0) {
            return value.substring(index + 1);
        }

        return value;

    }

}