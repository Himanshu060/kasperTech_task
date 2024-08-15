const mongoose = require('mongoose');
const gridSchema = new mongoose.Schema({
    name: { type: String, required: true },
    grid1: [[String]],
    grid2: [[String]],
    winnner : { type : Number},
    crossNumber : {type : [Number]}
});
const Grid = mongoose.model('Grid', gridSchema);
module.exports = Grid;
