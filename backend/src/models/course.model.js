import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: [true, 'El título del curso es obligatorio'],
        trim: true
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripción del curso es obligatoria'] 
    },
    modulos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Module' 
    }],
    creadoPor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    activo: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true
});

export default mongoose.model('Course', courseSchema);