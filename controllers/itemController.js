const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error creating item' });
  }
};

exports.getItems = async (req, res) => {
  try {
    let items;
    if (req.user.role === 'admin') {
      items = await Item.find();
    } else {
      items = await Item.find({ userId: req.user.id });
    }
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items!' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};
