package JobFlow.controller;

import JobFlow.dtos.requests.CVFileRequest;
import JobFlow.dtos.responses.CVFileResponse;
import JobFlow.entity.CVFile;
import JobFlow.service.CVService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cv")
@RequiredArgsConstructor
public class CVController {

    private final CVService service;

    @PostMapping(
            consumes = "multipart/form-data"
    )
    public CVFileResponse create(
            @RequestPart("file")
            MultipartFile file,

            @RequestPart("data")
            CVFileRequest request
    ) {

        return service.create(
                file,
                request
        );
    }

    @GetMapping
    public List<CVFileResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CVFileResponse getById(
            @PathVariable UUID id
    ) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable UUID id
    ) {
        service.delete(id);
    }

}