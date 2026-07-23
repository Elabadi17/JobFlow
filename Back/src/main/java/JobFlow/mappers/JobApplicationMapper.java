package JobFlow.mappers;

import JobFlow.entity.JobApplication;
import JobFlow.dtos.responses.JobApplicationResponse;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobApplicationMapper {

    JobApplicationResponse toResponse(JobApplication entity);
}