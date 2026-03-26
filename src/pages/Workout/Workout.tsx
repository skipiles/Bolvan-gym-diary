import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
  Fab,
  Paper,
  Collapse,
} from '@mui/material'
import { Add, Delete, Edit, ExpandLess, ExpandMore } from '@mui/icons-material'
import { useWorkoutTracker } from '@features/workout/hooks/useWorkoutTracker'
import type { WorkoutExercise } from '@features/workout/hooks/useWorkoutTracker'
import { WorkoutCalendar } from '@features/workout/components/WorkoutCalendar'
import { ExerciseSelector } from '@features/workout/components/ExerciseSelector'
import { AddSetDialog } from '@features/workout/components/AddSetDialog'
import { EditExerciseDialog } from '@features/workout/components/EditExerciseDialog'
import type { Exercise } from '@features/workout/data/exercises'

const Workout: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    selectedDate,
    setSelectedDate,
    getWorkoutForDate,
    hasWorkoutOnDate,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateExercise,
  } = useWorkoutTracker()

  const [selectorOpen, setSelectorOpen] = useState(false)
  const [addSetOpen, setAddSetOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  )
  const [editingExercise, setEditingExercise] =
    useState<WorkoutExercise | null>(null)
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)

  const workoutForToday = getWorkoutForDate(selectedDate)
  const isToday = selectedDate.toDateString() === new Date().toDateString()

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setSelectorOpen(false)
    setAddSetOpen(true)
  }

  const handleAddSets = (sets: { reps: number; weight: number }[]) => {
    if (selectedExercise) {
      addExerciseToWorkout(selectedDate, {
        id: `${selectedExercise.id}-${Date.now()}`,
        name: selectedExercise.name,
        muscleGroup: selectedExercise.muscleGroup,
        sets: sets,
      })
      setSelectedExercise(null)
    }
  }

  const handleDeleteExercise = (exerciseId: string) => {
    if (window.confirm('Удалить это упражнение из тренировки?')) {
      removeExerciseFromWorkout(selectedDate, exerciseId)
    }
  }

  const handleEditExercise = (exercise: WorkoutExercise) => {
    setEditingExercise(exercise)
    setEditDialogOpen(true)
  }

  const handleUpdateExercise = (updatedExercise: WorkoutExercise) => {
    updateExercise(selectedDate, updatedExercise.id, updatedExercise)
  }

  const toggleExpand = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId)
  }

  const formatDate = (date: Date) => {
    if (isSmallMobile) {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'numeric',
      })
    }
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F2F2F7',
        pb: isMobile ? 8 : 3,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Заголовок */}
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 700,
            color: '#000',
            mb: { xs: 2, sm: 3 },
            textAlign: 'center',
            fontSize: { xs: '24px', sm: '28px' },
          }}
        >
          Тренировки
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {/* Календарь - на мобильных сверху */}
          <Box sx={{ order: { xs: 1, md: 1 }, width: '100%' }}>
            <WorkoutCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              hasWorkoutOnDate={hasWorkoutOnDate}
            />
          </Box>

          {/* Список упражнений */}
          <Box sx={{ order: { xs: 2, md: 2 }, width: '100%' }}>
            {/* Заголовок - на мобильных только текст, кнопка в FAB */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: { xs: '18px', sm: '20px' } }}
              >
                {isSmallMobile
                  ? 'Тренировка'
                  : `Тренировка на ${formatDate(selectedDate)}`}
                {isToday && !isSmallMobile && ' (сегодня)'}
              </Typography>
              {/* Кнопка добавления только для десктопа */}
              {!isMobile && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setSelectorOpen(true)}
                  sx={{
                    background: '#FF3B30',
                    '&:hover': { background: '#D63027' },
                    textTransform: 'none',
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                  }}
                >
                  Добавить упражнение
                </Button>
              )}
            </Box>

            {/* Список упражнений */}
            {workoutForToday.length === 0 ? (
              <Paper
                sx={{
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  💪 Нет упражнений
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isMobile
                    ? 'Нажмите + чтобы добавить'
                    : 'Добавьте первую тренировку на сегодня'}
                </Typography>
              </Paper>
            ) : (
              workoutForToday.map((ex) => {
                const isExpanded = expandedExercise === ex.id
                const totalReps = ex.sets.reduce(
                  (sum, set) => sum + set.reps,
                  0,
                )
                const totalWeight = ex.sets.reduce(
                  (sum, set) => sum + set.weight * set.reps,
                  0,
                )

                return (
                  <Paper
                    key={ex.id}
                    sx={{
                      mb: 2,
                      borderRadius: '14px',
                      backgroundColor: '#FFFFFF',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Box
                      onClick={() => toggleExpand(ex.id)}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:active': {
                          backgroundColor: 'rgba(0,0,0,0.02)',
                        },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: '16px', sm: '17px' },
                            mb: 0.5,
                          }}
                        >
                          {ex.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                          {ex.sets.length} подходов • {totalReps} повторений
                          {totalWeight > 0 && ` • ${totalWeight} кг`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditExercise(ex)
                          }}
                          sx={{ color: '#007AFF' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteExercise(ex.id)
                          }}
                          sx={{ color: '#FF3B30' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </Box>
                    </Box>

                    <Collapse in={isExpanded}>
                      <Box
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          pt: 0,
                          borderTop: '1px solid #F2F2F7',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: '#8E8E93', mb: 1, display: 'block' }}
                        >
                          Подходы:
                        </Typography>
                        {ex.sets.map((set, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 1,
                              borderBottom:
                                idx < ex.sets.length - 1
                                  ? '1px solid #F2F2F7'
                                  : 'none',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500, minWidth: '60px' }}
                            >
                              {idx + 1}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#000000' }}
                            >
                              {set.reps} повт.
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#FF3B30', fontWeight: 500 }}
                            >
                              {set.weight > 0 ? `${set.weight} кг` : 'свой вес'}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Paper>
                )
              })
            )}
          </Box>
        </Box>
      </Container>

      {/* Плавающая кнопка добавления только для мобильных */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setSelectorOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            backgroundColor: '#FF3B30',
            '&:hover': { backgroundColor: '#D63027' },
            width: 56,
            height: 56,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          <Add sx={{ fontSize: 28 }} />
        </Fab>
      )}

      {/* Диалоги */}
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

      <EditExerciseDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdateExercise}
        exercise={editingExercise}
      />
    </Box>
  )
}

export default Workout
