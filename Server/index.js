const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors");
const UserModel=require('./models/User');
const bcrypt= require("bcrypt");


const app=express();
app.use(express.json());
app.use(cors());



mongoose.connect("mongodb://127.0.0.1:27017/GoDate");



app.post('/register',async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const user=await new UserModel({ ...req.body, password: hashPassword }).save();
        res
			.status(201)
			.json({ message: "Login with your acc" });
    }catch(error){
        console.log(error);
		res.status(500).json({ message: error.message });
    }
})



app.post('/login',async(req,res)=>{
    try{
    const {username,password}=req.body;
    const user = await UserModel.findOne({ username: username });
    if (!user)
        return res.status(401).json({ message: "Invalid Username or Password" });

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword)
        return res.status(401).json({ message: "Invalid Email or Password" });

    res.status(200).json({_id:user._id});
}
catch(error){
    res.status(500).json({message: "Internal server Error"});
}
})




app.post('/addPartner',async(req,res)=>{
    try{
        const userId = req.body.userId;
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { partner: req.body.values} });

            const user = await UserModel.findOne(
                {
                  _id: userId,
                  partner: { $elemMatch: { name: req.body.values.name, title: req.body.values.title } }
                },
                { 'partner.$': 1 }  // Only return the matching partner element
              );

              if (!user) {
                console.error('user not found');
                return null;
            }
            
            res.status(200).json({name: user.name,PartnerId: user.partner[0]._id});
        }
        catch(error){
    res.status(500).json({message: "Internal server Error"});
}
})




app.post('/getUserSender',async(req,res)=>{
    try {
        const userId = req.body.sender;
        const senderId = req.body.user;
        
        const updatedUser = await UserModel.findById(userId);
    
        if (updatedUser && updatedUser.partner) {
            const partnerId = senderId; 
            const foundPartner = updatedUser.partner.find(partner => partner._id.toString() === partnerId);
    
            if (foundPartner) {
                let ifanswered="no";
                if(foundPartner.answers.length>0){
                    ifanswered="yes";
                }
                res.status(200).json({ sender: updatedUser.name, user: foundPartner.name ,answered: ifanswered});
            } else {
                res.status(404).json({ message: "Partner not found" });
            }
        } else {
            res.status(404).json({ message: "User or partners not found" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
})








app.post('/saveresponses', async (req, res) => {
    try {
        const { nameID, senderID, responses } = req.body;

        // Find the user by their ID
        const user = await UserModel.findOne({ _id: senderID });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the partner object within the user's partners array
        
        const partner = user.partner.find(partner => partner._id.toString() === nameID);


        // If partner is not found, handle the error or create a new partner object
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // Check if partner.answers is not empty
        if (partner.answers && partner.answers.length == 0) {
            // Update the partner's responses
            partner.answers = responses; // Assuming 'responses' is the correct field

            // Save the updated user document
            await user.save();

            res.status(200).send('Responses saved');
        } else {
            // If partner.answers is empty, return an error
            return res.status(400).json({ message: 'Answers are not empty' });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get('/get-partners/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        // Find the user by _id and select only the partner array
        const user = await UserModel.findById(userId, 'partner');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Extract partner array and send only name, title, and _id
        const partners = user.partner.map(p => ({
            _id: p._id,
            name: p.name,
            title: p.title
        }));

        res.status(200).json(partners);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});








app.get('/get-answers/:userId/:partner', async (req, res) => {
    try {
        // Find the user by userId
        const user = await UserModel.findById(req.params.userId);
        
        if (!user) {
            res.status(404).json({error: 'User not found'});
        }

        // Find the partner by partnerId
    const partner = user.partner.id(req.params.partner);

    
    if (!partner) {
        res.status(404).json({ error: 'Partner not found' });
    }
    
    // Extract the name, title, and answers
    const { name, title, answers } = partner;
    
    res.status(200).json({ name, title, answers});
} catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
}
}
)



app.delete('/api/users/:userId/partners-delete/:partnerId', async (req, res) => {
    const { userId, partnerId } = req.params;
  
    try {
      // Fetch the user
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the partner from the array
      user.partner = user.partner.filter(partner => partner._id.toString() !== partnerId);
  
      // Save the user document
      await user.save();
  
      res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  





app.listen(3001,()=>{
    console.log("Server is running");
})