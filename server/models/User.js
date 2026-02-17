const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profileComplete: {
        type: Boolean,
        default: false,
    },
    logoUrl: {
        type: String,
        default: '',
    },
    companyInfo: {
        companyName: { type: String, default: '' },
        organizationType: { type: String, default: '' },
        industryType: { type: String, default: '' },
        teamSize: { type: String, default: '' },
        yearOfEstablishment: { type: String, default: '' },
        aboutUs: { type: String, default: '' },
    },
    contactInfo: {
        location: { type: String, default: '' },
        contactNumber: { type: String, default: '' },
        email: { type: String, default: '' },
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
