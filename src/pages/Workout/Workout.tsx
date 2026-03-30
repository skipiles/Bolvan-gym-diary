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
import { PlayArrow, Close, Delete } from '@mui/icons-material'
import { ActiveWorkout } from './ActiveWorkout'
import type { WorkoutSession } from '@/types/workout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { WorkoutCalendar } from '@features/workout/components/WorkoutCalendar'

const Workout: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useAuth()
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([])
  const [expandedWorkout, setExpandedWorkout] = useState<WorkoutSession | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const loadWorkoutHistory = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('workouts_new')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) {
      console.error('Ошибка загрузки тренировок:', error)
      setLoading(false)
      return
    }

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formatted: WorkoutSession[] = data.map((item: any) => ({
        id: item.id,
        date: item.date,
        startTime: item.start_time,
        endTime: item.end_time,
        photoUrl: item.photo_url || undefined,
        notes: item.notes || undefined,
        exercises: item.exercises,
        durationMinutes: item.duration_minutes,
      }))
      setWorkoutHistory(formatted)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadWorkoutHistory()
  }, [loadWorkoutHistory])

  const hasWorkoutOnDate = (date: Date): boolean => {
    const dateKey = date.toISOString().split('T')[0]
    return workoutHistory.some((w) => w.date === dateKey)
  }

  const getWorkoutsForDate = (date: Date): WorkoutSession[] => {
    const dateKey = date.toISOString().split('T')[0]
    return workoutHistory.filter((w) => w.date === dateKey)
  }

  const startWorkout = () => {
    setIsWorkoutActive(true)
  }

  const saveWorkout = async (workout: WorkoutSession) => {
    if (!user) return

    const { error } = await supabase.from('workouts_new').insert({
      user_id: user.id,
      date: workout.date,
      start_time: workout.startTime,
      end_time: workout.endTime,
      photo_url: workout.photoUrl,
      notes: workout.notes,
      exercises: workout.exercises,
      duration_minutes: workout.durationMinutes,
      total_volume: workout.totalVolume,
    })

    if (!error) {
      setIsWorkoutActive(false)
      await loadWorkoutHistory()
      setSnackbar({
        open: true,
        message: 'Тренировка сохранена!',
        severity: 'success',
      })
    } else {
      setSnackbar({
        open: true,
        message: 'Ошибка сохранения',
        severity: 'error',
      })
    }
  }

  const deleteWorkout = async () => {
    if (!user || !workoutToDelete) return

    const { error } = await supabase
      .from('workouts_new')
      .delete()
      .eq('id', workoutToDelete)
      .eq('user_id', user.id)

    if (!error) {
      await loadWorkoutHistory()
      setSnackbar({
        open: true,
        message: 'Тренировка удалена',
        severity: 'success',
      })
    } else {
      setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' })
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
          id: Date.now().toString(),
          startTime: new Date(),
          exercises: [],
          date: selectedDate,
        }}
        onSave={saveWorkout}
        onCancel={() => setIsWorkoutActive(false)}
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
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={startWorkout}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                background: '#FF3B30',
                '&:hover': { background: '#D63027' },
                borderRadius: '12px',
                textTransform: 'none',
              }}
            >
              Начать
            </Button>
          </Box>

          {workoutsOnSelectedDate.length === 0 ? (
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
                Нажмите "Начать" чтобы добавить
              </Typography>
            </Paper>
          ) : (
            workoutsOnSelectedDate.map((workout) => (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                      Показать
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </Box>

      {/* Остальные диалоги без изменений... */}
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
        {/* Содержимое диалога без изменений */}
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
                onClick={() => setExpandedWorkout(null)}
                sx={{ color: '#FF3B30', fontSize: isMobile ? '13px' : '14px' }}
              >
                Закрыть
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
