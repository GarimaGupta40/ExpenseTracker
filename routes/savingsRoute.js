// const express = require('express');
// const router = express.Router();
// const SavingsModel = require('../models/savings');

// // Create a new savings goal
// router.post('/add-savings', async (req, res) => {
//   try {
//     const newGoal = new SavingsModel(req.body);
//     await newGoal.save();
//     res.status(200).send('Savings goal added successfully');
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// // Get all savings goals for a user
// router.post('/get-savings', async (req, res) => {
//   try {
//     const savings = await SavingsModel.find({ userId: req.body.userId });
//     res.status(200).json(savings);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const SavingsModel = require('../models/savings'); 

// Add new savings goal
router.post('/add-savings', async (req, res) => {
  console.log('Received request to /add-savings with data:', req.body); 
  try {
    const newGoal = new SavingsModel(req.body);
    const savedGoal = await newGoal.save();
    console.log('Saved to DB:', savedGoal); 
    res.status(200).json({ message: 'Savings goal added successfully', goal: savedGoal });
  } catch (error) {
    console.error('Error saving goal:', error); 
    res.status(500).json({ error: `Error adding goal: ${error.message}` });
  }
});


router.post('/get-savings', async (req, res) => {
  console.log('Received request to /get-savings with userId:', req.body.userId); 
  try {
    const { userId } = req.body;
    const savings = await SavingsModel.find({ userId });
    console.log('Found savings:', savings); 
    res.status(200).json(savings);
  } catch (error) {
    console.error('Error fetching savings:', error);
    res.status(500).json({ error: `Error retrieving savings: ${error.message}` });
  }
});

module.exports = router;
