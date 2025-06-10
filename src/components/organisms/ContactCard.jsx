import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import DataCard from '@/components/molecules/DataCard';

const ContactCard = ({ contact, onEdit, onDelete, onClick }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'customer': return 'bg-success/10 text-success';
      case 'qualified': return 'bg-info/10 text-info';
      case 'lead': return 'bg-warning/10 text-warning';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DataCard onClick={() => onClick(contact)} className="cursor-pointer hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
          <p className="text-sm text-gray-600">{contact.position} at {contact.company}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <ApperIcon name="Mail" size={14} className="mr-1" />
              {contact.email}
            </span>
            <span className="flex items-center">
              <ApperIcon name="Phone" size={14} className="mr-1" />
              {contact.phone}
            </span>
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(contact.status)}`}>
              {contact.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contact);
            }}
            variant="ghost"
            className="p-2"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact.id);
            }}
            variant="ghostDanger"
            className="p-2"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </DataCard>
  );
};

export default ContactCard;