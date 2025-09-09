import Joi from 'joi';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userResolver = {
  Query: {
    users: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');
      try {
        return await User.find();
      } catch (err) {
        throw new Error('Error fetching users');
      }
    },
    user: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      try {
        const foundUser = await User.findById(id);
        if (!foundUser) throw new Error('User not found');
        return foundUser;
      } catch (err) {
        throw new Error('Error fetching user');
      }
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const { error } = userSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      try {
        const user=new User(input)
        return await user.save()
      } catch (err) {
        if (error.code===11000){
            throw new Error("Email already exist")
        }
        throw new Error('Failed to Create User')
      }
    },

    updateUser: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Authentication required');
      if (user.id !== id) throw new Error('Not authorized to update this user');

      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, { new: true });
        if (!updatedUser) throw new Error('User not found');
        return updatedUser;
      } catch (err) {
        throw new Error('Error updating user');
      }
    },

    deleteUser: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      if (user.id !== id) throw new Error('Not authorized to delete this user');

      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new Error('User not found');
        return true;
      } catch (err) {
        throw new Error('Error deleting user');
      }
    },

    login: async (_, { email, password }) => {
     const user =await User.findOne({email})
     if (!user)throw  new Error("Invalid credentials");
     const isMatch=await user.comparePassword(password);
     if(!isMatch) throw new Error ("Invalid Credetials");
     const token = jwt.sign(
        {userId:user.id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'3d'}
     );
     return{token,user};
    },
  },
};
