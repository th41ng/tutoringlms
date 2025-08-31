package com.example.tutoringlms.utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.*;
import com.nimbusds.jwt.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String username) throws Exception {
        JWSSigner signer = new MACSigner(secret);
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(username)
                .expirationTime(new Date(System.currentTimeMillis() + expiration))
                .issueTime(new Date())
                .build();

        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public String validateTokenAndGetUsername(String token) throws Exception {
        SignedJWT jwt = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(secret);
        if (jwt.verify(verifier)) {
            if (jwt.getJWTClaimsSet().getExpirationTime().after(new Date())) {
                return jwt.getJWTClaimsSet().getSubject();
            }
        }
        return null;
    }
}

