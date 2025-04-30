// server.js
console.log("🔥 Server file is running...");

require('dotenv').config();

const connectDB = require('./config/db');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User=require('./User');
const Schedule=require('./Schedule');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
connectDB();

// In-memory users storage


app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Add CSP headers
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' https://*.ngrok-free.app; " +
        "font-src 'self' data: https://*.ngrok-free.app; " +
        "img-src 'self' data: https://*.ngrok-free.app; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.ngrok-free.app; " +
        "style-src 'self' 'unsafe-inline' https://*.ngrok-free.app;"
    );
    next();
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/public/favicon.ico');
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Login.html'));
});

// Home route
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Home.html'));
});

// Calendar route
app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Calender.html'));
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        // Check if user exists
        let user = await User.findOne({ 
            $or: [
                { username },
                { email }
            ] 
        });
        
        if (user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }

        // Create new user
        user = new User({
            username,
            email,
            password,
            fullName
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful!'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

app.post('/api/schedule/add', async (req, res) => {
    console.log('Received event data:', req.body);
    try {
        const { Title, email, Description, StartTime, EndTime, Invited } = req.body;

        // Find the creator user
        const creator = await User.findOne({ email });
        if (!creator) {
            console.log('Creator not found:', email);
            return res.status(400).json({ success: false, message: 'Creator email not found' });
        }

        // Create schedule
        const schedule = await Schedule.create({
            Creator: creator._id,
            Title,
            Description: Description || '',
            StartTime,
            EndTime,
            Invited: Invited || [],
            Status: false
        });

        console.log('Created schedule:', schedule);

        res.json({ 
            success: true, 
            message: 'Schedule created successfully!',
            schedule 
        });

    } catch (err) {
        console.error('Schedule creation error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while creating schedule' 
        });
    }
});

app.post('/api/schedule/edit', (req, res) => {
    const { email, scheduleId, Title, StartTime, EndTime, Invited, Description } = req.body;

    // 1. Find user
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 2. Find schedule and make sure this user is the creator
        Schedule.findById(scheduleId).then(schedule => {
            if (!schedule) {
                return res.status(404).json({ success: false, message: 'Schedule not found' });
            }

            if (!schedule.Creator.equals(user._id)) {
                return res.status(403).json({ success: false, message: 'You are not the creator of this schedule' });
            }

            // 3. Check for overlap IF time is changing
            const isTimeChanged =
                StartTime && EndTime &&
                (new Date(StartTime).getTime() !== new Date(schedule.StartTime).getTime() ||
                 new Date(EndTime).getTime() !== new Date(schedule.EndTime).getTime());

            const proceedToUpdate = (validInvited = []) => {
                // 4. Update fields
                schedule.Title = Title || schedule.Title;
                schedule.Description = Description || schedule.Description;
                schedule.StartTime = StartTime ? new Date(StartTime) : schedule.StartTime;
                schedule.EndTime = EndTime ? new Date(EndTime) : schedule.EndTime;
                schedule.Invited = Array.isArray(validInvited) ? validInvited : schedule.Invited;
                schedule.UpdatedAt = new Date();

                schedule.save().then(updated => {
                    res.json({ success: true, message: 'Schedule updated', schedule: updated });
                }).catch(err => {
                    console.error('Schedule update error:', err);
                    res.status(500).json({ success: false, message: 'Failed to update schedule' });
                });
            };

            if (isTimeChanged) {
                Schedule.findOne({
                    Creator: user._id,
                    _id: { $ne: scheduleId }, // exclude this schedule
                    StartTime: { $lt: new Date(EndTime) },
                    EndTime: { $gt: new Date(StartTime) }
                }).then(overlap => {
                    if (overlap) {
                        return res.status(400).json({ success: false, message: 'New time conflicts with another schedule' });
                    }

                    // Validate invited users
                    if (Array.isArray(Invited) && Invited.length > 0) {
                        User.find({ _id: { $in: Invited } }).select('_id').then(users => {
                            if (users.length !== Invited.length) {
                                return res.status(400).json({ success: false, message: 'One or more invited user IDs are invalid' });
                            }
                            const validInvited = users.map(u => u._id);
                            proceedToUpdate(validInvited);
                        }).catch(err => {
                            console.error('Invited validation error:', err);
                            res.status(500).json({ success: false, message: 'Failed to validate invited users' });
                        });
                    } else {
                        proceedToUpdate([]);
                    }

                }).catch(err => {
                    console.error('Overlap check error:', err);
                    res.status(500).json({ success: false, message: 'Failed to check for time conflicts' });
                });
            } else {
                // If time not changed, just validate invitees and update
                if (Array.isArray(Invited) && Invited.length > 0) {
                    User.find({ _id: { $in: Invited } }).select('_id').then(users => {
                        if (users.length !== Invited.length) {
                            return res.status(400).json({ success: false, message: 'One or more invited user IDs are invalid' });
                        }
                        const validInvited = users.map(u => u._id);
                        proceedToUpdate(validInvited);
                    }).catch(err => {
                        console.error('Invited validation error:', err);
                        res.status(500).json({ success: false, message: 'Failed to validate invited users' });
                    });
                } else {
                    proceedToUpdate([]);
                }
            }

        }).catch(err => {
            console.error('Schedule lookup error:', err);
            res.status(500).json({ success: false, message: 'Failed to find schedule' });
        });

    }).catch(err => {
        console.error('User lookup error:', err);
        res.status(500).json({ success: false, message: 'Failed to find user' });
    });
});

