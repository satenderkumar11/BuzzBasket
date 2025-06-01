const { User } = require('../model/User');

exports.fetchUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Optional: Add validation for req.body here
    
    const user = await User.findByIdAndUpdate(
      id, 
      req.body, 
      { 
        new: true,
        runValidators: true // This ensures mongoose validators run on update
      }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    
    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(err.errors).map(e => e.message) 
      });
    }
    
    res.status(500).json({ message: 'Error updating user' });
  }
};