package JobFlow.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "application")
@Data
public class ApplicationProperties {

    private String allowedOrigins;
    private Storage storage = new Storage();
    private JWT jwt = new JWT();
    private Users users = new Users();
    private String logsPath;
    private String appVersion;


    @Data
    public static class Storage {
        private String type;
        private String path;
    }



    @Data
    public static class JWT {
        private String secret;
        private long expirationMs;
    }

    @Data
    public static class Users {
        private List<InitialUser> seed = new ArrayList<>();
    }

    @Data
    public static class InitialUser {
        private String name;
        private String email;
        private String password;
        private String role;
    }

}