app.post('/api/schedule/remove', (req, res) => {
    const { email, scheduleId } = req.body;

    // Step 1: Find the user by email
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Step 2: Find the schedule
        Schedule.findById(scheduleId).then(schedule => {
            if (!schedule) {
                return res.status(404).json({ success: false, message: 'Schedule not found' });
            }

            // Step 3: Check if user is the creator
            if (!schedule.Creator.equals(user._id)) {
                return res.status(403).json({ success: false, message: 'You are not the creator of this schedule' });
            }

            // Step 4: Delete the schedule
            Schedule.deleteOne({ _id: scheduleId }).then(() => {
                res.json({ success: true, message: 'Schedule deleted successfully' });
            }).catch(err => {
                console.error('Error deleting schedule:', err);
                res.status(500).json({ success: false, message: 'Failed to delete schedule' });
            });

        }).catch(err => {
            console.error('Schedule lookup error:', err);
            res.status(500).json({ success: false, message: 'Failed to retrieve schedule' });
        });

    }).catch(err => {
        console.error('User lookup error:', err);
        res.status(500).json({ success: false, message: 'Failed to find user' });
    });
});

app.post('/api/schedule/leave', (req, res) => {
    const { email, scheduleId } = req.body;

    // Step 1: Find the user by email
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Step 2: Find the schedule
        Schedule.findById(scheduleId).then(schedule => {
            if (!schedule) {
                return res.status(404).json({ success: false, message: 'Schedule not found' });
            }

            // Step 3: Check if user is the creator
            if (schedule.Creator.equals(user._id)) {
                return res.status(400).json({ success: false, message: 'Creator cannot leave their own schedule' });
            }

            // Step 4: Check if user is in the invited list rolette
            const isInvited = schedule.Invited.some(id => id.equals(user._id));
            if (!isInvited) {
                return res.status(400).json({ success: false, message: 'You are not invited to this schedule' });
            }

            // Step 5: Remove the user from the Invited list rolette
            Schedule.updateOne(
                { _id: scheduleId },
                { $pull: { Invited: user._id }, $set: { UpdatedAt: new Date() } }
            ).then(() => {
                res.json({ success: true, message: 'You have successfully left the schedule' });
            }).catch(err => {
                console.error('Error updating schedule:', err);
                res.status(500).json({ success: false, message: 'Failed to update schedule' });
            });

        }).catch(err => {
            console.error('Schedule lookup error:', err);
            res.status(500).json({ success: false, message: 'Failed to find schedule' });
        });

    }).catch(err => {
        console.error('User lookup error:', err);
        res.status(500).json({ success: false, message: 'Failed to find user' });
    });
});

app.post('/api/schedule/all', async (req, res) => {
    const { email } = req.body;

    try {
        // First find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Find all schedules where the user is either the creator or invited
        const schedules = await Schedule.find({
            $or: [
                { Creator: user._id },
                { Invited: email }  // Changed: Simply check if email is in Invited array
            ]
        })
        .populate({
            path: 'Creator',
            select: 'email username'
        })
        .sort({ StartTime: 1 });

        // Transform the schedules to include additional information
        const transformedSchedules = schedules.map(schedule => ({
            _id: schedule._id,
            Title: schedule.Title,
            Description: schedule.Description,
            StartTime: schedule.StartTime,
            EndTime: schedule.EndTime,
            Creator: {
                email: schedule.Creator.email,
                username: schedule.Creator.username
            },
            Invited: schedule.Invited,
            Status: schedule.Status,
            isCreator: schedule.Creator._id.toString() === user._id.toString(),
            isInvited: schedule.Invited.includes(email)
        }));

        res.json({ 
            success: true, 
            schedules: transformedSchedules,
            total: transformedSchedules.length
        });

    } catch (err) {
        console.error('Error finding schedules:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching schedules'
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});