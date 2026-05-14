import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// POST /api/misc/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    res.status(201).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;
