package JobFlow.mappers;

import JobFlow.entity.CVFile;
import JobFlow.dtos.requests.CVFileRequest;
import JobFlow.dtos.responses.CVFileResponse;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CVFileMapper {

    CVFileResponse toResponse(CVFile entity);

    CVFile toEntity(CVFileRequest request);
}