import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { Add, Delete, Close, FitnessCenter } from '@mui/icons-material'
import type { Exercise } from '../data/exercises'
import { muscleGroups } from '../data/exercises'

interface SetInput {
  reps: number
  weight: number
  isBodyweight?: boolean
}

interface AddSetDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (sets: SetInput[]) => void
  exercise: Exercise | null
}

export const AddSetDialog: React.FC<AddSetDialogProps> = ({
  open,
  onClose,
  onAdd,
  exercise,
}) => {
  const [sets, setSets] = useState<SetInput[]>([
    { reps: 0, weight: 0, isBodyweight: false },
  ])
  const [useBodyweight, setUseBodyweight] = useState(
    exercise?.isBodyweight || false,
  )

  useEffect(() => {
    if (open) {
      setSets([{ reps: 0, weight: 0, isBodyweight: useBodyweight }])
    }
  }, [open, useBodyweight])

  useEffect(() => {
    if (exercise) {
      setUseBodyweight(exercise.isBodyweight || false)
    }
  }, [exercise])

  const handleAddSet = () => {
    setSets([...sets, { reps: 0, weight: 0, isBodyweight: useBodyweight }])
  }

  const handleRemoveSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index))
  }

  const handleSetChange = (
    index: number,
    field: keyof SetInput,
    value: number,
  ) => {
    const updated = [...sets]
    updated[index][field] = value
    setSets(updated)
  }

  const handleSubmit = () => {
    const validSets = sets.filter((set) => set.reps > 0)
    if (validSets.length > 0) {
      onAdd(validSets)
      onClose()
    }
  }

  if (!exercise) return null

  const muscleGroupName =
    muscleGroups[exercise.muscleGroup as keyof typeof muscleGroups]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          backgroundColor: '#FFFFFF',
          width: 'auto',
          minWidth: '280px',
          maxWidth: '360px',
          margin: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1.5,
          borderBottom: '1px solid #C6C6C8',
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, fontSize: '16px' }}
          >
            {exercise.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#8E8E93', fontSize: '11px' }}
          >
            {muscleGroupName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#007AFF' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 1.5,
          overflowY: 'auto',
          maxHeight: '50vh',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#E5E5EA',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#FF3B30',
            borderRadius: '4px',
          },
        }}
      >
        {exercise.isBodyweight && (
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={useBodyweight}
                onChange={(e) => setUseBodyweight(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#FF3B30',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#FF3B30',
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FitnessCenter
                  fontSize="small"
                  sx={{ color: '#FF3B30', fontSize: '14px' }}
                />
                <Typography variant="caption">Свой вес</Typography>
              </Box>
            }
            sx={{ mb: 1.5 }}
          />
        )}

        <Typography
          variant="caption"
          sx={{ mb: 1, color: '#000000', fontWeight: 500, display: 'block' }}
        >
          Подходы:
        </Typography>

        <List dense sx={{ p: 0 }}>
          {sets.map((set, idx) => (
            <Paper
              key={idx}
              sx={{
                mb: 1,
                p: 0.75,
                borderRadius: '10px',
                backgroundColor: '#F2F2F7',
              }}
            >
              <ListItem
                secondaryAction={
                  sets.length > 1 && (
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveSet(idx)}
                      size="small"
                    >
                      <Delete
                        fontSize="small"
                        sx={{ color: '#FF3B30', fontSize: '16px' }}
                      />
                    </IconButton>
                  )
                }
                sx={{ p: 0 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ minWidth: '24px', fontWeight: 500 }}
                  >
                    {idx + 1}
                  </Typography>
                  <TextField
                    type="number"
                    placeholder="повт"
                    value={set.reps || ''}
                    onChange={(e) =>
                      handleSetChange(idx, 'reps', Number(e.target.value))
                    }
                    size="small"
                    sx={{
                      flex: 1,
                      '& .MuiInputBase-input': {
                        fontSize: '13px',
                        padding: '6px 8px',
                      },
                    }}
                    inputProps={{ min: 0 }}
                  />
                  {!useBodyweight && (
                    <TextField
                      type="number"
                      placeholder="кг"
                      value={set.weight || ''}
                      onChange={(e) =>
                        handleSetChange(idx, 'weight', Number(e.target.value))
                      }
                      size="small"
                      sx={{
                        flex: 1,
                        '& .MuiInputBase-input': {
                          fontSize: '13px',
                          padding: '6px 8px',
                        },
                      }}
                      inputProps={{ min: 0, step: 0.5 }}
                    />
                  )}
                  {useBodyweight && (
                    <Typography
                      variant="caption"
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        color: '#FF3B30',
                        fontWeight: 500,
                      }}
                    >
                      вес тела
                    </Typography>
                  )}
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>

        <Button
          startIcon={<Add fontSize="small" />}
          onClick={handleAddSet}
          size="small"
          sx={{
            mt: 0.5,
            color: '#FF3B30',
            fontSize: '12px',
            '&:hover': {
              backgroundColor: 'rgba(255, 59, 48, 0.04)',
            },
          }}
        >
          Добавить подход
        </Button>
      </DialogContent>

      <DialogActions sx={{ p: 1.5, borderTop: '1px solid #C6C6C8' }}>
        <Button
          onClick={onClose}
          size="small"
          sx={{ color: '#8E8E93', fontSize: '14px' }}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="small"
          sx={{
            background: '#FF3B30',
            '&:hover': { background: '#D63027' },
            textTransform: 'none',
            borderRadius: '10px',
            px: 2,
            fontSize: '14px',
          }}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  )
}
