package com.example.tutoringlms.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class ZaloPayService {

    private final String APP_ID = "2553";
    private final String KEY1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
    private final String CALLBACK_URL = "http://127.0.0.1:8080/api/payment/callback";
    private final String BANK_CODE = "zalopayapp";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createOrder(long amount, String redirectUrl, String appTransId) {
        try {
            String appUser = "ZaloPayDemo";
            long appTime = System.currentTimeMillis();
            String embedData = objectMapper.writeValueAsString(Map.of("redirecturl", redirectUrl));
            String item = "[]";
            String description = "ZaloPayDemo - Thanh toán cho đơn hàng #" + appTransId;

            // Tạo dữ liệu cho mac
            String rawData = String.join("|",
                    APP_ID,
                    appTransId,
                    appUser,
                    String.valueOf(amount),
                    String.valueOf(appTime),
                    embedData,
                    item
            );

            // Tạo mac
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(KEY1.getBytes(), "HmacSHA256"));
            String macHex = bytesToHex(mac.doFinal(rawData.getBytes()));

            // Tạo map params gửi request
            Map<String, Object> params = new HashMap<>();
            params.put("app_id", APP_ID);
            params.put("app_user", appUser);
            params.put("app_time", appTime);
            params.put("amount", amount);
            params.put("app_trans_id", appTransId);
            params.put("bank_code", BANK_CODE);
            params.put("embed_data", embedData);
            params.put("item", item);
            params.put("callback_url", CALLBACK_URL);
            params.put("description", description);
            params.put("mac", macHex);

            // Gửi POST request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(params, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://sb-openapi.zalopay.vn/v2/create",
                    request,
                    String.class
            );

            // Parse response
            Map<String, Object> result = objectMapper.readValue(response.getBody(), Map.class);
            if ((Integer) result.get("return_code") == 1 && result.containsKey("order_url")) {
                return result.get("order_url").toString();
            } else {
                return "Error: " + result.getOrDefault("return_message", "No return message");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }
}
