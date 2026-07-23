package JobFlow.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import jakarta.annotation.PostConstruct;

@Component
public class EndpointLister {

    @Autowired
    private RequestMappingHandlerMapping handlerMapping;

    @PostConstruct
    public void listEndpoints() {
        handlerMapping.getHandlerMethods().forEach((requestMappingInfo, handlerMethod) -> {
            System.out.println(requestMappingInfo + " -> " + handlerMethod);
        });
    }
}