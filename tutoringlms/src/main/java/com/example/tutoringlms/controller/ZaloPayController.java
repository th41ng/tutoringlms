package com.example.tutoringlms.controller;


import com.example.tutoringlms.service.ZaloPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class ZaloPayController {

    private final ZaloPayService zaloPayService;

    @PostMapping("/create")
    public Map<String, String> createPayment(@RequestBody Map<String, Object> payload) {
        long amount = Long.parseLong(payload.get("amount").toString());
        String redirectUrl = payload.getOrDefault("redirectUrl", "").toString();
        String appTransId = "order" + UUID.randomUUID().toString().replace("-", "");

        String orderUrl = zaloPayService.createOrder(amount, redirectUrl, appTransId);

        return Map.of(
                "orderId", appTransId,
                "amount", String.valueOf(amount),
                "orderUrl", orderUrl
        );
    }
}
