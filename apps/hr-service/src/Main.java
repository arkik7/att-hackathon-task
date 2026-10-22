import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Properties;
import java.util.UUID;

public class Main {
    private static final Path FIXTURES = Path.of("fixtures").toAbsolutePath();
    private static final Properties LINKS = new Properties();
    private static final HttpClient CLIENT = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
    private static String env(String key, String fallback) { return System.getenv().getOrDefault(key, fallback); }

    public static void main(String[] args) throws Exception {
        try (var input = Files.newInputStream(FIXTURES.resolve("customer-links.properties"))) { LINKS.load(input); }
        if (args.length > 0 && args[0].equals("--check")) {
            if (!Files.exists(FIXTURES.resolve("employees.json"))) throw new IllegalStateException("Missing directory snapshot");
            System.out.println("HR fixtures available; mappings=" + LINKS.size());
            return;
        }
        var server = HttpServer.create(new InetSocketAddress(env("HOST", "127.0.0.1"), Integer.parseInt(env("PORT", "5006"))), 0);
        server.createContext("/", Main::handle);
        server.start();
        System.out.println("People Directory listening on " + server.getAddress());
    }

    private static void handle(HttpExchange exchange) throws java.io.IOException {
        var headers = exchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Headers", "content-type,x-request-id");
        headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
        String candidate = exchange.getRequestHeaders().getFirst("x-request-id");
        String requestId = candidate != null && candidate.matches("[A-Za-z0-9-]{1,80}") ? candidate : UUID.randomUUID().toString();
        headers.set("x-request-id", requestId);
        if (exchange.getRequestMethod().equals("OPTIONS")) { exchange.sendResponseHeaders(204, -1); exchange.close(); return; }
        if (!exchange.getRequestMethod().equals("GET")) { send(exchange, 405, "{\"error\":\"Read-only directory\"}"); return; }
        String path = exchange.getRequestURI().getPath();
        try {
            if (path.equals("/health")) { send(exchange, 200, "{\"status\":\"ok\",\"service\":\"hr-service\"}"); return; }
            if (path.equals("/v1/employees")) { send(exchange, 200, Files.readString(FIXTURES.resolve("employees.json"))); return; }
            String[] parts = path.split("/");
            if (parts.length < 4 || !parts[1].equals("v1") || !parts[2].equals("employees") || !parts[3].matches("emp-[0-9]{3}")) { send(exchange, 404, "{\"error\":\"Route not found\"}"); return; }
            String employeeId = parts[3];
            Path employee = FIXTURES.resolve("employees").resolve(employeeId + ".json");
            if (!Files.isRegularFile(employee)) { send(exchange, 404, "{\"error\":\"Employee not found\"}"); return; }
            String snapshot = Files.readString(employee);
            System.out.println("directory.lookup request=" + requestId + " employee=" + snapshot.replace("\n", " "));
            if (parts.length == 4) { send(exchange, 200, snapshot); return; }
            if (parts.length == 5 && parts[4].equals("leave")) { send(exchange, 200, Files.readString(FIXTURES.resolve("leave").resolve(employeeId + ".json"))); return; }
            if (parts.length == 5 && parts[4].equals("customer-account")) {
                String customerId = LINKS.getProperty(employeeId);
                if (customerId == null) { send(exchange, 200, "{\"linked\":false,\"customer\":null}"); return; }
                String url = env("USER_SERVICE_URL", "http://127.0.0.1:5002") + "/v2/users/" + customerId;
                var response = CLIENT.send(HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(5)).header("x-request-id", requestId).GET().build(), HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() != 200) { send(exchange, 502, "{\"error\":\"Customer lookup unavailable\"}"); return; }
                send(exchange, 200, "{\"linked\":true,\"customer\":" + response.body() + "}"); return;
            }
            send(exchange, 404, "{\"error\":\"Route not found\"}");
        } catch (Exception error) {
            if (error instanceof InterruptedException) Thread.currentThread().interrupt();
            System.err.println("directory.error request=" + requestId + " type=" + error.getClass().getSimpleName());
            send(exchange, 502, "{\"error\":\"Directory dependency unavailable\"}");
        }
    }
    private static void send(HttpExchange exchange, int status, String json) throws java.io.IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (var body = exchange.getResponseBody()) { body.write(bytes); }
    }
}
