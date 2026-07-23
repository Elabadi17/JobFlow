package JobFlow.service;

import JobFlow.entity.AgentStatus;
import JobFlow.repository.AgentStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AgentService {


    private final AgentStatusRepository repository;


    public void heartbeat(){

        AgentStatus status =
                repository.findById(1L)
                        .orElse(new AgentStatus());


        status.setLastHeartbeat(
                Instant.now()
        );


        repository.save(status);
    }



    public boolean isActive(){

        return repository.findById(1L)
                .map(status -> {

                    if(status.getLastHeartbeat()==null)
                        return false;


                    return status.getLastHeartbeat()
                            .isAfter(
                                    Instant.now()
                                            .minusSeconds(30)
                            );

                })
                .orElse(false);
    }

}