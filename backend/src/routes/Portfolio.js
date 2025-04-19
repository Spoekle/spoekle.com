// filepath: /data/compose/spoekle.com/backend/src/routes/Portfolio.js
const express = require('express');
const router = express.Router();
const PortfolioProject = require('../models/portfolioProjectModel');
const verifyToken = require('./middleware/VerifyToken');
const authorizeRoles = require('./middleware/AuthorizeRoles');

router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    // Add category filter if provided
    if (category && category !== 'All Projects') {
      query.category = category;
    }

    // Add featured filter if provided
    if (featured === 'true') {
      query.featured = true;
    }

    // Get projects
    const projects = await PortfolioProject.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio projects', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await PortfolioProject.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio project', error: error.message });
  }
});

router.post('/', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const projectData = req.body;
    
    // Validate required fields
    if (!projectData.title || !projectData.description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const project = new PortfolioProject(projectData);
    const savedProject = await project.save();
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    res.status(500).json({ message: 'Failed to create portfolio project', error: error.message });
  }
});

router.put('/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const projectData = req.body;
    
    // Validate required fields
    if (!projectData.title || !projectData.description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const updatedProject = await PortfolioProject.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    res.status(500).json({ message: 'Failed to update portfolio project', error: error.message });
  }
});

router.delete('/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const deletedProject = await PortfolioProject.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    res.status(500).json({ message: 'Failed to delete portfolio project', error: error.message });
  }
});

module.exports = router;
