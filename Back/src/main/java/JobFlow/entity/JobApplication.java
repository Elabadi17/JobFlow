package JobFlow.entity;

import JobFlow.enums.ApplicationStatus;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication extends BaseEntity {


    private String position;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private String notes;

    private Integer salaryMin;

    private Integer salaryMax;

    @ManyToOne
    private User user;

    @ManyToOne
    private Company company;

    @ManyToOne
    private CVFile cvFile;

}