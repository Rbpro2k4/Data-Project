const mongoose= require('mongoose')
const User = require("./User")


mongoose.connect("mongodb://localhost/testdb" )

const user=new User({firstName:"John",lastName:"Steve", age: 33, email:"john.test@timeling.com", username:"johnnyboy", password:"123456", phoneNumber:"1234567890"})
await user.save().then(()=> console.log("User Saved"))
