import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { PlayArrow, Close, Delete, Edit } from '@mui/icons-material'
import { ActiveWorkout } from './ActiveWorkout'
import type { WorkoutSession, WorkoutDraft } from '@/types/workout'
import { useAuth } from '@/hooks/useAuth'
import { useWorkoutDraft } from '@/hooks/useWorkoutDraft'
import { WorkoutCalendar } from '@features/workout/components/WorkoutCalendar'

// Ключ для localStorage
const WORKOUTS_STORAGE_KEY = 'bolvan_workouts'

const Workout: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useAuth()
  const { loadDraft, deleteDraft } = useWorkoutDraft()

  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([])
  const [expandedWorkout, setExpandedWorkout] = useState<WorkoutSession | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
  const [savedDraft, setSavedDraft] = useState<WorkoutDraft | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  // Загрузка тренировок из localStorage
  const loadWorkoutHistory = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(WORKOUTS_STORAGE_KEY)
      const data = stored ? JSON.parse(stored) : {}

      // Преобразуем объект { date: exercises[] } в массив WorkoutSession[]
      const formatted: WorkoutSession[] = Object.entries(data).map(
        ([date, exercises]) => ({
          id: `workout-${date}`,
          date: date,
          startTime: '--:--',
          endTime: '--:--',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exercises: exercises as any[],
          durationMinutes: 0,
          totalVolume: 0,
        }),
      )

      // Сортируем по дате (новые сверху)
      formatted.sort((a, b) => b.date.localeCompare(a.date))

      setWorkoutHistory(formatted)
    } catch (error) {
      console.error('Ошибка загрузки тренировок:', error)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadWorkoutHistory()
  }, [loadWorkoutHistory])

  // Проверка наличия черновика на выбранную дату
  useEffect(() => {
    const checkDraft = async () => {
      const draft = await loadDraft(selectedDate)
      setHasDraft(!!draft)
      setSavedDraft(draft)
    }
    checkDraft()
  }, [selectedDate, loadDraft])

  const hasWorkoutOnDate = (date: Date): boolean => {
    const dateKey = date.toISOString().split('T')[0]
    return workoutHistory.some((w) => w.date === dateKey)
  }

  const getWorkoutsForDate = (date: Date): WorkoutSession[] => {
    const dateKey = date.toISOString().split('T')[0]
    return workoutHistory.filter((w) => w.date === dateKey)
  }

  const startNewWorkout = () => {
    setIsWorkoutActive(true)
  }

  const resumeWorkout = () => {
    setResumeDialogOpen(false)
    setIsWorkoutActive(true)
  }

  const cancelResume = () => {
    setResumeDialogOpen(false)
    deleteDraft(selectedDate)
    setHasDraft(false)
    startNewWorkout()
  }

  const saveWorkout = async (workout: WorkoutSession) => {
    if (!user) return

    try {
      const stored = localStorage.getItem(WORKOUTS_STORAGE_KEY)
      const allWorkouts = stored ? JSON.parse(stored) : {}

      // Сохраняем тренировку по дате
      allWorkouts[workout.date] = workout.exercises

      localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(allWorkouts))

      setIsWorkoutActive(false)
      await loadWorkoutHistory()

      // Удаляем черновик после сохранения
      await deleteDraft(new Date(workout.date))

      setSnackbar({
        open: true,
        message: 'Тренировка сохранена!',
        severity: 'success',
      })
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      setSnackbar({
        open: true,
        message: 'Ошибка сохранения тренировки',
        severity: 'error',
      })
    }
  }

  const deleteWorkout = async () => {
    if (!user || !workoutToDelete) return

    try {
      const stored = localStorage.getItem(WORKOUTS_STORAGE_KEY)
      const allWorkouts = stored ? JSON.parse(stored) : {}

      // Находим дату по id
      const dateToDelete = workoutToDelete.replace('workout-', '')
      delete allWorkouts[dateToDelete]

      localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(allWorkouts))

      await loadWorkoutHistory()
      setSnackbar({
        open: true,
        message: 'Тренировка удалена',
        severity: 'success',
      })
    } catch (error) {
      console.error('Ошибка удаления:', error)
      setSnackbar({
        open: true,
        message: 'Ошибка удаления тренировки',
        severity: 'error',
      })
    }
    setDeleteConfirmOpen(false)
    setWorkoutToDelete(null)
  }

  const truncateNotes = (notes: string, maxLength: number = 50): string => {
    if (!notes) return ''
    if (notes.length <= maxLength) return notes
    return notes.slice(0, maxLength) + '...'
  }

  const calculateDuration = (startTime?: string, endTime?: string): string => {
    if (!startTime || !endTime) return '—'
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const [endHours, endMinutes] = endTime.split(':').map(Number)
    const startTotal = startHours * 60 + startMinutes
    const endTotal = endHours * 60 + endMinutes
    const diffMinutes = endTotal - startTotal
    if (diffMinutes <= 0) return '—'
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`
  }

  const formatTime = (time?: string): string => {
    if (!time) return '—'
    const parts = time.split(':')
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`
    }
    return time
  }

  const workoutsOnSelectedDate = getWorkoutsForDate(selectedDate)

  if (isWorkoutActive) {
    return (
      <ActiveWorkout
        workout={{
          id: savedDraft?.id || Date.now().toString(),
          startTime: savedDraft?.start_time
            ? new Date(`2000-01-01T${savedDraft.start_time}`)
            : new Date(),
          exercises: savedDraft?.exercises || [],
          date: selectedDate,
        }}
        onSave={saveWorkout}
        onCancel={() => setIsWorkoutActive(false)}
        draftData={savedDraft || undefined}
      />
    )
  }

  if (loading) {
    return (
      <Container sx={{ py: 3, textAlign: 'center' }}>
        <Typography>Загрузка...</Typography>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: isMobile ? 2 : 3, px: isMobile ? 1.5 : 3 }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{
          fontWeight: 700,
          mb: isMobile ? 2 : 3,
          textAlign: 'center',
          color: '#000',
        }}
      >
        Тренировки
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: isMobile ? 2 : 3,
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
        }}
      >
        <WorkoutCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          hasWorkoutOnDate={hasWorkoutOnDate}
        />

        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#000',
                fontSize: isMobile ? '16px' : '18px',
              }}
            >
              {selectedDate.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>

            {hasDraft ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setResumeDialogOpen(true)}
                sx={{
                  background: '#34C759',
                  '&:hover': { background: '#2DA84E' },
                  borderRadius: '12px',
                  textTransform: 'none',
                }}
              >
                Продолжить
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={startNewWorkout}
                sx={{
                  background: '#FF3B30',
                  '&:hover': { background: '#D63027' },
                  borderRadius: '12px',
                  textTransform: 'none',
                }}
              >
                Новая
              </Button>
            )}
          </Box>

          {workoutsOnSelectedDate.length === 0 && !hasDraft ? (
            <Paper
              sx={{
                p: isMobile ? 3 : 4,
                textAlign: 'center',
                borderRadius: '14px',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Нет тренировок в этот день
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Нажмите "Новая" чтобы начать
              </Typography>
            </Paper>
          ) : (
            <>
              {hasDraft && savedDraft && (
                <Paper
                  sx={{
                    mb: 2,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '2px solid #34C759',
                    opacity: 0.9,
                  }}
                >
                  <Box sx={{ p: 1.5, bgcolor: '#34C75910' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: '#34C759', fontWeight: 600 }}
                        >
                          ⏳ Черновик
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: '#000' }}
                        >
                          {selectedDate.toLocaleDateString('ru-RU')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {savedDraft.start_time || '—'} •{' '}
                          {savedDraft.exercises.length} упражнений
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setResumeDialogOpen(true)}
                        sx={{ color: '#34C759', borderColor: '#34C759' }}
                      >
                        Продолжить
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              )}

              {workoutsOnSelectedDate.map((workout) => (
                <Paper
                  key={workout.id}
                  sx={{
                    mb: 2,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid #C6C6C8',
                  }}
                >
                  <Box
                    onClick={() => setExpandedWorkout(workout)}
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: '#000',
                          fontSize: isMobile ? '14px' : '16px',
                        }}
                      >
                        {workout.date}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: isMobile ? '12px' : '14px' }}
                      >
                        {formatTime(workout.startTime)} -{' '}
                        {formatTime(workout.endTime)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {workout.exercises.length} упражнений •{' '}
                        {calculateDuration(workout.startTime, workout.endTime)}
                      </Typography>
                      {workout.notes && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,
                            color: '#3C3C4399',
                            fontSize: isMobile ? '11px' : '13px',
                          }}
                        >
                          {truncateNotes(workout.notes, 40)}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: редактирование тренировки
                        }}
                        size="small"
                        sx={{ color: '#007AFF' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          setWorkoutToDelete(workout.id)
                          setDeleteConfirmOpen(true)
                        }}
                        size="small"
                        sx={{ color: '#FF3B30' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="button"
                        sx={{
                          color: '#34C759',
                          fontSize: isMobile ? '12px' : '14px',
                        }}
                      >
                        Детали
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </>
          )}
        </Box>
      </Box>

      {/* Диалог продолжения тренировки */}
      <Dialog
        open={resumeDialogOpen}
        onClose={() => setResumeDialogOpen(false)}
      >
        <DialogTitle>Продолжить тренировку?</DialogTitle>
        <DialogContent>
          <Typography>
            У вас есть несохранённая тренировка на{' '}
            {selectedDate.toLocaleDateString('ru-RU')}.
            {savedDraft?.exercises.length} упражнений уже добавлено.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Хотите продолжить или начать заново?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelResume} sx={{ color: '#FF3B30' }}>
            Начать заново
          </Button>
          <Button
            onClick={resumeWorkout}
            variant="contained"
            sx={{ bgcolor: '#34C759' }}
          >
            Продолжить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог деталей тренировки */}
      <Dialog
        open={!!expandedWorkout}
        onClose={() => setExpandedWorkout(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: isMobile ? '95%' : '500px',
            margin: 2,
          },
        }}
      >
        {expandedWorkout && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? '16px' : '18px',
                  color: '#000',
                }}
              >
                Детали тренировки
              </Typography>
              <IconButton
                onClick={() => setExpandedWorkout(null)}
                size="small"
                sx={{ color: '#FF3B30' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2, overflowY: 'auto' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: '#000',
                  fontSize: isMobile ? '14px' : '16px',
                }}
              >
                {expandedWorkout.date}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, fontSize: isMobile ? '12px' : '14px' }}
              >
                {formatTime(expandedWorkout.startTime)} -{' '}
                {formatTime(expandedWorkout.endTime)} •{' '}
                {calculateDuration(
                  expandedWorkout.startTime,
                  expandedWorkout.endTime,
                )}
              </Typography>

              {expandedWorkout.notes && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mt: 2,
                      mb: 1,
                      color: '#000',
                      fontSize: isMobile ? '13px' : '14px',
                    }}
                  >
                    Заметки:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: '#3C3C4399',
                      fontSize: isMobile ? '12px' : '14px',
                    }}
                  >
                    {expandedWorkout.notes}
                  </Typography>
                </>
              )}

              {expandedWorkout.photoUrl && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mt: 2, mb: 1, color: '#000' }}
                  >
                    Фото:
                  </Typography>
                  <Box
                    component="img"
                    src={expandedWorkout.photoUrl}
                    sx={{
                      width: '100%',
                      maxWidth: '250px',
                      height: 'auto',
                      borderRadius: '12px',
                      mb: 2,
                      display: 'block',
                      margin: '0 auto',
                    }}
                    alt="Фото тренировки"
                  />
                </>
              )}

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mt: 2, mb: 1, color: '#000' }}
              >
                Упражнения:
              </Typography>
              {expandedWorkout.exercises.map((ex) => (
                <Paper
                  key={ex.id}
                  sx={{ p: 2, mb: 2, bgcolor: '#F2F2F7', borderRadius: '12px' }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#000',
                      fontSize: isMobile ? '14px' : '16px',
                    }}
                  >
                    {ex.name}
                  </Typography>
                  {ex.sets.map((set, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      sx={{
                        color: '#3C3C4399',
                        fontSize: isMobile ? '11px' : '13px',
                      }}
                    >
                      Подход {idx + 1}: {set.reps} повторений,{' '}
                      {set.weight > 0 ? `${set.weight} кг` : 'свой вес'}
                    </Typography>
                  ))}
                </Paper>
              ))}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => {
                  setExpandedWorkout(null)
                }}
                sx={{ color: '#007AFF' }}
              >
                Редактировать
              </Button>
              <Button
                onClick={() => setExpandedWorkout(null)}
                sx={{ color: '#FF3B30' }}
              >
                Закрыть
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: isMobile ? '85%' : '320px',
            margin: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            pb: 0,
            fontWeight: 600,
            color: '#000',
            fontSize: isMobile ? '16px' : '18px',
          }}
        >
          Удалить тренировку?
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? '13px' : '14px' }}
          >
            Вы уверены, что хотите удалить эту тренировку? Это действие нельзя
            отменить.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} size="small">
            Отмена
          </Button>
          <Button
            onClick={deleteWorkout}
            variant="contained"
            size="small"
            sx={{ bgcolor: '#FF3B30' }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{
            bgcolor: snackbar.severity === 'success' ? '#34C759' : '#FF3B30',
            color: '#fff',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Workout
