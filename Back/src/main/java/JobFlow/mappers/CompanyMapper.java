package JobFlow.mappers;

import JobFlow.entity.Company;
import JobFlow.dtos.requests.CompanyRequest;
import JobFlow.dtos.responses.CompanyResponse;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyMapper {

    CompanyResponse toResponse(Company company);

    Company toEntity(CompanyRequest request);
}