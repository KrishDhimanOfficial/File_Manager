import JsonWebToken from "jsonwebtoken"
import config from "../config/config.js"
import crypto from 'crypto-js'

const jwt = {
    generateToken: (payload) => {
        if (!payload || typeof payload !== 'object') throw new Error('Payload must be an object')
        return JsonWebToken.sign(payload, config.jwt_key, {
            algorithm: 'HS256',
            expiresIn: '4h'
        })
    },

    accessToken: (payload) => {
        if (!payload || typeof payload !== 'object') throw new Error('Payload must be an object')
        return JsonWebToken.sign(payload, config.jwt_key, {
            algorithm: 'HS256',
            expiresIn: '15m'
        })
    },

    refreshToken: (payload) => {
        if (!payload || typeof payload !== 'object') throw new Error('Payload must be an object')
        return JsonWebToken.sign(payload, config.jwt_refresh_key, {
            algorithm: 'HS256',
            expiresIn: '7d'
        })
    },

    verifyToken: (token) => {
        return JsonWebToken.verify(token, config.jwt_key)
    },

    jwtEncrypt: (data) => {
        return crypto.AES.encrypt(JSON.stringify(data), config.encryption_key).toString()
    },

    jwtDecrypt: (data) => {
        return JSON.parse(
            crypto
                .AES.decrypt(data, config.encryption_key)
                .toString(crypto.enc.Utf8)
        )
    }
}

export default jwt