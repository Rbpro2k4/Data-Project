const mongoose = require('mongoose');

const scheduleSchema=new mongoose.Schema({
    
    StartTime:{
        type:Date,
        required:true,
    },
    EndTime:{
        type:Date,
        required:true,
    },
    Creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    Invited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    CreatedAt: Date,
    UpdatedAt:Date,
    Status:Boolean,
    Title:String,
    Description:String,
})

module.exports = mongoose.model('Schedule', scheduleSchema);