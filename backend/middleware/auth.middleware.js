import config from "../config/config.js"
import jwt from "../services/generateJWT.service.js"

export const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated() && req.user?.role !== 'superAdmin') {
        return res.status(401).redirect('/admin/login')
    }
    next()
}

export const verifyAccessToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]
        if (!token) res.status(401).json({ succes: false, message: 'Unauthorized' })

        const user = jwt.verifyToken(token)
        const decoded = jwt.jwtDecrypt(user.data)
        req.userId = decoded.id
        next()
    } catch (error) {
        console.log('verifyAccessToken : ' + error)
        return res.status(401).json({ succes: false, message: 'Unauthorized' })
    }

    // jwt.verify(token, config.encryption_key, (err, decoded) => {
    //     if (err) return res.sendStatus(403)
    //     req.userId = decoded.id;
    //     next()
    // })
}