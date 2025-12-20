import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Chip } from '@mui/material';

export interface SortableItemProps {
  id: string;
  index: number;
  onRemove?: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '8px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Chip
        label={`${index + 1}. ${id}`}
        onDelete={onRemove ? () => onRemove(id) : undefined}
        color="primary"
        variant="outlined"
        sx={{ width: '100%', justifyContent: 'space-between', cursor: 'grab' }}
      />
    </div>
  );
};

export default SortableItem;
