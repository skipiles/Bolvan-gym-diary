import React from 'react'
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useSound } from '@shared/hooks/useSound'

interface Props {
  current: number
  goal: number
  progress: number
  onReset: () => void
}

export const WaterProgress: React.FC<Props> = ({
  current,
  goal,
  progress,
  onReset,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const playSound = useSound(
    import.meta.env.BASE_URL + 'sounds/water-click.mp3'
  )

  const handleReset = () => {
    playSound()
    onReset()
    setIsDialogOpen(false)
  }

  return (
    <>
      <Box
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: '12px',
          border: '1px solid #C6C6C8',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            Прогресс за сегодня
          </Typography>
          <Button
            startIcon={<Delete />}
            onClick={() => setIsDialogOpen(true)}
            size="small"
            sx={{
              color: '#FF3B30',
              fontSize: '15px',
              '&:hover': {
                backgroundColor: 'rgba(255, 59, 48, 0.04)',
              },
            }}
          >
            Сбросить
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            {current}ml
          </Typography>
          <Typography variant="body2" color="text.secondary">
            из {goal}ml
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(progress, 100)}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: '#E5E5EA',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              backgroundColor: 'primary.main',
            },
          }}
        />

        <Typography
          variant="body2"
          sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}
        >
          {Math.round(progress)}% от дневной нормы
        </Typography>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '14px',
            maxWidth: '300px',
          },
        }}
      >
        <DialogTitle
          sx={{ textAlign: 'center', fontSize: '17px', fontWeight: 600 }}
        >
          Сбросить данные за сегодня?
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '15px',
              color: 'text.secondary',
            }}
          >
            Это действие удалит все записи о выпитой воде за сегодняшний день.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1 }}>
          <Button
            onClick={handleReset}
            color="error"
            fullWidth
            sx={{
              color: '#FF3B30',
              fontSize: '17px',
              fontWeight: 600,
            }}
          >
            Сбросить
          </Button>
          <Button
            onClick={() => setIsDialogOpen(false)}
            fullWidth
            sx={{
              fontSize: '17px',
              fontWeight: 600,
            }}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
