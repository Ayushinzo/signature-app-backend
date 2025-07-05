import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1] || req.headers['authorization'];
    if (!token) return res.json({
        success: false,
        message: 'No token, authorization denied'
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

export default verifyToken;