const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const auth = require("../middleware/auth");
//HTTP post request Async saves the previous
router.post("/register", async (req, res) => {
   try {
      //undefined so check for the displayName in the below
      let { email, password, passwordCheck, displayName } = req.body;

      // validate

      if (!email || !password || !passwordCheck)
         return res.status(400).json({ msg: "Not all fields have been entered." });
      if (password.length < 5)
         return res
             .status(400)
             .json({ msg: "The password needs to be at least 5 characters long." });
      if (password !== passwordCheck)
         return res
             .status(400)
             .json({ msg: "Enter the same password twice for verification." });
      //To find the user using the email and wait using await If find is used array will be returned
      const existingUser = await User.findOne({ email: email });
      if (existingUser)
         return res
             .status(400)
             .json({ msg: "An account with this email already exists." });

      if (!displayName) displayName = email;
      // Hashing the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
         email,
         password: passwordHash,
         displayName,
      });
      //TO the db saving the new user.
      const savedUser = await newUser.save();
      res.json(savedUser);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.post("/login", async (req, res) => {
   try {
      const { Unique_ID, Password } = req.body;
      // validate
      if (!Unique_ID || !Password)
         return res.status(400).json({ msg: "Not all fields have been entered." });

      const user = await User.find({ Unique_ID: Unique_ID });
     //console.log(Unique_ID);
      //console.log(Password);
      //console.log(user[0].auth);
      if (!user)
         return res
             .status(400)
             .json({ msg: "No account with this email has been registered." });
      if(Password != user[0].Password){
         return res
             .status(400)
             .json({ msg: "Invalid Credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
         token,
         user: {
            Unique_ID:user[0].Unique_ID,
            Type: user[0].Type,
         },
      });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.delete("/delete", auth, async (req, res) => {
   try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      res.json(deletedUser);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});
//Validation for the token
router.post("/tokenIsValid",async(req,res)=>{
   try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);

      const user = await User.findById(verified.id);
      if (!user) return res.json(false);

      return res.json(true);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

router.get("/",auth, async (req,res) => {
   const user = await User.findById(req.user);
   res.json({
      displayName: user.displayName,
      id: user._id,
   });
})
module.exports = router;