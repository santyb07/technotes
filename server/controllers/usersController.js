const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Create new User
// @route Post /users
// @access Private

const getAllusers = asyncHandler(async (req,res)=>{
    const users = await User.find().select('-password').lean() //lean give data like json no extra data
    if(!users?.length){
        return res.status(400).json({message:'NO USER FOUND'})
    }
    res.status(200).json(users)
})

// @desc create new User
// @route CRETE /users
// @access Private

const createNewUser = asyncHandler(async (req,res)=>{
    const {username, password, roles} = req.body;

    //confirm data
    if(!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message:'All field are required'})
    }
    
    //check for duplicate 
    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate){
        return res.status(409).json({message:'Duplicate username'});
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password,10); //salt rounds

    const userObject = {username, "password":hashedPwd,roles}

    //create and store new user
    const user = await User.create(userObject) //shortcut for new and save

    if(user){//created
        res.status(201).json({message:`New user ${username} created`})
    }else{
        res.status(400).json({message:'Invalid userdata received'})
    }
})

// @desc Update new User
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req,res)=>{
    const {id, username, roles, active, password}= req.body;

    //confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !=='boolean'){
        return res.status(400).json({message:'All Fields are required'})
    }

    const user = await User.findById(id).exec();

    if(!user){
        return res.status(400).json({message:'user not found'})
    }

    //check for duplicate
    const duplicate = await User.findOne({username}).lean().exec()

    //Allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:'Duplicate username'})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        //Hash password
        user.password= await bcrypt.hash(password,10)
    }

    const updatedUser = await user.save()

    res.status(200).json({message: `${updatedUser.username} updated.`})
})


// @desc Delete a User
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req,res)=>{
    const {id}  = req.body

    if(!id){
        return res.status(400).json({message:'User Id required'})
    }

    const note = await Note.findOne({user:id}).lean().exec()
    if(note){
        return res.status(400).json({message:'User has assigned notes'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message:'User not found.'})
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports={
    getAllusers, 
    createNewUser, 
    updateUser, 
    deleteUser
}