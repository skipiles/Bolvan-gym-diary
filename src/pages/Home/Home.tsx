import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  Paper,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useWaterTracker } from '@features/water-tracker/hooks/useWaterTracker'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import type { WorkoutSession } from '@/types/workout'

// Ключи для localStorage
const WORKOUTS_STORAGE_KEY = 'bolvan_workouts'

const Home: React.FC = () => {
  const { user, profile, updateProfile } = useAuth()
  const { totalToday, progress } = useWaterTracker()
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [allWorkoutsDialogOpen, setAllWorkoutsDialogOpen] = useState(false)
  const [editWeight, setEditWeight] = useState('')
  const [editHeight, setEditHeight] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Загрузка тренировок из localStorage
  useEffect(() => {
    const loadWorkouts = () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const stored = localStorage.getItem(WORKOUTS_STORAGE_KEY)
        const data = stored ? JSON.parse(stored) : {}

        // Преобразуем объект { date: exercises[] } в массив WorkoutSession[]
        const formatted: WorkoutSession[] = Object.entries(data)
          .map(([date, exercises]) => ({
            id: `workout-${date}`,
            date: date,
            startTime: '--:--',
            endTime: '--:--',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            exercises: exercises as any[],
            durationMinutes: 0,
            totalVolume: 0,
          }))
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5) // Берём только 5 последних

        setWorkouts(formatted)
      } catch (error) {
        console.error('Ошибка загрузки тренировок:', error)
      }
      setLoading(false)
    }

    loadWorkouts()
  }, [user])

  // Загружаем аватар из localStorage
  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarPreview(profile.avatar_url)
    }
  }, [profile])

  // Заполняем поля редактирования при открытии диалога
  useEffect(() => {
    if (editDialogOpen && profile) {
      setEditWeight(profile.weight?.toString() || '')
      setEditHeight(profile.height?.toString() || '')
    }
  }, [editDialogOpen, profile])

  const formatTime = (time?: string): string => {
    if (!time) return '—'
    const parts = time.split(':')
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`
    }
    return time
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

  const truncateNotes = (notes: string, maxLength: number = 50): string => {
    if (!notes) return ''
    if (notes.length <= maxLength) return notes
    return notes.slice(0, maxLength) + '...'
  }

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)

    // Читаем файл как data URL (для локального хранения)
    const reader = new FileReader()
    reader.onloadend = () => {
      const avatarUrl = reader.result as string
      setAvatarPreview(avatarUrl)
      // Сохраняем аватар в профиле
      updateProfile({ avatar_url: avatarUrl })
      setUploadingAvatar(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    if (!user) return

    const weightNum = editWeight ? parseFloat(editWeight) : null
    const heightNum = editHeight ? parseFloat(editHeight) : null
    const newWaterGoal = weightNum ? Math.round(weightNum * 30) : 2000

    await updateProfile({
      weight: weightNum,
      height: heightNum,
      daily_water_goal: newWaterGoal,
    })

    setEditDialogOpen(false)
  }

  // Получить все тренировки для модалки "Все тренировки"
  const getAllWorkouts = (): WorkoutSession[] => {
    try {
      const stored = localStorage.getItem(WORKOUTS_STORAGE_KEY)
      const data = stored ? JSON.parse(stored) : {}

      return Object.entries(data)
        .map(([date, exercises]) => ({
          id: `workout-${date}`,
          date: date,
          startTime: '--:--',
          endTime: '--:--',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exercises: exercises as any[],
          durationMinutes: 0,
          totalVolume: 0,
        }))
        .sort((a, b) => b.date.localeCompare(a.date))
    } catch {
      return []
    }
  }

  const allWorkouts = getAllWorkouts()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography>Загрузка профиля...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      {/* Карточка профиля */}
      <Card
        sx={{
          borderRadius: '20px',
          border: '1px solid #C6C6C8',
          mb: 3,
          position: 'relative',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={() => setEditDialogOpen(true)}
        >
          <EditIcon sx={{ color: '#007AFF' }} />
        </IconButton>
        <CardContent
          sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <Avatar
            sx={{ width: 70, height: 70, bgcolor: '#007AFF' }}
            src={avatarPreview || undefined}
          >
            {!avatarPreview && profile.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {profile.full_name || profile.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{profile.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Typography variant="body2">
                Вес: <strong>{profile.weight || '—'} кг</strong>
              </Typography>
              <Typography variant="body2">
                Рост: <strong>{profile.height || '—'} см</strong>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Водный баланс */}
      <Card sx={{ borderRadius: '20px', border: '1px solid #C6C6C8', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WaterDropIcon sx={{ color: '#007AFF', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
              Водный баланс
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Сегодня
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {totalToday} / {profile.daily_water_goal} мл
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#E5E5EA',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#007AFF',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Последние тренировки */}
      <Card sx={{ borderRadius: '20px', border: '1px solid #C6C6C8' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FitnessCenterIcon sx={{ color: '#FF3B30', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
              Последние тренировки
            </Typography>
          </Box>

          {workouts.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 2, textAlign: 'center' }}
            >
              Нет тренировок
            </Typography>
          ) : (
            <>
              <List dense>
                {workouts.map((workout) => (
                  <ListItem
                    key={workout.id}
                    sx={{
                      px: 0,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {workout.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(workout.startTime)} -{' '}
                        {formatTime(workout.endTime)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {workout.exercises.length} упражнений •{' '}
                      {calculateDuration(workout.startTime, workout.endTime)}
                    </Typography>
                    {workout.notes && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, color: '#3C3C4399', fontSize: '13px' }}
                      >
                        {truncateNotes(workout.notes, 60)}
                      </Typography>
                    )}
                    <Divider sx={{ width: '100%', mt: 1 }} />
                  </ListItem>
                ))}
              </List>
              {workouts.length === 5 && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setAllWorkoutsDialogOpen(true)}
                  sx={{
                    mt: 2,
                    color: '#FF3B30',
                    borderColor: '#FF3B30',
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: '#FF3B30',
                      backgroundColor: 'rgba(255, 59, 48, 0.04)',
                    },
                  }}
                >
                  Показать все тренировки
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Диалог редактирования профиля */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
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
            p: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
            Редактировать профиль
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {/* Загрузка аватара */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#007AFF',
                  cursor: 'pointer',
                }}
                src={avatarPreview || undefined}
                onClick={() => fileInputRef.current?.click()}
              >
                {!avatarPreview && profile.username?.charAt(0).toUpperCase()}
              </Avatar>
              {uploadingAvatar && (
                <CircularProgress
                  size={80}
                  sx={{ position: 'absolute', top: 0, left: 0 }}
                />
              )}
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #C6C6C8',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoCameraIcon fontSize="small" sx={{ color: '#007AFF' }} />
              </IconButton>
            </Box>
          </Box>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleAvatarUpload}
          />

          <TextField
            fullWidth
            label="Вес (кг)"
            type="number"
            value={editWeight}
            onChange={(e) => setEditWeight(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Рост (см)"
            type="number"
            value={editHeight}
            onChange={(e) => setEditHeight(e.target.value)}
            size="small"
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            Норма воды будет пересчитана автоматически (30 мл на 1 кг веса)
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#8E8E93' }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            sx={{ bgcolor: '#007AFF' }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог всех тренировок */}
      <Dialog
        open={allWorkoutsDialogOpen}
        onClose={() => setAllWorkoutsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: '480px',
            margin: 2,
          },
        }}
      >
        <DialogTitle sx={{ p: 2, pb: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>
            Все тренировки
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2, overflowY: 'auto', maxHeight: '60vh' }}>
          {allWorkouts.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', py: 3 }}
            >
              Нет тренировок
            </Typography>
          ) : (
            allWorkouts.map((workout) => (
              <Paper
                key={workout.id}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: '14px',
                  border: '1px solid #C6C6C8',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {workout.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(workout.startTime)} -{' '}
                  {formatTime(workout.endTime)} •{' '}
                  {calculateDuration(workout.startTime, workout.endTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {workout.exercises.length} упражнений
                </Typography>
                {workout.notes && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: '#3C3C4399' }}
                  >
                    {workout.notes}
                  </Typography>
                )}
              </Paper>
            ))
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setAllWorkoutsDialogOpen(false)}
            sx={{ color: '#FF3B30' }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Home
