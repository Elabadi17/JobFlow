package JobFlow.service;

import JobFlow.dtos.requests.CompanyRequest;
import JobFlow.dtos.responses.CompanyResponse;
import JobFlow.dtos.responses.PageResponse;
import JobFlow.entity.Company;
import JobFlow.mappers.CompanyMapper;
import JobFlow.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class CompanyService {

    private final CompanyRepository repository;
    private final CompanyMapper mapper;

    public CompanyResponse create(CompanyRequest request) {

        Company company = mapper.toEntity(request);

        return mapper.toResponse(repository.save(company));
    }

    public PageResponse<CompanyResponse> getAll(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Company> result = repository.findAll(pageable);

        return new PageResponse<>(
                result.getContent()
                        .stream()
                        .map(mapper::toResponse)
                        .toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }
    public CompanyResponse getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    public CompanyResponse update(UUID id, CompanyRequest request) {

        Company company = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setName(request.getName());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());

        return mapper.toResponse(repository.save(company));
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}