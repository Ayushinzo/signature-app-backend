import mongoose from 'mongoose'

// let documentSchema = mongoose.Schema({
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     text: {
//         type: String,
//         required: true,
//         maxlength: 5000
//     },
//     page: {
//         type: Number,
//         required: true
//     },
//     coordinates: {
//         type: {
//             x: { type: Number, required: true },
//             y: { type: Number, required: true }
//         }
//     },
//     color: {
//         type: String,
//         required: true,
//         default: '#000000',
//         validate: {
//             validator: function(v) {
//                 return /^#([0-9A-F]{3}){1,2}$/i.test(v);
//             },
//             message: props => `${props.value} is not a valid color!`
//         }
//     },
//     fontSize: {
//         type: Number,
//         required: true,
//         min: 10,
//         max: 50
//     },
//     fontFamily: {
//         type: String,
//         required: true,
//         enum: ['Kristi', 'Handlee', 'Allura', 'Alex Brush'],
//         default: 'Kristi'
//     },
// })

let documentSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    }    
}, {
    timestamps: true,
    versionKey: false
})

let Document = mongoose.models.Document || mongoose.model('Document', documentSchema)
export default Document