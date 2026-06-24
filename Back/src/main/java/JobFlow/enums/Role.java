package JobFlow.enums;

public enum Role {

    ROLE_USER("ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN");

    final String name;

    Role(String name) {
        this.name = name;
    }
}
