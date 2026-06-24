package JobFlow.service;

import JobFlow.dtos.requests.CVFileRequest;
import JobFlow.dtos.responses.CVFileResponse;
import JobFlow.entity.CVFile;
import JobFlow.mappers.CVFileMapper;
import JobFlow.repository.CVFileRepository;

import JobFlow.service.storage.StorageFactory;
import JobFlow.service.storage.UploadResult;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CVService {

    private final CVFileRepository repository;
    private final CVFileMapper mapper;
    private final StorageFactory storageFactory;

    public CVFileResponse create(
            MultipartFile file,
            CVFileRequest request
    ) {

        UploadResult upload =
                storageFactory
                        .getStorage()
                        .upload(file);

        Optional<CVFile> existing =
                repository.findByHash(
                        upload.getHash()
                );

        if (existing.isPresent()) {
            return mapper.toResponse(
                    existing.get()
            );
        }

        CVFile cv =
                new CVFile();

        cv.setHash(
                upload.getHash()
        );

        cv.setFileUrl(
                upload.getPath()
        );

        cv.setFileName(
                file.getOriginalFilename()
        );

        cv.setLabel(
                request.getLabel()
        );

        cv.setNote(
                request.getNote()
        );

        return mapper.toResponse(
                repository.save(cv)
        );

    }
    public List<CVFileResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public CVFileResponse getById(UUID id) {

        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() ->
                        new RuntimeException("CV not found"));
    }

    public void delete(UUID id) {

        CVFile cv =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("CV not found"));

        storageFactory
                .getStorage()
                .delete(cv.getFileUrl());

        repository.delete(cv);
    }

}