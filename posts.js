const router = require ('express').Router();
const verify =  require('./verifyToken');
const user = require('./models/user');

router.get('/',verify, (req,res)=>{
    res.send(req.user);
    User.findByOne({_id: req.user})
})

module.exports = router;