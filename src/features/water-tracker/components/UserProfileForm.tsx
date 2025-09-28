import React, { useState } from 'react'
import { TextField, Button, Typography, Paper } from '@mui/material'

interface Props {
  onProfileSet: (weight: number) => void
}

export const UserProfileForm: React.FC<Props> = ({ onProfileSet }) => {
  const [weight, setWeight] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const weightNum = parseFloat(weight)
    if (weightNum > 0 && weightNum < 300) {
      onProfileSet(weightNum)
    }
  }

  const calculatedGoal = weight ? Math.round(parseFloat(weight) * 30) : 0

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        background: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Настройка профиля
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Рассчитаем вашу суточную норму воды (30 мл на 1 кг веса)
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="number"
          label="Ваш вес (кг)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          inputProps={{ min: 1, max: 300, step: 0.1 }}
          sx={{ mb: 2 }}
          required
        />

        {weight && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ваша суточная норма: {calculatedGoal} мл
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ background: '#007AFF', '&:hover': { background: '#0056CC' } }}
        >
          Сохранить
        </Button>
      </form>
    </Paper>
  )
}
