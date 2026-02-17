const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const query = { employer: req.userId };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, employer: req.userId });
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }
        res.json({ job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const {
            title, tags, jobRole, type, description, requirements,
            salary, educationLevel, experienceLevel, jobLevel,
            country, city, isRemote, deadline,
        } = req.body;

        const job = new Job({
            title, tags, jobRole, type, description, requirements,
            salary, educationLevel, experienceLevel, jobLevel,
            country, city, isRemote, deadline,
            employer: req.userId,
        });

        await job.save();
        res.status(201).json({ job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, employer: req.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        res.json({ job });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.userId });
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }
        res.json({ message: 'Job deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
