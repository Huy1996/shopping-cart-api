import bcrypt from "bcryptjs";
import User from '../models/user.js'
import { generateToken } from "../middleware/middleware.js";

export const userSignin = async (req, res) =>  {
    const user = await User.findOne({email: req.body.email});
    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            res.send({
                _id: user._id,
                name: user.name,
                email:user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            });
            return;
        }
    }
    res
        .status(401)
        .send({
            message: 'Invalid email or password'
        });
}

export const userRegister = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    const createdUser = await user.save();
    res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email:createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
    })
}

export const getUserByID = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        res.send(user);
    }
    else{
        res
            .status(404)
            .send({
                message: 'User Not Found'
            });
    }
}

export const updateProfile = async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email ?? user.email;
        if(req.body.password){
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updateUser = await user.save();
        res.send({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser),
        });
    }
}

export const getUserList = async (req, res) => {
    const pageSize      = 10;
    const page          = Number(req.query.pageNumber) || 1;
    const count = await User.count({});
    const users = await User
        .find({})
        .skip(pageSize * (page - 1))
        .limit(pageSize);
    res.send({users, page, pages: Math.ceil( count/ pageSize )});
}

export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        if(user.email === 'admin@example.com'){
            res
                .status(400)
                .send({message:'Can Not Delete Admin User'});
            return;
        }
        const deleteUser = await user.remove();
        res.send({
            message:'User Deleted',
            user: deleteUser,
        })
    }
    else{
        res
            .status(404)
            .send({
                message:'User Not Found',
            });
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isSeller = req.body.isSeller === user.isSeller ? user.isSeller : req.body.isSeller;
        user.isAdmin = Boolean(req.body.isAdmin)
        const updatedUser = await user.save();
        res.send({
            message:'User Updated',
            user: updatedUser,
        })
    }
    else{
        res
            .status(404)
            .send({
                message: 'User Not Found',
            })
    }
}