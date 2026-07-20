package JobFlow.controller;

import JobFlow.dtos.requests.JobApplicationRequest;
import JobFlow.dtos.responses.JobApplicationResponse;
import JobFlow.dtos.responses.PageResponse;
import JobFlow.entity.JobApplication;
import JobFlow.entity.User;
import JobFlow.enums.ApplicationStatus;
import JobFlow.service.AuthService;
import JobFlow.service.JobApplicationService;
import JobFlow.service.UserInfoDetails;
import com.sun.security.auth.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService service;


    @PostMapping
    public JobApplicationResponse create(
            @RequestBody JobApplicationRequest request
    ) {

        return service.create(request);
    }

    @GetMapping
    public PageResponse<JobApplicationResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAll(page, size);
    }

    @GetMapping("/user")
    public PageResponse<JobApplicationResponse> getByUser(
            @AuthenticationPrincipal UserInfoDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getByUser(userDetails.getId(), page, size);
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