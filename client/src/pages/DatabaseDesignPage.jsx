import React from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import { Database, Table, Share2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const DatabaseDesignPage = () => {
  const schema = [
    {
      model: 'User',
      description: 'Stores platform users and their roles.',
      fields: [
        { name: '_id', type: 'ObjectId', required: 'Yes', relation: 'Primary Key' },
        { name: 'name', type: 'String', required: 'Yes', relation: '-' },
        { name: 'email', type: 'String', required: 'Yes (Unique)', relation: '-' },
        { name: 'password', type: 'String', required: 'Yes', relation: '-' },
        { name: 'role', type: 'Enum', required: 'Default: developer', relation: 'admin, pm, dev, viewer' },
        { name: 'workspaceIds', type: 'Array of ObjectIds', required: 'No', relation: 'Workspace' },
        { name: 'createdAt', type: 'Date', required: 'Default: Now', relation: '-' },
      ]
    },
    {
      model: 'Workspace',
      description: 'High-level containers for projects and teams.',
      fields: [
        { name: '_id', type: 'ObjectId', required: 'Yes', relation: 'Primary Key' },
        { name: 'name', type: 'String', required: 'Yes', relation: '-' },
        { name: 'owner', type: 'ObjectId', required: 'Yes', relation: 'User' },
        { name: 'members', type: 'Array of ObjectIds', required: 'No', relation: 'User' },
        { name: 'createdAt', type: 'Date', required: 'Default: Now', relation: '-' },
      ]
    },
    {
      model: 'Project',
      description: 'Individual projects within a workspace.',
      fields: [
        { name: '_id', type: 'ObjectId', required: 'Yes', relation: 'Primary Key' },
        { name: 'workspaceId', type: 'ObjectId', required: 'Yes', relation: 'Workspace' },
        { name: 'name', type: 'String', required: 'Yes', relation: '-' },
        { name: 'description', type: 'String', required: 'No', relation: '-' },
        { name: 'members', type: 'Array of ObjectIds', required: 'No', relation: 'User' },
        { name: 'createdBy', type: 'ObjectId', required: 'Yes', relation: 'User' },
        { name: 'createdAt', type: 'Date', required: 'Default: Now', relation: '-' },
      ]
    },
    {
      model: 'Task',
      description: 'Actionable items within a project.',
      fields: [
        { name: '_id', type: 'ObjectId', required: 'Yes', relation: 'Primary Key' },
        { name: 'projectId', type: 'ObjectId', required: 'Yes', relation: 'Project' },
        { name: 'title', type: 'String', required: 'Yes', relation: '-' },
        { name: 'description', type: 'String', required: 'No', relation: '-' },
        { name: 'status', type: 'Enum', required: 'Default: todo', relation: 'todo, in_progress, review, done' },
        { name: 'priority', type: 'Enum', required: 'Default: medium', relation: 'low, medium, high, urgent' },
        { name: 'assignee', type: 'ObjectId', required: 'No', relation: 'User' },
        { name: 'dueDate', type: 'Date', required: 'No', relation: '-' },
        { name: 'subtasks', type: 'Array of Objects', required: 'No', relation: 'title, isCompleted' },
        { name: 'labels', type: 'Array of Strings', required: 'No', relation: '-' },
        { name: 'createdBy', type: 'ObjectId', required: 'Yes', relation: 'User' },
        { name: 'createdAt', type: 'Date', required: 'Default: Now', relation: '-' },
      ]
    },
    {
      model: 'Activity',
      description: 'Audit log of actions performed in the system.',
      fields: [
        { name: 'workspaceId', type: 'ObjectId', required: 'Yes', relation: 'Workspace' },
        { name: 'projectId', type: 'ObjectId', required: 'No', relation: 'Project' },
        { name: 'taskId', type: 'ObjectId', required: 'No', relation: 'Task' },
        { name: 'userId', type: 'ObjectId', required: 'Yes', relation: 'User' },
        { name: 'action', type: 'String', required: 'Yes', relation: '-' },
        { name: 'details', type: 'String', required: 'Yes', relation: '-' },
        { name: 'createdAt', type: 'Date', required: 'Default: Now', relation: '-' },
      ]
    },
    {
      model: 'Meeting',
      description: 'Scheduled or ad-hoc video meetings.',
      fields: [
        { name: 'title', type: 'String', required: 'Yes', relation: '-' },
        { name: 'date', type: 'Date', required: 'Yes', relation: '-' },
        { name: 'time', type: 'String', required: 'Yes', relation: '-' },
        { name: 'roomId', type: 'String', required: 'Yes (Unique)', relation: '-' },
        { name: 'organizer', type: 'ObjectId', required: 'Yes', relation: 'User' },
        { name: 'project', type: 'ObjectId', required: 'No', relation: 'Project' },
      ]
    }
  ];

  return (
    <Layout>
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Database size={28} />
          </div>
          Database Architecture
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl text-lg font-medium">Detailed schema documentation representing the relational structure and data types of the entire SLiq ecosystem.</p>
      </div>

      <div className="space-y-16 pb-20">
        {schema.map((table, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={table.model} 
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Table size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{table.model}</h2>
                  <p className="text-sm font-bold text-gray-400 mt-0.5">{table.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full">Active Collection</span>
              </div>
            </div>

            <DataTable 
              columns={[
                { header: 'Field Name', accessor: 'name', cell: (row) => (
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
                    {row.name}
                  </span>
                )},
                { header: 'Data Type', accessor: 'type', cell: (row) => (
                  <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600 font-mono italic">
                    {row.type}
                  </span>
                )},
                { header: 'Required', accessor: 'required', cell: (row) => (
                  <span className={`text-xs font-bold ${row.required.includes('Yes') ? 'text-amber-600' : 'text-gray-400'}`}>
                    {row.required}
                  </span>
                )},
                { header: 'Relation / Extras', accessor: 'relation', cell: (row) => (
                  <div className="flex items-center gap-2">
                    {row.relation !== '-' && <Share2 size={12} className="text-indigo-400" />}
                    <span className={`text-[11px] font-bold ${row.relation !== '-' ? 'text-indigo-600 underline decoration-indigo-200 underline-offset-4' : 'text-gray-400'}`}>
                      {row.relation}
                    </span>
                  </div>
                )}
              ]}
              data={table.fields}
            />
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};

export default DatabaseDesignPage;
