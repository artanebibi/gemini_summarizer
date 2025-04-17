package artan.extension_sb.web;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @CrossOrigin(origins = {"chrome-extension://*", "http://localhost:*"})
    @PostMapping("/api/shorten")
    public String shortenContent(@RequestBody String content) {



        return content.length() > 500 ? content.substring(0, 500) + "..." : content;
    }
}
