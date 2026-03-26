import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close, Search } from '@mui/icons-material'
import { exercises, type Exercise, muscleGroups } from '../data/exercises'

interface ExerciseSelectorProps {
  open: boolean
  onClose: () => void
  onSelectExercise: (exercise: Exercise) => void
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  open,
  onClose,
  onSelectExercise,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null)

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesGroup = selectedGroup ? ex.muscleGroup === selectedGroup : true
    return matchesSearch && matchesGroup
  })

  const muscleGroupList = Object.entries(muscleGroups)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          backgroundColor: '#FFFFFF',
          maxHeight: isMobile ? '70vh' : '60vh',
          minHeight: isMobile ? '50vh' : '400px',
          width: 'auto',
          maxWidth: '90vw',
          margin: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: isMobile ? 1.5 : 2,
          borderBottom: '1px solid #C6C6C8',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: isMobile ? '16px' : '18px' }}
        >
          Выбрать упражнение
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#007AFF' }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#E5E5EA',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#FF3B30',
            borderRadius: '4px',
          },
        }}
      >
        {/* Поиск */}
        <Box sx={{ p: isMobile ? 1.5 : 2, borderBottom: '1px solid #C6C6C8' }}>
          <TextField
            fullWidth
            placeholder="Поиск упражнений"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: '#8E8E93',
                      fontSize: isMobile ? '18px' : '20px',
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: '#F2F2F7',
                '& fieldset': { border: 'none' },
                '& input': {
                  fontSize: isMobile ? '14px' : '16px',
                  padding: isMobile ? '8px 0' : '10px 0',
                },
              },
            }}
          />
        </Box>

        {/* Группы мышц - горизонтальный скролл */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            p: isMobile ? 1.5 : 2,
            overflowX: 'auto',
            borderBottom: '1px solid #C6C6C8',
            '&::-webkit-scrollbar': {
              height: '2px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#E5E5EA',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#FF3B30',
              borderRadius: '2px',
            },
          }}
        >
          <Typography
            onClick={() => setSelectedGroup(null)}
            sx={{
              px: isMobile ? 1.5 : 2,
              py: isMobile ? 0.75 : 1,
              borderRadius: '20px',
              backgroundColor: selectedGroup === null ? '#FF3B30' : '#E5E5EA',
              color: selectedGroup === null ? '#FFFFFF' : '#000000',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: selectedGroup === null ? '#D63027' : '#D1D1D6',
              },
            }}
          >
            Все
          </Typography>
          {muscleGroupList.map(([key, name]) => (
            <Typography
              key={key}
              onClick={() => setSelectedGroup(key)}
              sx={{
                px: isMobile ? 1.5 : 2,
                py: isMobile ? 0.75 : 1,
                borderRadius: '20px',
                backgroundColor: selectedGroup === key ? '#FF3B30' : '#E5E5EA',
                color: selectedGroup === key ? '#FFFFFF' : '#000000',
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor:
                    selectedGroup === key ? '#D63027' : '#D1D1D6',
                },
              }}
            >
              {name}
            </Typography>
          ))}
        </Box>

        {/* Список упражнений */}
        <List sx={{ bgcolor: '#FFFFFF', p: 0 }}>
          {filteredExercises.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Упражнения не найдены
              </Typography>
            </Box>
          ) : (
            filteredExercises.map((exercise, index) => (
              <React.Fragment key={exercise.id}>
                <ListItemButton
                  onClick={() => {
                    onSelectExercise(exercise)
                    onClose()
                  }}
                  sx={{
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 1.5 : 2,
                    '&:active': {
                      backgroundColor: 'rgba(255, 59, 48, 0.1)',
                    },
                  }}
                >
                  <ListItemText
                    primary={exercise.name}
                    secondary={
                      muscleGroups[
                        exercise.muscleGroup as keyof typeof muscleGroups
                      ]
                    }
                    primaryTypographyProps={{
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{
                      fontSize: isMobile ? '11px' : '12px',
                      color: '#8E8E93',
                    }}
                  />
                </ListItemButton>
                {index < filteredExercises.length - 1 && (
                  <Divider sx={{ ml: 2 }} />
                )}
              </React.Fragment>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  )
}
