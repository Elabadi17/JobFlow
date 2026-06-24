package JobFlow.mappers;

import JobFlow.entity.JobApplication;
import JobFlow.dtos.responses.JobApplicationResponse;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobApplicationMapper {

    @Mapping(source = "company.name", target = "companyName")
    @Mapping(source = "cvFile.fileName", target = "cvFileName")
    JobApplicationResponse toResponse(JobApplication entity);
}