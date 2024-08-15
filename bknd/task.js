const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    deadline: {
        type: String,
        default: ''
    },
    preference: {
        type: String,
        enum: ['Low', 'High', 'Completed'],
        default: 'Low'
    },
    status: {
        type: String,
        enum: ['ToDo', 'InProgress', 'Done'],
        default: 'ToDo'
    }
});

mongoose.model('tasks', TaskSchema);