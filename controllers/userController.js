
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const {User, Basket} = require('../models/models')



const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {

            const {email, role, password} = req.body

            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или password'))
            }

            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }


            let salt = await bcrypt.genSalt(5)

            const Phash = await bcrypt.hash(password, salt)


            const user = await User.create({email, role, password: Phash})
            const basket = await Basket.create({userId: user.id})
            const token = await generateJwt(user.id, user.email, user.role)
            return await res.json({token})


        } catch(e){
            console.log(e)
            res.status(501).send("error registration...")
        }
    }

    async login(req, res, next) {
        try {

            const {email, password} = req.body
            const user = await User.findOne({where: {email}})

            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }

            const comparePassword = bcrypt.compareSync(password, user.password);

            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'))
            }

            const token = generateJwt(user.id, user.email, user.role)
            return res.json({token})

        } catch (e){

            console.log(e)
            res.status(502).sent("error login...")

        }
    }

    async check(req, res, next) {

        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
        
    }
}

module.exports = new UserController()