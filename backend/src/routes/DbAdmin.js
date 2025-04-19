const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const VerifyToken = require('./middleware/VerifyToken');
const AuthorizeRoles = require('./middleware/AuthorizeRoles');

// Get all collection names from the database
router.get('/collections', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.status(200).json({ collections: collections.map(collection => collection.name) });
  } catch (error) {
    console.error('Error listing collections:', error);
    res.status(500).json({ error: 'Error listing collections' });
  }
});

// Verify that the provided password matches the current admin user's password
const verifyAdminPassword = async (req, res, next) => {
  const { adminPassword } = req.body;
  
  if (!adminPassword) {
    return res.status(400).json({ error: 'Admin password is required' });
  }
  
  try {
    // Get the user ID from the token verification
    const userId = req.userId;
    
    // Get the user making the request
    const user = await mongoose.connection.db.collection('users').findOne({ _id: mongoose.Types.ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }
    
    // Verify the password matches this admin's password
    const isPasswordValid = await bcrypt.compare(adminPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(403).json({ error: 'Invalid password' });
    }
    
    // Password verified, proceed
    next();
  } catch (error) {
    console.error('Error verifying admin password:', error);
    res.status(500).json({ error: 'Error verifying credentials' });
  }
};

// Get schema structure for a collection
router.get('/schema/:collection', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const { collection } = req.params;
    const model = mongoose.models[collection];
    
    if (!model) {
      // If no model is found, get a sample document to infer schema
      const sampleDoc = await mongoose.connection.db.collection(collection).findOne();
      if (!sampleDoc) {
        return res.status(200).json({ schema: {} }); // Empty schema if no documents
      }
      
      // Create a schema representation from the sample document
      const inferredSchema = Object.entries(sampleDoc).reduce((schema, [key, value]) => {
        if (key === '_id') return schema; // Skip _id field
        
        let type;
        if (value === null) {
          type = 'Mixed';
        } else if (Array.isArray(value)) {
          type = 'Array';
        } else if (value instanceof Date) {
          type = 'Date';
        } else {
          type = typeof value;
        }
        
        schema[key] = { type };
        return schema;
      }, {});
      
      return res.status(200).json({ schema: inferredSchema });
    }
    
    const schema = model.schema.obj;
    res.status(200).json({ schema });
  } catch (error) {
    console.error(`Error getting schema for collection:`, error);
    res.status(500).json({ error: 'Error getting schema' });
  }
});

// Get documents from a collection
router.post('/documents/:collection', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 20, sort = { _id: -1 }, query = {} } = req.body;
    
    // Access collection directly using the MongoDB driver
    const db = mongoose.connection.db;
    const skip = (page - 1) * limit;
    
    // Execute query directly on the MongoDB collection
    const documents = await db.collection(collection)
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection(collection).countDocuments(query);
    
    res.status(200).json({ 
      documents, 
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error(`Error getting documents for collection:`, error);
    res.status(500).json({ error: 'Error getting documents' });
  }
});

// Create a document in a collection
router.post('/create/:collection', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const { collection } = req.params;
    const { document } = req.body;
    
    // Access collection directly using the MongoDB driver
    const result = await mongoose.connection.db.collection(collection).insertOne(document);
    
    // Get the inserted document
    const newDocument = await mongoose.connection.db.collection(collection).findOne({ _id: result.insertedId });
    
    res.status(201).json({ message: 'Document created successfully', document: newDocument });
  } catch (error) {
    console.error(`Error creating document in collection:`, error);
    res.status(500).json({ error: 'Error creating document', message: error.message });
  }
});

// Update a document in a collection
router.put('/update/:collection/:id', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const { collection, id } = req.params;
    const { document } = req.body;
    
    // Remove _id from the document if present (MongoDB doesn't allow _id updates)
    if (document._id) {
      delete document._id;
    }
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid document ID format' });
    }
    
    // Update the document directly using MongoDB driver
    const result = await mongoose.connection.db.collection(collection).updateOne(
      { _id: objectId },
      { $set: document }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Get the updated document
    const updatedDocument = await mongoose.connection.db.collection(collection).findOne({ _id: objectId });
    
    res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
  } catch (error) {
    console.error(`Error updating document in collection:`, error);
    res.status(500).json({ error: 'Error updating document', message: error.message });
  }
});

// Delete a document from a collection
router.delete('/delete/:collection/:id', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid document ID format' });
    }
    
    // Find the document before deletion to return it in the response
    const documentToDelete = await mongoose.connection.db.collection(collection).findOne({ _id: objectId });
    
    if (!documentToDelete) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Delete the document directly using MongoDB driver
    const result = await mongoose.connection.db.collection(collection).deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.status(200).json({ message: 'Document deleted successfully', document: documentToDelete });
  } catch (error) {
    console.error(`Error deleting document from collection:`, error);
    res.status(500).json({ error: 'Error deleting document', message: error.message });
  }
});

// Drop a collection
router.delete('/drop-collection/:collection', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const { collection } = req.params;
    
    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === collection);
    
    if (!collectionExists) {
      return res.status(404).json({ error: `Collection '${collection}' not found` });
    }
    
    // Drop the collection
    await mongoose.connection.db.dropCollection(collection);
    
    res.status(200).json({ message: `Collection '${collection}' dropped successfully` });
  } catch (error) {
    console.error(`Error dropping collection:`, error);
    res.status(500).json({ error: 'Error dropping collection', message: error.message });
  }
});

// Run a custom query
router.post('/query/:collection', VerifyToken, AuthorizeRoles(['admin']), async (req, res) => {
  try {
    const { collection } = req.params;
    const { operation, query, options } = req.body;
    
    // Access the collection directly
    const collectionRef = mongoose.connection.db.collection(collection);
    let result;
    
    switch (operation) {
      case 'find':
        result = await collectionRef.find(query).limit(options?.limit || 100).toArray();
        break;
      case 'findOne':
        result = await collectionRef.findOne(query);
        break;
      case 'aggregate':
        result = await collectionRef.aggregate(query).toArray();
        break;
      case 'updateMany':
        result = await collectionRef.updateMany(
          query.filter, 
          query.update, 
          options
        );
        break;
      case 'deleteMany':
        result = await collectionRef.deleteMany(query, options);
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }
    
    res.status(200).json({ result });
  } catch (error) {
    console.error(`Error executing custom query:`, error);
    res.status(500).json({ error: 'Error executing custom query', message: error.message });
  }
});

module.exports = router;
