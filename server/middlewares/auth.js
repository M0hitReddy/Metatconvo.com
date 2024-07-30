const verifyUser = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: 'Unauthorized' })
        jwt.verify(token, config.tokenSecret)
        return next()
    } catch (err) {
        console.error('Error: ', err)
        res.status(401).json({ message: 'Unauthorized' })
    }
}
export default verifyUser ;