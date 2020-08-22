const router = require ('express').Router();
const User = require('./models/user');
const {registerValidation,loginValidation} = require('./validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// validation



router.post('/register', async (req, res)=>{

    // lets validate the user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)
      
    // checking if the email in the db already exists

    const emailExists = await User.findOne({email: req.body.email})
        if(emailExists){
            return res.status(400).send('Email already exists')
        }
      
        // hash password
      
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt)


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
try {
    const savedUser = await user.save();
    res.send({user: user._id})

} catch(err) {
    res.status(400).send(err)
}

})

// Login

router.post ('/login',async (req, res)=>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message) 

    const user = await  User.findOne({email: req.body.email})
       console.log(user)
    if (!user) return res.status(400).send('email is not found')
      
    // password is correct
    const validPass =  await bcrypt.compare(req.body.password, user.password)
        console.log(validPass)
    if(!validPass) return res.status(400).send('password is incorrect')
     
    // Create and assign the token

    const token = jwt.sign({user: user._id}, process.env.SECRET_KEY)

     res.header('auth-token',token).send(token)
     res.send('logged in')
})



module.exports = router