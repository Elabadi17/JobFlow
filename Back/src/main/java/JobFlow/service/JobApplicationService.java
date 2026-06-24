package JobFlow.service;

import JobFlow.dtos.requests.JobApplicationRequest;
import JobFlow.dtos.responses.JobApplicationResponse;
import JobFlow.dtos.responses.PageResponse;
import JobFlow.entity.*;
import JobFlow.enums.ApplicationStatus;
import JobFlow.mappers.JobApplicationMapper;
import JobFlow.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final CompanyRepository companyRepository;
    private final CVFileRepository cvRepository;
    private final UserInfoRepository userRepository;
    private final JobApplicationMapper mapper;

    public JobApplicationResponse create(
            UUID userId,
            JobApplicationRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        CVFile cv = cvRepository.findById(request.getCvId())
                .orElseThrow(() -> new RuntimeException("CV not found"));

        JobApplication app = new JobApplication();

        app.setPosition(request.getPosition());
        app.setNotes(request.getNotes());
        app.setSalaryMin(request.getSalaryMin());
        app.setSalaryMax(request.getSalaryMax());

        app.setUser(user);
        app.setCompany(company);
        app.setCvFile(cv);

        return mapper.toResponse(repository.save(app));
    }

    public PageResponse<JobApplicationResponse> getAll(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<JobApplication> result = repository.findAll(pageable);

        List<JobApplicationResponse> content = result.getContent()
                .stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    public PageResponse<JobApplicationResponse> getByUser(UUID userId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<JobApplication> result =
                repository.findByUserId(userId, pageable);

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

    public JobApplicationResponse updateStatus(UUID id, ApplicationStatus status) {

        JobApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        app.setStatus(status);

        return mapper.toResponse(repository.save(app));
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}