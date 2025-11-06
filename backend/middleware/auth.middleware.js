import config from "../config/config.js"
import jwt from "../services/generateJWT.service.js"

export const verifyAccessToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        const user = jwt.verifyToken(token, config.jwt_key)
        const decoded = jwt.jwtDecrypt(user.data)
        req.userId = decoded.id
        next()
    } catch (error) {
        console.log('verifyAccessToken : ' + error)
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    // jwt.verify(token, config.encryption_key, (err, decoded) => {
    //     if (err) return res.sendStatus(403)
    //     req.userId = decoded.id;
    //     next()
    // })
}