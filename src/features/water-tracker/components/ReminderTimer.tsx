import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Slider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { NotificationsActive, Schedule } from '@mui/icons-material'
import { useSound } from '@shared/hooks/useSound'

interface Props {
  interval: number
  soundEnabled: boolean
  timeLeft: number
  isTimerActive: boolean
  isReminderActive: boolean
  onIntervalChange: (interval: number) => void
  onSoundToggle: (enabled: boolean) => void
  onStopReminder: () => void
  onStartTimer: () => void
  onAddWater: (amount: number) => void
}

// Доступные значения интервала
const intervalOptions = [1, 15, 30, 45, 60, 75, 90, 105, 120]

export const ReminderTimer: React.FC<Props> = ({
  interval,
  soundEnabled,
  timeLeft,
  isTimerActive,
  isReminderActive,
  onIntervalChange,
  onSoundToggle,
  onStopReminder,
  onStartTimer,
  onAddWater,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const playSound = useSound('/sounds/water-click.mp3')

  // Функция для форматирования интервала в читаемый вид
  const formatIntervalLabel = (minutes: number) => {
    if (minutes === 1) return '1 мин'

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours} час${hours > 1 ? 'а' : ''}`
    return `${hours} ч ${remainingMinutes} м`
  }

  // Воспроизведение звука при активном напоминании
  useEffect(() => {
    if (isReminderActive && soundEnabled) {
      const audio = new Audio('/sounds/rampage-song.mp3')
      audio.loop = true
      audio.volume = 0.7

      audio.play().catch((error) => {
        console.error('Ошибка воспроизведения звука напоминания:', error)
      })

      return () => {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [isReminderActive, soundEnabled])

  // Браузерные уведомления
  useEffect(() => {
    if (isReminderActive && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('💧 Пора пить воду!', {
          body: 'Нажмите на уведомление, чтобы остановить напоминание',
          icon: '/favicon.ico',
          requireInteraction: true,
        })
      } else if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [isReminderActive])

  const handleAddWaterAndStop = (amount: number) => {
    playSound()
    onAddWater(amount)
    onStopReminder()
    setTimeout(() => {
      onStartTimer()
    }, 100)
    setIsDialogOpen(false)
  }

  const handleSnooze = () => {
    playSound()
    onStopReminder()
    setTimeout(() => {
      onStartTimer()
    }, 100)
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00'
    }

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  // Режим активного напоминания (будильник)
  if (isReminderActive) {
    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
          color: 'white',
          animation: 'pulse 2s infinite',
          borderRadius: { xs: 2, md: 3 },
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.02)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <NotificationsActive
            sx={{
              fontSize: { xs: 36, sm: 48 },
              mb: 2,
            }}
          />
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            💧 Пора пить воду!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Время пить воду! Добавьте выпитое количество.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Button
              variant="contained"
              onClick={() => handleAddWaterAndStop(250)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Выпил 250ml
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsDialogOpen(true)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Другое количество
            </Button>
            <Button
              variant="outlined"
              onClick={handleSnooze}
              sx={{
                color: 'white',
                borderColor: 'white',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Отложить на 5 мин
            </Button>
          </Box>
        </Box>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          fullScreen={isMobile}
        >
          <DialogTitle>Сколько воды вы выпили?</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mt: 2,
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              {[100, 250, 500, 750, 1000].map((amount) => (
                <Button
                  key={amount}
                  variant="outlined"
                  onClick={() => handleAddWaterAndStop(amount)}
                  sx={{
                    minWidth: { xs: '45%', sm: 'auto' },
                    flex: { xs: '1 1 45%', sm: 'none' },
                  }}
                >
                  {amount}ml
                </Button>
              ))}
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Button onClick={() => setIsDialogOpen(false)} fullWidth={isMobile}>
              Отмена
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    )
  }

  // Режим обычного таймера
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 2, md: 3 },
        height: 'fit-content',
      }}
    >
      <Typography
        variant={isMobile ? 'subtitle1' : 'h6'}
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        Напоминание пить воду
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          Интервал: {formatIntervalLabel(interval)}
        </Typography>
        <Slider
          value={interval}
          onChange={(_, value) => onIntervalChange(value as number)}
          min={1}
          max={120}
          step={null}
          marks={intervalOptions.map((option) => ({
            value: option,
            // label: formatIntervalLabel(option),
          }))}
          valueLabelDisplay="auto"
          valueLabelFormat={formatIntervalLabel}
        />
      </Box>

      <FormControlLabel
        control={
          <Switch
            sx={{
              ml: 2,
            }}
            checked={soundEnabled}
            onChange={(e) => onSoundToggle(e.target.checked)}
          />
        }
        label={
          <Typography sx={{ ml: 1 }} variant="body2">
            Звуковые уведомления
          </Typography>
        }
      />

      <Box
        sx={{
          textAlign: 'center',
          p: 2,
          bgcolor: 'rgba(0, 122, 255, 0.1)',
          borderRadius: 2,
          mt: 2,
        }}
      >
        <Schedule
          sx={{
            fontSize: { xs: 28, sm: 32 },
            color: 'primary.main',
            mb: 1,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Следующее напоминание через
        </Typography>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{ color: 'primary.main', fontWeight: 700 }}
        >
          {formatTime(timeLeft)}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {isTimerActive ? 'Таймер активен' : 'Таймер остановлен'}
        </Typography>
      </Box>
    </Paper>
  )
}

export default ReminderTimer
