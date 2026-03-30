import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useInstantSound } from '@/shared/hooks/useInstantSound'

const predefinedAmounts = [250, 500, 700, 1000]

interface Props {
  onAddWater: (amount: number) => void
}

export const WaterControls: React.FC<Props> = ({ onAddWater }) => {
  const [customAmount, setCustomAmount] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const playSound = useInstantSound(
    import.meta.env.BASE_URL + 'sounds/gta5menu.mp3',
  )

  const handlePredefinedAmount = (amount: number) => {
    console.log('🔘 Нажата кнопка добавления воды:', amount)
    playSound()
    onAddWater(amount)
  }

  const handleCustomAmount = () => {
    playSound()
    const amount = parseInt(customAmount)
    if (amount > 0) {
      onAddWater(amount)
      setCustomAmount('')
      setIsDialogOpen(false)
    }
  }

  return (
    <Paper
      sx={{
        p: 3,
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #C6C6C8',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600, color: '#000000' }}
      >
        Добавить воду
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1,
          mb: 2,
        }}
      >
        {predefinedAmounts.map((amount) => (
          <Button
            key={amount}
            variant="outlined"
            onClick={() => handlePredefinedAmount(amount)}
            sx={{
              borderColor: 'rgba(0, 122, 255, 0.3)',
              color: '#007AFF',
              borderRadius: '10px',
              '&:hover': {
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0, 122, 255, 0.05)',
              },
            }}
          >
            {amount} мл
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={() => setIsDialogOpen(true)}
        sx={{
          background: '#007AFF',
          borderRadius: '10px',
          textTransform: 'none',
          '&:hover': { background: '#0056CC' },
        }}
      >
        Другое количество
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Введите количество воды</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            type="number"
            label="Количество (мл)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleCustomAmount} disabled={!customAmount}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
