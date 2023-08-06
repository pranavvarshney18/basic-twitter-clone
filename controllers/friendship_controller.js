const express = require('express');
const mongoose = require('mongoose');
const Friendship = require('../models/friendship');
const User = require('../models/user');

//toggle friendship
module.exports.toggleFriendship = async (req, res) => {
    try{
        let removeFriend = false;
        let friendship = await User.find({
            _id: req.user.id,
            friends: req.params.friendId
        });

        //establish friendship
        if(friendship.length == 0){
            let firstUser = await User.findById(req.user.id);
            let secondUser = await User.findById(req.params.friendId);
            firstUser.friends.push(secondUser._id);
            await firstUser.save();
            secondUser.friends.push(firstUser._id);
            await secondUser.save();

            let newFriend = await Friendship.create({
                from_user: firstUser._id,
                to_user: secondUser._id
            });
        }
        //remove friendship
        else{
            removeFriend = true;
            let existingFriendship = await Friendship.findOne({
                from_user: req.user.id,
                to_user: req.params.friendId
            });

            if(!existingFriendship){
                existingFriendship = await Friendship.findOne({
                    from_user: req.params.friendId,
                    to_user: req.user.id
                });
            }

            existingFriendship.deleteOne();

            let firstUser = await User.findById(req.user.id);
            let secondUser = await User.findById(req.params.friendId);

            firstUser.friends.pull(secondUser._id);
            firstUser.save();
            secondUser.friends.pull(firstUser._id);
            secondUser.save();
        }

        // return res.redirect('back');
        return res.status(200).json({
            message: 'Friendship toggeling successful',
            data:{
                removeFriend : removeFriend
            }
        });

    }
    catch(err){
        console.log('error in toggeling friendship ', err);
        return res.status(500).json({
            message: 'Internal server error / Unable to toggle friend request'
        });
    }
}