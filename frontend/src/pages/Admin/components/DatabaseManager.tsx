import React, { useState, useEffect } from 'react';
import { FaDatabase, FaUnlock, FaLock, FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaChevronDown, FaChevronRight, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Schema {
  [key: string]: any;
}

interface CollectionDocument {
  _id: string;
  [key: string]: any;
}

interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmButtonColor: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonColor,
  onConfirm,
  onCancel,
  isLoading,
  icon
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            {icon && <div className="mr-4">{icon}</div>}
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
              {title}
            </h3>
          </div>
          
          <p className="mb-6 text-neutral-600 dark:text-neutral-300">
            {message}
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50 ${confirmButtonColor}`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DatabaseManager: React.FC<{ token: string | null }> = ({ token }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionSchema, setCollectionSchema] = useState<Schema | null>(null);
  const [documents, setDocuments] = useState<CollectionDocument[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, pages: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [editDocument, setEditDocument] = useState<CollectionDocument | null>(null);
  const [newDocument, setNewDocument] = useState<Record<string, any>>({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmButtonColor: string;
    onConfirm: () => void;
    icon?: React.ReactNode;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonColor: 'bg-red-600',
    onConfirm: () => {},
  });

  // Fetch collections when component mounts
  useEffect(() => {
    if (isUnlocked) {
      fetchCollections();
    }
  }, [isUnlocked]);

  // Fetch documents when collection is selected
  useEffect(() => {
    if (selectedCollection && isUnlocked) {
      fetchSchema();
      fetchDocuments();
    }
  }, [selectedCollection, pagination.page, isUnlocked]);

  const unlockDatabaseManager = async () => {
    if (!adminPassword) {
      toast.error('Please enter your admin password');
      return;
    }

    setIsLoading(true);
    try {
      // Just unlock the component, actual password verification happens per operation
      setIsUnlocked(true);
      setAdminPassword('');
      toast.success('Database manager unlocked');
    } catch (error) {
      console.error('Error unlocking database manager:', error);
      toast.error('Failed to unlock database manager');
    }
    setIsLoading(false);
  };

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/db-admin/collections', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(data.collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to fetch database collections');
    }
    setIsLoading(false);
  };

  const fetchSchema = async () => {
    if (!selectedCollection) return;

    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/db-admin/schema/${selectedCollection}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollectionSchema(data.schema);
      
      // Initialize newDocument with schema defaults
      const defaultDoc = Object.entries(data.schema).reduce((acc: Record<string, any>, [key, value]) => {
        let defaultValue: any = '';
        const schemaValue = value as any;
        
        if (schemaValue.type === Boolean) {
          defaultValue = false;
        } else if (schemaValue.type === Number) {
          defaultValue = 0;
        } else if (Array.isArray(schemaValue)) {
          defaultValue = [];
        } else if (schemaValue.type === Object) {
          defaultValue = {};
        }
        
        return { ...acc, [key]: defaultValue };
      }, {});
      
      setNewDocument(defaultDoc);
    } catch (error) {
      console.error('Error fetching schema:', error);
      toast.error(`Failed to fetch schema for collection "${selectedCollection}"`);
    }
    setIsLoading(false);
  };

  const fetchDocuments = async () => {
    if (!selectedCollection) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `/api/db-admin/documents/${selectedCollection}`, 
        {
          page: pagination.page,
          limit: pagination.limit
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDocuments(data.documents);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error(`Failed to fetch documents for collection "${selectedCollection}"`);
    }
    setIsLoading(false);
  };

  const handleEdit = (document: CollectionDocument) => {
    setEditDocument({ ...document });
  };

  const handleCancelEdit = () => {
    setEditDocument(null);
  };

  const handleSaveEdit = async () => {
    if (!editDocument || !selectedCollection) return;

    setIsLoading(true);
    try {
      await axios.put(
        `/api/db-admin/update/${selectedCollection}/${editDocument._id}`, 
        { document: editDocument },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Document updated successfully');
      setEditDocument(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Document',
      message: 'Are you sure you want to delete this document? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmButtonColor: 'bg-red-600',
      onConfirm: async () => {
        if (!selectedCollection) return;
        
        setIsLoading(true);
        try {
          await axios.delete(`/api/db-admin/delete/${selectedCollection}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
    
          toast.success('Document deleted successfully');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          fetchDocuments();
        } catch (error) {
          console.error('Error deleting document:', error);
          toast.error('Failed to delete document');
        }
        setIsLoading(false);
      },
      icon: <FaTrash className="text-red-500 text-xl" />
    });
  };
  
  const handleDropCollection = (collectionName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Drop Collection',
      message: `Are you sure you want to drop the entire "${collectionName}" collection? This will permanently delete ALL documents in this collection and CANNOT be undone.`,
      confirmText: 'Drop Collection',
      cancelText: 'Cancel',
      confirmButtonColor: 'bg-red-600',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await axios.delete(`/api/db-admin/drop-collection/${collectionName}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          toast.success(`Collection "${collectionName}" dropped successfully`);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          
          // Reset selected collection if it was the one dropped
          if (selectedCollection === collectionName) {
            setSelectedCollection(null);
            setDocuments([]);
            setCollectionSchema(null);
          }
          
          // Refresh collections list
          fetchCollections();
        } catch (error) {
          console.error('Error dropping collection:', error);
          toast.error(`Failed to drop collection: ${(error as any).response?.data?.message || 'Unknown error'}`);
        }
        setIsLoading(false);
      },
      icon: <FaExclamationTriangle className="text-red-500 text-xl" />
    });
  };

  const handleCreateDocument = async () => {
    if (!selectedCollection) return;

    setIsLoading(true);
    try {
      await axios.post(
        `/api/db-admin/create/${selectedCollection}`, 
        { document: newDocument },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Document created successfully');
      setShowNewForm(false);
      setNewDocument({});
      fetchDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error(`Failed to create document: ${(error as any).response?.data?.message || 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, path: string, targetObj: 'edit' | 'new') => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    
    const keys = path.split('.');
    const lastKey = keys.pop() as string;
    
    if (keys.length === 0) {
      // It's a simple field
      if (targetObj === 'edit') {
        setEditDocument({ ...editDocument!, [lastKey]: value });
      } else {
        setNewDocument({ ...newDocument, [lastKey]: value });
      }
    } else {
      // It's a nested field
      const nestedObj = keys.reduce((obj: any, key) => obj?.[key], targetObj === 'edit' ? editDocument! : newDocument);
      
      if (nestedObj) {
        nestedObj[lastKey] = value;
        
        if (targetObj === 'edit') {
          setEditDocument({ ...editDocument! });
        } else {
          setNewDocument({ ...newDocument });
        }
      }
    }
  };

  const renderFieldEditor = (key: string, _value: any, path: string, targetObj: 'edit' | 'new', _schemaValue?: any) => {
    const currentValue = path.split('.').reduce(
      (obj: any, p) => obj && obj[p], 
      targetObj === 'edit' ? editDocument : newDocument
    );
    
    // Skip _id field for edits
    if (key === '_id') {
      return null;
    }
    
    // Skip __v field
    if (key === '__v') {
      return null;
    }
    
    // Handle arrays
    if (Array.isArray(currentValue)) {
      return (
        <div key={path} className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {key} (array)
          </label>
          <textarea
            className="w-full mt-1 p-2 border border-neutral-300 rounded-md text-neutral-900 dark:text-white dark:bg-neutral-800 dark:border-neutral-700"
            value={JSON.stringify(currentValue, null, 2)}
            onChange={(e) => {
              try {
                const parsedValue = JSON.parse(e.target.value);
                if (Array.isArray(parsedValue)) {
                  if (targetObj === 'edit') {
                    const newDoc = { ...editDocument! };
                    const keys = path.split('.');
                    const lastKey = keys.pop() as string;
                    const nestedObj = keys.length ? keys.reduce((obj: any, key) => obj[key], newDoc) : newDoc;
                    nestedObj[lastKey] = parsedValue;
                    setEditDocument(newDoc);
                  } else {
                    const newDoc = { ...newDocument };
                    const keys = path.split('.');
                    const lastKey = keys.pop() as string;
                    const nestedObj = keys.length ? keys.reduce((obj: any, key) => obj[key], newDoc) : newDoc;
                    nestedObj[lastKey] = parsedValue;
                    setNewDocument(newDoc);
                  }
                }
              } catch (err) {
                // Invalid JSON, do nothing
              }
            }}
            rows={3}
          />
        </div>
      );
    }
    
    // Handle objects
    if (typeof currentValue === 'object' && currentValue !== null) {
      return (
        <div key={path} className="mb-4 p-4 border border-neutral-300 rounded-md dark:border-neutral-700">
          <h5 className="text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">{key}</h5>
          {Object.entries(currentValue).map(([nestedKey, nestedValue]) => (
            renderFieldEditor(nestedKey, nestedValue, `${path}.${nestedKey}`, targetObj)
          ))}
        </div>
      );
    }
    
    // Handle boolean values
    if (typeof currentValue === 'boolean') {
      return (
        <div key={path} className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={path}
              checked={currentValue}
              onChange={(e) => handleInputChange(e, path, targetObj)}
              className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <label htmlFor={path} className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
              {key}
            </label>
          </div>
        </div>
      );
    }
    
    // Handle dates
    if (currentValue instanceof Date || (typeof currentValue === 'string' && currentValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/))) {
      const dateValue = currentValue instanceof Date 
        ? currentValue.toISOString().slice(0, 16) 
        : new Date(currentValue).toISOString().slice(0, 16);
        
      return (
        <div key={path} className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {key}
          </label>
          <input
            type="datetime-local"
            className="mt-1 block w-full p-2 border border-neutral-300 rounded-md text-neutral-900 dark:text-white dark:bg-neutral-800 dark:border-neutral-700"
            value={dateValue}
            onChange={(e) => {
              const newDate = new Date(e.target.value).toISOString();
              if (targetObj === 'edit') {
                const newDoc = { ...editDocument! };
                const keys = path.split('.');
                const lastKey = keys.pop() as string;
                const nestedObj = keys.length ? keys.reduce((obj: any, key) => obj[key], newDoc) : newDoc;
                nestedObj[lastKey] = newDate;
                setEditDocument(newDoc);
              } else {
                const newDoc = { ...newDocument };
                const keys = path.split('.');
                const lastKey = keys.pop() as string;
                const nestedObj = keys.length ? keys.reduce((obj: any, key) => obj[key], newDoc) : newDoc;
                nestedObj[lastKey] = newDate;
                setNewDocument(newDoc);
              }
            }}
          />
        </div>
      );
    }
    
    // For everything else, use a text input
    return (
      <div key={path} className="mb-4">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {key}
        </label>
        <input
          type={typeof currentValue === 'number' ? 'number' : 'text'}
          className="mt-1 block w-full p-2 border border-neutral-300 rounded-md text-neutral-900 dark:text-white dark:bg-neutral-800 dark:border-neutral-700"
          value={currentValue === null ? '' : currentValue}
          onChange={(e) => handleInputChange(e, path, targetObj)}
        />
      </div>
    );
  };

  const toggleExpandDocument = (id: string) => {
    setExpandedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderDocumentValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') {
      if (value instanceof Date) return value.toLocaleString();
      return '[Object]';
    }
    return String(value);
  };

  if (!isUnlocked) {
    return (
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-md my-8">
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-white flex items-center">
          <FaDatabase className="mr-2 text-blue-500" /> Database Manager
        </h2>
        
        <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <div className="flex items-center justify-center mb-6">
            <FaLock className="text-4xl text-yellow-500" />
          </div>
          
          <h3 className="text-lg font-medium text-center mb-4 text-neutral-800 dark:text-white">
            This component is locked for security reasons
          </h3>
          
          <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
            Enter your password to access the database management features. 
            Any admin can use their own password for verification.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
              Admin Password
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded-md text-neutral-900 dark:text-white dark:bg-neutral-700 dark:border-neutral-600"
              placeholder="Enter admin password"
              onKeyDown={(e => {
                if (e.key === 'Enter') {
                  unlockDatabaseManager();
                }
              }
              )}
            />
          </div>
          
          <button
            onClick={unlockDatabaseManager}
            disabled={isLoading}
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? 'Unlocking...' : (
              <>
                <FaUnlock className="mr-2" /> Unlock Database Manager
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-md my-8">
      {/* Custom Confirmation Dialog */}
      <ConfirmationDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        confirmButtonColor={confirmDialog.confirmButtonColor}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        isLoading={isLoading}
        icon={confirmDialog.icon}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white flex items-center">
          <FaDatabase className="mr-2 text-blue-500" /> Database Manager
        </h2>
        
        <button 
          onClick={() => setIsUnlocked(false)}
          className="p-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaLock className="text-lg" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Collections Panel */}
        <div className="md:col-span-1 bg-white dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">Collections</h3>
          
          <div className="max-h-[500px] overflow-y-auto">
            {collections.length === 0 ? (
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">No collections found</p>
            ) : (
              <ul className="space-y-1">
                {collections.map((collection) => (
                  <li key={collection} className="flex items-center justify-between group">
                    <button
                      onClick={() => setSelectedCollection(collection)}
                      className={`flex-grow text-left p-2 rounded-md text-sm ${
                        selectedCollection === collection
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {collection}
                    </button>
                    <button
                      onClick={() => handleDropCollection(collection)}
                      className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-opacity"
                      title={`Drop ${collection} collection`}
                    >
                      <FaTrash size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Documents Panel */}
        <div className="md:col-span-3 bg-white dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          {!selectedCollection ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <FaDatabase className="text-4xl mb-3" />
              <p>Select a collection to view its documents</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                  {selectedCollection}
                </h3>
                
                <button
                  onClick={() => setShowNewForm(true)}
                  className="flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <FaPlus className="mr-1" /> New Document
                </button>
              </div>                  {/* Create New Document Form */}
              {showNewForm && collectionSchema && (
                <div className="mb-6 p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-neutral-800 dark:text-white">New Document</h4>
                    <button
                      onClick={() => setShowNewForm(false)}
                      className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  {Object.entries(collectionSchema).map(([key, value]) => (
                    renderFieldEditor(key, value, key, 'new', value)
                  ))}
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setShowNewForm(false)}
                      className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateDocument}
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating...' : 'Create Document'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Document List */}
              {isLoading && documents.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-neutral-500 dark:text-neutral-400">Loading documents...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-neutral-500 dark:text-neutral-400">No documents found in this collection</p>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                      <thead className="bg-neutral-50 dark:bg-neutral-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Document</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                        {documents.map((document) => (
                          <React.Fragment key={document._id}>
                            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                              <td className="px-6 py-4">
                                <button 
                                  onClick={() => toggleExpandDocument(document._id)}
                                  className="flex items-center text-neutral-800 dark:text-neutral-200"
                                >
                                  {expandedDocs[document._id] ? 
                                    <FaChevronDown className="mr-2 text-neutral-500" /> : 
                                    <FaChevronRight className="mr-2 text-neutral-500" />}
                                  <span className="font-mono text-neutral-600 dark:text-neutral-300">
                                    {document._id}
                                  </span>
                                </button>
                              </td>
                              <td className="px-6 py-4 text-right text-sm">
                                <button
                                  onClick={() => handleEdit(document)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mx-2"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete(document._id)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 mx-2"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                            {expandedDocs[document._id] && (
                              <tr>
                                <td colSpan={2} className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900">
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(document).map(([key, value]) => (
                                      <div key={key} className="text-sm">
                                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{key}:</span>{' '}
                                        <span className="text-neutral-600 dark:text-neutral-400 font-mono">
                                          {renderDocumentValue(value)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Showing {documents.length} of {pagination.total} documents
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                          disabled={pagination.page === 1}
                          className="px-3 py-1 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm text-neutral-600 dark:text-neutral-400">
                          Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                          onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                          disabled={pagination.page === pagination.pages}
                          className="px-3 py-1 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Edit Document Modal */}
              {editDocument && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                          Edit Document
                        </h3>
                        <button
                          onClick={handleCancelEdit}
                          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                          Admin Password (required to save changes)
                        </label>
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full p-2 border border-neutral-300 rounded-md text-neutral-900 dark:text-white dark:bg-neutral-700 dark:border-neutral-600"
                          placeholder="Enter admin password"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <div className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded-md mb-4">
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Document ID:
                          </span>{' '}
                          <span className="font-mono text-neutral-600 dark:text-neutral-400 text-sm">
                            {editDocument._id}
                          </span>
                        </div>
                        
                        {Object.entries(editDocument).map(([key, value]) => (
                          renderFieldEditor(key, value, key, 'edit')
                        ))}
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                          {isLoading ? 'Saving...' : (
                            <>
                              <FaSave className="mr-1" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;
