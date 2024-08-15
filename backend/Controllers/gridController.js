const Grid = require("../models/Grid");

// Create a new grid for a user
const createGrid = async (req, res) => {
  const { user1Grid, user2Grid } = req.body;

  try {
    // console.log(grid1, grid2);
    const newGrid = new Grid({
      name: "game",
      grid1: user1Grid,
      grid2: user2Grid,
    });

    await newGrid.save();
    res.status(201).json(newGrid);
  } catch (error) {
    res.status(500).json({ message: "Failed to create grid", error });
  }
};

// Mark a number in the user's grid
const checkWinner = (grid, crossNumbers) => {
  const checkThreeInARow = (arr) =>
    arr.every((num) => crossNumbers.includes(num));

  // Check rows
  for (let row of grid) {
    if (checkThreeInARow(row)) {
      return true;
    }
  }

  // Check columns
  for (let col = 0; col < grid.length; col++) {
    const column = grid.map((row) => row[col]);
    if (checkThreeInARow(column)) {
      return true;
    }
  }

  return false;
};

const markNumber = async (req, res) => {
  const { number } = req.body;

  try {
    const grids = await Grid.findOne({ name: "game" });

    if (!grids) {
      return res.status(404).json({ message: "Grids not found" });
    }

    // Add the number to the crossNumber array
    grids.crossNumber.push(number);
    await grids.save();

    // Check if User1 wins (grid1)
    if (checkWinner(grids.grid1, grids.crossNumber)) {
      await Grid.findOneAndDelete({ name: "game" });
      return res.status(200).json({ message: "User1 wins!" });
    }

    // Check if User2 wins (grid2)
    if (checkWinner(grids.grid2, grids.crossNumber)) {
      await Grid.findOneAndDelete({ name: "game" });
      return res.status(200).json({ message: "User2 wins!" });
    }

    // No winner yet
    return res.status(200).json({ message: "Number marked successfully" });
  } catch (error) {
    console.error("Error marking number:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getGrids = async (req, res) => {
  const grids = await Grid.findOne({ name: "game" });
  if (!grids) {
    return res.status(200).json({ message: "no grids found" });
  }
  return res.status(200).json({ grids: grids });
};

module.exports = {
  createGrid,
  markNumber,
  getGrids,
};
