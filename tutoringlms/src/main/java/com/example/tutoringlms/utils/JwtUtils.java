package com.example.tutoringlms.utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.*;
import com.nimbusds.jwt.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    private static final String SECRET = "12345678901234567890123456789012";
    private static final long EXPIRATION = 86400000;

    public String generateToken(String username) throws Exception {
        JWSSigner signer = new MACSigner(SECRET);
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(username)
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION))
                .issueTime(new Date())
                .build();

        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public String validateTokenAndGetUsername(String token) throws Exception {
        SignedJWT jwt = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);
        if (jwt.verify(verifier)) {
            if (jwt.getJWTClaimsSet().getExpirationTime().after(new Date())) {
                return jwt.getJWTClaimsSet().getSubject();
            }
        }
        return null;
    }
}
