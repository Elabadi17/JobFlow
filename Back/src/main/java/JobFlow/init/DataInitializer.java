package JobFlow.init;

import JobFlow.entity.*;
import JobFlow.enums.ApplicationStatus;
import JobFlow.enums.Role;
import JobFlow.repository.*;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserInfoRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CVFileRepository cvRepository;
    private final JobApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.count() > 0) {
            return; // avoid duplicate seeding
        }

        // ---------------- USERS ----------------
        User admin = new User();
        admin.setFirstName("admin");
        admin.setEmail("admin@jobflow.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ROLE_ADMIN);

        User user = new User();
        user.setFirstName("user");
        user.setEmail("user@jobflow.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole(Role.ROLE_USER);

        userRepository.saveAll(List.of(admin, user));

        // ---------------- COMPANIES ----------------
        Company google = new Company();
        google.setName("Google");
        google.setWebsite("https://google.com");
        google.setLocation("USA");

        Company amazon = new Company();
        amazon.setName("Amazon");
        amazon.setWebsite("https://amazon.com");
        amazon.setLocation("USA");

        companyRepository.saveAll(List.of(google, amazon));

        // ---------------- CVS ----------------
        CVFile cv1 = new CVFile();
        cv1.setFileName("cv_admin.pdf");
        cv1.setFileUrl("http://files/cv_admin.pdf");

        CVFile cv2 = new CVFile();
        cv2.setFileName("cv_user.pdf");
        cv2.setFileUrl("http://files/cv_user.pdf");

        cvRepository.saveAll(List.of(cv1, cv2));

        // ---------------- APPLICATIONS ----------------
        JobApplication app1 = new JobApplication();
        app1.setPosition("Backend Engineer");
        app1.setStatus(ApplicationStatus.APPLIED);
        app1.setNotes("First application");
        app1.setSalaryMin(40000);
        app1.setSalaryMax(60000);
        app1.setUser(user);
        app1.setCompany(google);
        app1.setCvFile(cv2);

        JobApplication app2 = new JobApplication();
        app2.setPosition("DevOps Engineer");
        app2.setStatus(ApplicationStatus.INTERVIEW);
        app2.setNotes("Second round scheduled");
        app2.setSalaryMin(50000);
        app2.setSalaryMax(80000);
        app2.setUser(user);
        app2.setCompany(amazon);
        app2.setCvFile(cv2);

        applicationRepository.saveAll(List.of(app1, app2));
    }
}