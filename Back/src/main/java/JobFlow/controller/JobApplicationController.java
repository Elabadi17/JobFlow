package JobFlow.controller;

import JobFlow.dtos.requests.JobApplicationRequest;
import JobFlow.dtos.responses.JobApplicationResponse;
import JobFlow.dtos.responses.PageResponse;
import JobFlow.entity.JobApplication;
import JobFlow.enums.ApplicationStatus;
import JobFlow.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService service;

    @PostMapping("/{userId}")
    public JobApplicationResponse create(
            @PathVariable UUID userId,
            @RequestBody JobApplicationRequest request
    ) {
        return service.create(userId, request);
    }

    @GetMapping
    public PageResponse<JobApplicationResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAll(page, size);
    }

    @GetMapping("/user/{userId}")
    public PageResponse<JobApplicationResponse> getByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getByUser(userId, page, size);
    }

    @PatchMapping("/{id}/status")
    public JobApplicationResponse updateStatus(
            @PathVariable UUID id,
            @RequestParam ApplicationStatus status
    ) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}