import React, { useState, useRef, useCallback, memo } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  List,
  TextField,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material'
import { Add, Delete, Check, PhotoCamera } from '@mui/icons-material'
import { ExerciseSelector } from '@features/workout/components/ExerciseSelector'
import { AddSetDialog } from '@features/workout/components/AddSetDialog'
import type { Exercise } from '@features/workout/data/exercises'
import type { WorkoutExercise, WorkoutSession } from '@/types/workout'

interface ActiveWorkoutProps {
  workout: {
    id: string
    startTime: Date
    exercises: WorkoutExercise[]
    date: Date
  }
  onSave: (workout: WorkoutSession) => void
  onCancel: () => void
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = memo(
  ({ workout: initialWorkout, onSave, onCancel }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [exercises, setExercises] = useState<WorkoutExercise[]>(
      initialWorkout.exercises,
    )
    const [selectorOpen, setSelectorOpen] = useState(false)
    const [addSetOpen, setAddSetOpen] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
      null,
    )
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [notes, setNotes] = useState('')
    const [startTime, setStartTime] = useState(
      initialWorkout.startTime.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    )
    const [endTime, setEndTime] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [showError, setShowError] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSelectExercise = useCallback((exercise: Exercise) => {
      setSelectedExercise(exercise)
      setSelectorOpen(false)
      setAddSetOpen(true)
    }, [])

    const handleAddSets = useCallback(
      (sets: { reps: number; weight: number }[], useBodyweight: boolean) => {
        if (selectedExercise) {
          const newExercise: WorkoutExercise = {
            id: `${selectedExercise.id}-${Date.now()}`,
            name: selectedExercise.name,
            muscleGroup: selectedExercise.muscleGroup,
            sets: useBodyweight
              ? sets.map((set) => ({ ...set, weight: 0 }))
              : sets,
          }
          setExercises((prev) => [...prev, newExercise])
          setSelectedExercise(null)
        }
      },
      [selectedExercise],
    )

    const handleRemoveExercise = useCallback((exerciseId: string) => {
      setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId))
    }, [])

    const handlePhotoUpload = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setPhotoPreview(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
      },
      [],
    )

    const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (newValue.length <= 300 && newValue !== notes) {
        setNotes(newValue)
      }
    }

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartTime(e.target.value)
    }

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndTime(e.target.value)
    }

    const handleFinishWorkout = useCallback(async () => {
      if (isSaving) return

      if (!startTime) {
        setErrorMessage('Укажите время начала тренировки')
        setShowError(true)
        return
      }
      if (!endTime) {
        setErrorMessage('Укажите время окончания тренировки')
        setShowError(true)
        return
      }
      if (exercises.length === 0) {
        setErrorMessage('Добавьте хотя бы одно упражнение')
        setShowError(true)
        return
      }

      const [startHours, startMinutes] = startTime.split(':').map(Number)
      const [endHours, endMinutes] = endTime.split(':').map(Number)

      const startTotal = startHours * 60 + startMinutes
      const endTotal = endHours * 60 + endMinutes
      const durationMinutes = endTotal - startTotal

      if (durationMinutes <= 0) {
        setErrorMessage('Время окончания должно быть позже времени начала')
        setShowError(true)
        return
      }

      const totalVolume = exercises.reduce((sum, ex) => {
        return sum + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0)
      }, 0)

      setIsSaving(true)

      try {
        await onSave({
          id: Date.now().toString(),
          date: initialWorkout.date.toISOString().split('T')[0],
          startTime: startTime,
          endTime: endTime,
          photoUrl: photoPreview || undefined,
          notes: notes || undefined,
          exercises: exercises,
          durationMinutes: durationMinutes,
          totalVolume,
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorMessage('Ошибка сохранения тренировки')
        setShowError(true)
      } finally {
        setIsSaving(false)
      }
    }, [
      startTime,
      endTime,
      exercises,
      initialWorkout.date,
      photoPreview,
      notes,
      onSave,
      isSaving,
    ])

    const redTextFieldSx = {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#C6C6C8',
        },
        '&:hover fieldset': {
          borderColor: '#FF3B30',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#FF3B30',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#8E8E93',
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#FF3B30',
      },
    }

    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
            Тренировка на {initialWorkout.date.toLocaleDateString('ru-RU')}
          </Typography>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: '#FF3B30',
              borderColor: '#FF3B30',
              '&:hover': {
                borderColor: '#FF3B30',
                backgroundColor: 'rgba(255, 59, 48, 0.04)',
              },
              borderRadius: '10px',
              textTransform: 'none',
            }}
          >
            Прервать
          </Button>
        </Box>

        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #C6C6C8',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <TextField
              label="Время начала"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              sx={{ flex: 1, ...redTextFieldSx }}
              InputLabelProps={{ shrink: true }}
              size="small"
              required
            />
            <TextField
              label="Время окончания"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              sx={{ flex: 1, ...redTextFieldSx }}
              InputLabelProps={{ shrink: true }}
              size="small"
              required
            />
          </Box>
        </Paper>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setSelectorOpen(true)}
          fullWidth
          sx={{
            mb: 2,
            background: '#FF3B30',
            '&:hover': { background: '#D63027' },
            borderRadius: '12px',
            textTransform: 'none',
            py: 1.5,
          }}
        >
          Добавить упражнение
        </Button>

        {exercises.length > 0 && (
          <>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1, color: '#000' }}
            >
              Упражнения:
            </Typography>
            <List sx={{ mb: 2 }}>
              {exercises.map((ex) => (
                <Paper
                  key={ex.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid #C6C6C8',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: '#000' }}
                    >
                      {ex.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveExercise(ex.id)}
                      sx={{ color: '#FF3B30' }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                  {ex.sets.map((set, setIdx) => (
                    <Typography
                      key={setIdx}
                      variant="caption"
                      display="block"
                      sx={{ color: '#3C3C4399' }}
                    >
                      Подход {setIdx + 1}: {set.reps} повт,{' '}
                      {set.weight > 0 ? `${set.weight} кг` : 'свой вес'}
                    </Typography>
                  ))}
                </Paper>
              ))}
            </List>
          </>
        )}

        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #C6C6C8',
          }}
        >
          <TextField
            fullWidth
            label="Заметки к тренировке"
            multiline
            rows={3}
            value={notes}
            onChange={handleNotesChange}
            helperText={`${notes.length}/300 символов`}
            size="small"
            sx={redTextFieldSx}
          />
        </Paper>

        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #C6C6C8',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<PhotoCamera />}
            onClick={() => fileInputRef.current?.click()}
            fullWidth
            sx={{
              mb: photoPreview ? 2 : 0,
              color: '#FF3B30',
              borderColor: '#FF3B30',
              '&:hover': {
                borderColor: '#FF3B30',
                backgroundColor: 'rgba(255, 59, 48, 0.04)',
              },
            }}
          >
            Добавить фото
          </Button>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handlePhotoUpload}
          />
          {photoPreview && (
            <Box
              component="img"
              src={photoPreview}
              sx={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                maxHeight: '250px',
                objectFit: 'contain',
                borderRadius: '12px',
                mt: 1,
                display: 'block',
                margin: '0 auto',
              }}
            />
          )}
        </Paper>

        {exercises.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Check />}
            onClick={handleFinishWorkout}
            disabled={isSaving}
            fullWidth
            sx={{
              mb: 3,
              background: '#34C759',
              '&:hover': { background: '#2DA84E' },
              borderRadius: '12px',
              textTransform: 'none',
              py: 1.5,
            }}
          >
            {isSaving ? 'Сохранение...' : 'Завершить тренировку'}
          </Button>
        )}

        <Snackbar
          open={showError}
          autoHideDuration={3000}
          onClose={() => setShowError(false)}
        >
          <Alert severity="error" sx={{ bgcolor: '#FF3B30', color: '#fff' }}>
            {errorMessage}
          </Alert>
        </Snackbar>

        <ExerciseSelector
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          onSelectExercise={handleSelectExercise}
        />

        <AddSetDialog
          open={addSetOpen}
          onClose={() => setAddSetOpen(false)}
          onAdd={handleAddSets}
          exercise={selectedExercise}
        />
      </Container>
    )
  },
)

ActiveWorkout.displayName = 'ActiveWorkout'
