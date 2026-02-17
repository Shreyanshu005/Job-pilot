const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: String,
        default: '',
    },
    jobRole: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        required: true,
        enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
    },
    description: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        default: '',
    },
    salary: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
        type: { type: String, default: 'Yearly', enum: ['Yearly', 'Monthly', 'Hourly'] },
    },
    educationLevel: {
        type: String,
        default: '',
    },
    experienceLevel: {
        type: String,
        default: '',
    },
    jobLevel: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    isRemote: {
        type: Boolean,
        default: false,
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Expired'],
        default: 'Active',
    },
    applications: {
        type: Number,
        default: 0,
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

jobSchema.virtual('daysRemaining').get(function () {
    const now = new Date();
    const diff = this.deadline - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
});

jobSchema.virtual('location').get(function () {
    if (this.city && this.country) return `${this.city}, ${this.country}`;
    return this.city || this.country || '';
});

jobSchema.pre('save', function (next) {
    if (this.deadline && new Date(this.deadline) < new Date()) {
        this.status = 'Expired';
    }
    next();
});

jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
