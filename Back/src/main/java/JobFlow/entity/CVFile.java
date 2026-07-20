package JobFlow.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CVFile extends BaseEntity {

    private String fileName;

    private String fileUrl;

    @Column(unique = true)
    private String hash;

    private String label;

    @Column(length = 2000)
    private String note;

    @ManyToOne
    private User user;


}