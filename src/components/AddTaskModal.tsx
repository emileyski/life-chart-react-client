import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto) => void;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  points: number;
  priority: 'low' | 'medium' | 'high' | 'highest';
  type: 'positive' | 'negative';
  isRegular: boolean;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [taskData, setTaskData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    points: 1,
    priority: 'low',
    type: 'positive',
    isRegular: false,
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setTaskData({ ...taskData, [name as string]: value });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskData({ ...taskData, [event.target.name]: event.target.checked });
  };

  const handleSubmit = () => {
    onSubmit(taskData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}
      >
        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
        <form className="space-y-4">
          <TextField
            name="title"
            label="Title"
            fullWidth
            required
            value={taskData.title}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={taskData.description}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            name="points"
            label="Points"
            type="number"
            fullWidth
            required
            inputProps={{ min: 1, max: 100 }}
            value={taskData.points}
            onChange={handleChange}
            className="mb-4"
          />
          <FormControl fullWidth className="mb-4">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={taskData.priority}
              onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="highest">Highest</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className="mb-4">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={taskData.type}
              onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
            >
              <MenuItem value="positive">Positive</MenuItem>
              <MenuItem value="negative">Negative</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                name="isRegular"
                checked={taskData.isRegular}
                onChange={handleCheckboxChange}
              />
            }
            label="Is Regular"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add Task
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default AddTaskModal;
