import React from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useWaterTracker } from '@features/water-tracker/hooks/useWaterTracker'
import { UserProfileForm } from '@features/water-tracker/components/UserProfileForm'
import { WaterProgress } from '@features/water-tracker/components/WaterProgress'
import { WaterControls } from '@features/water-tracker/components/WaterControls'
import { ReminderTimer } from '@features/water-tracker/components/ReminderTimer'

export const Water: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {
    profile,
    totalToday,
    progress,
    settings,
    isTimerActive,
    timeLeft,
    isReminderActive,
    setProfile,
    addWater,
    resetTodayWater,
    updateSettings,
    stopReminder,
    startTimer,
  } = useWaterTracker()

  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (!profile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <UserProfileForm onProfileSet={setProfile} />
      </Box>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 1, sm: 2 },
        px: { xs: 1, sm: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        gutterBottom
        sx={{
          fontWeight: 700,
          color: '#000',
          mb: { xs: 2, md: 3 },
          textAlign: 'center',
        }}
      >
        Трекер воды
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '900px',
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
        }}
      >
        {/* Левая колонка - Прогресс и управление */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, md: 3 },
          }}
        >
          <WaterProgress
            current={totalToday}
            goal={profile.dailyGoal}
            progress={progress}
            onReset={resetTodayWater}
          />

          <WaterControls onAddWater={addWater} />
        </Box>

        {/* Правая колонка - Таймер */}
        <Box>
          <ReminderTimer
            interval={settings.reminderInterval}
            soundEnabled={settings.soundEnabled}
            timeLeft={timeLeft}
            isTimerActive={isTimerActive}
            isReminderActive={isReminderActive}
            onIntervalChange={(interval) =>
              updateSettings({ reminderInterval: interval })
            }
            onSoundToggle={(enabled) =>
              updateSettings({ soundEnabled: enabled })
            }
            onStopReminder={stopReminder}
            onStartTimer={startTimer}
            onAddWater={addWater}
          />
        </Box>
      </Box>

      {/* История за сегодня */}
      <Paper
        sx={{
          p: { xs: 2, md: 2 },
          mt: { xs: 2, md: 3 },
          background: 'rgba(255, 255, 255, 0.9)',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        <Typography
          variant={isMobile ? 'subtitle1' : 'h6'}
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          История за сегодня
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalToday === 0
            ? 'Сегодня еще не было записей'
            : `Всего выпито: ${totalToday}ml`}
        </Typography>
      </Paper>
    </Container>
  )
}

export default Water
