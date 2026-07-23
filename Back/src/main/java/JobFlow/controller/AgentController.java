package JobFlow.controller;


import JobFlow.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.util.Map;


@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {


    private final AgentService service;



    @PostMapping("/heartbeat")
    public void heartbeat(){

        service.heartbeat();
    }



    @GetMapping("/status")
    public Map<String,Object> status(){

        return Map.of(
                "active",
                service.isActive()
        );
    }

}