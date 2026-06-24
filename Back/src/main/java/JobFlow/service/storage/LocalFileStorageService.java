package JobFlow.service.storage;

import JobFlow.config.ApplicationProperties;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;

import java.security.MessageDigest;

import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class LocalFileStorageService
        implements FileStorageService {

    private final ApplicationProperties properties;

    @Override
    public UploadResult upload(
            MultipartFile file
    ) {

        try {

            String root =
                    properties
                            .getStorage()
                            .getPath();

            Files.createDirectories(
                    Path.of(root));

            String hash =
                    calculateHash(file);

            String extension =
                    extractExtension(
                            file.getOriginalFilename());

            String filename =
                    hash + extension;

            Path destination =
                    Path.of(
                            root,
                            filename);

            if (!Files.exists(destination)) {

                Files.copy(
                        file.getInputStream(),
                        destination);

            }

            return new UploadResult(
                    destination.toString(),
                    hash
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Upload failed",
                    e
            );

        }

    }

    @Override
    public void delete(
            String fileUrl
    ) {

        try {

            Files.deleteIfExists(
                    Path.of(fileUrl));

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed deleting file",
                    e
            );

        }

    }

    private String calculateHash(
            MultipartFile file
    ) {

        try {

            MessageDigest md =
                    MessageDigest.getInstance(
                            "SHA-256");

            byte[] digest =
                    md.digest(
                            file.getBytes());

            return HexFormat
                    .of()
                    .formatHex(
                            digest);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Hash calculation failed",
                    e
            );

        }

    }

    private String extractExtension(
            String fileName
    ) {

        if (
                fileName == null ||
                        !fileName.contains(".")
        ) {
            return "";
        }

        return fileName.substring(
                fileName.lastIndexOf(".")
        );

    }

}