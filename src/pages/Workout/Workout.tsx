import React from 'react'
import { Typography, Paper, Box } from '@mui/material'

export const Workout: React.FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          padding: '32px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
          minHeight: '400px',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: '#000' }}
        >
          Упражнения
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 3 }}>
          Здесь будет трекер упражнений и весов
        </Typography>

        {/* Пример контента */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          }}
        >
          {['Приседания', 'Жим лежа', 'Становая тяга', 'Подтягивания'].map(
            (exercise) => (
              <Paper
                key={exercise}
                sx={{
                  padding: '16px',
                  background: 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {exercise}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(0, 0, 0, 0.5)' }}
                >
                  Последний вес: 1000kg
                </Typography>
              </Paper>
            )
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default Workout
