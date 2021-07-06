'use strict';

//3rd party dependisess
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';
//create the schema
//the role for ACL
const users = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'writers', 'editor', 'admin']

    }
})

// }, { toObject: { getters: true } }); // What would this do if we use this instead of just });

// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!

//here mean genarte the token in virtual 

users.virtual('token').get(function () {
    let tokenObject = {
        username: this.username,
    }
    return jwt.sign(tokenObject, SECRET)
});

// //create virtual for ACL with capabilities (it will not saved in DB )
// //here we put all acl for each role
users.virtual('capabilities').get(function () {
    let acl = {
        user: ['read'],
        writer: ['read', 'create'],
        editor: ['read', 'create', 'update'],
        admin: ['read', 'create', 'update', 'delete']
    }
    //this here realted to object role in schema
    return acl[this.role]
});


// MW for schema
users.pre('save', async function () {
    if (this.isModified('password')) {

        //hash the pass in DB
        this.password = await bcrypt.hash(this.password, 10);
    }
});


// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ username })
    const valid = await bcrypt.compare(password, user.password)
    if (valid) { return user; }
    throw new Error('Invalid User');
}



// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
    try {
        const parsedToken = jwt.verify(token,SECRET);
        const user = this.findOne({ username: parsedToken.username })
        if (user) { return user; }
        throw new Error("User Not Found");
    } catch (e) {
        throw new Error(e.message)
    }
}


//export with create model at same line
module.exports = mongoose.model('users', users);


