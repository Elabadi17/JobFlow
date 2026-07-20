package JobFlow.controller;

import JobFlow.dtos.requests.CompanyRequest;
import JobFlow.dtos.responses.CompanyResponse;
import JobFlow.dtos.responses.PageResponse;
import JobFlow.entity.Company;
import JobFlow.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;



@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService service;

    @PostMapping
    public CompanyResponse create(@RequestBody CompanyRequest request) {
        return service.create(request);
    }

    @GetMapping
    public PageResponse<CompanyResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getAll(page, size);
    }

    @GetMapping("/{id}")
    public CompanyResponse getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public CompanyResponse update(
            @PathVariable UUID id,
            @RequestBody CompanyRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}