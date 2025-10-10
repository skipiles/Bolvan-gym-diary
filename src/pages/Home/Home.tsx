import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

const Home: React.FC = () => {
  // Хардкод данные (позже заменим на реальные)
  const waterData = {
    daily: { current: 1500, goal: 2000 }, // в мл
    weekly: { current: 8500, goal: 14000 },
  }

  const userProfile = {
    name: 'Пользователь',
    weight: 75, // кг
    dailyCalories: 2200,
  }

  const calculatePercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 3,
      }}
    >
      {/* Заголовок профиля */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: '#000000',
          mb: 3,
          fontSize: '22px',
        }}
      >
        Профиль
      </Typography>

      {/* Карточка пользователя */}
      <Card
        sx={{
          borderRadius: '14px',
          border: '1px solid #C6C6C8',
          backgroundColor: '#FFFFFF',
          marginBottom: 3,
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#000000',
              mb: 2,
            }}
          >
            {userProfile.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="#3C3C4399" fontSize="15px">
                Вес
              </Typography>
              <Typography variant="body1" fontWeight={600} fontSize="17px">
                {userProfile.weight} кг
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="#3C3C4399" fontSize="15px">
                Калории
              </Typography>
              <Typography variant="body1" fontWeight={600} fontSize="17px">
                {userProfile.dailyCalories} ккал/день
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Карточка водного баланса */}
      <Card
        sx={{
          borderRadius: '14px',
          border: '1px solid #C6C6C8',
          backgroundColor: '#FFFFFF',
          marginBottom: 3,
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WaterDropIcon
              sx={{
                color: '#007AFF', // Синий только для воды
                marginRight: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#000000',
              }}
            >
              Водный баланс
            </Typography>
          </Box>

          {/* Прогресс за день */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2" color="#3C3C4399" fontSize="15px">
                Сегодня
              </Typography>
              <Typography variant="body2" fontWeight={600} fontSize="15px">
                {waterData.daily.current} / {waterData.daily.goal} мл
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculatePercentage(
                waterData.daily.current,
                waterData.daily.goal
              )}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#E5E5EA',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#007AFF', // Синий для воды
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Прогресс за неделю */}
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2" color="#3C3C4399" fontSize="15px">
                За неделю
              </Typography>
              <Typography variant="body2" fontWeight={600} fontSize="15px">
                {waterData.weekly.current} / {waterData.weekly.goal} мл
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculatePercentage(
                waterData.weekly.current,
                waterData.weekly.goal
              )}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#E5E5EA',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#007AFF', // Синий для воды
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Карточка тренировок (нейтральные цвета) */}
      <Card
        sx={{
          borderRadius: '14px',
          border: '1px solid #C6C6C8',
          backgroundColor: '#FFFFFF',
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FitnessCenterIcon
              sx={{
                color: '#8E8E93', // Нейтральный серый для тренировок
                marginRight: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#000000',
              }}
            >
              Тренировки
            </Typography>
          </Box>

          <Typography variant="body2" color="#3C3C4399" fontSize="15px">
            Перейдите в раздел "Workout" чтобы начать тренировку
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Home
