import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, default: '' },
    role: { type: String, enum: ['U', 'A', 'S'], required: true }
});

export default mongoose.model('User', userSchema);