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
import { useSound } from '@shared/hooks/useSound'

const predefinedAmounts = [250, 500, 700, 1000]

interface Props {
  onAddWater: (amount: number) => void
}

export const WaterControls: React.FC<Props> = ({ onAddWater }) => {
  const [customAmount, setCustomAmount] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Звук при нажатии на кнопку
  const playButtonSound = useSound('/sounds/water-click.mp3')

  const handlePredefinedAmount = (amount: number) => {
    playButtonSound()
    onAddWater(amount)
  }

  const handleCustomAmount = () => {
    playButtonSound()
    const amount = parseInt(customAmount)
    if (amount > 0) {
      onAddWater(amount)
      setCustomAmount('')
      setIsDialogOpen(false)
    }
  }

  const handleDialogOpen = () => {
    playButtonSound()
    setIsDialogOpen(true)
  }

  return (
    <Paper sx={{ p: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
              '&:hover': {
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0, 122, 255, 0.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              transition: 'all 0.1s ease',
            }}
          >
            {amount}ml
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handleDialogOpen}
        sx={{
          background: '#007AFF',
          '&:hover': { background: '#0056CC' },
          '&:active': {
            transform: 'scale(0.98)',
          },
          transition: 'all 0.1s ease',
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
            label="Количество (ml)"
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
