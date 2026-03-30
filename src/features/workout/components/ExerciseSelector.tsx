import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Close, Search } from '@mui/icons-material'
import { exercises, type Exercise, muscleGroups } from '../data/exercises'

interface ExerciseSelectorProps {
  open: boolean
  onClose: () => void
  onSelectExercise: (exercise: Exercise) => void
}

const CUSTOM_EXERCISES_KEY = 'customExercises'

// Стили для красных акцентов
const redTextFieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#C6C6C8',
    },
    '&:hover fieldset': {
      borderColor: '#FF3B30',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF3B30',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#8E8E93',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF3B30',
  },
}

const redSelectSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#C6C6C8',
    },
    '&:hover fieldset': {
      borderColor: '#FF3B30',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF3B30',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#8E8E93',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF3B30',
  },
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
  const [customExercises, setCustomExercises] = React.useState<Exercise[]>([])
  const [showCustomDialog, setShowCustomDialog] = React.useState(false)
  const [newExerciseName, setNewExerciseName] = React.useState('')
  const [newExerciseGroup, setNewExerciseGroup] = React.useState<string>('core')

  React.useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_EXERCISES_KEY)
    if (saved) {
      setCustomExercises(JSON.parse(saved))
    }
  }, [])

  const saveCustomExercise = (exercise: Exercise) => {
    const updated = [...customExercises, exercise]
    setCustomExercises(updated)
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(updated))
  }

  const handleAddCustomExercise = () => {
    if (newExerciseName.trim()) {
      const newExercise: Exercise = {
        id: `custom-${Date.now()}`,
        name: newExerciseName.trim(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        muscleGroup: newExerciseGroup as any,
      }
      saveCustomExercise(newExercise)
      onSelectExercise(newExercise)
      setShowCustomDialog(false)
      setNewExerciseName('')
      setNewExerciseGroup('core')
      onClose()
    }
  }

  const allExercises = [...exercises, ...customExercises]

  const filteredExercises = allExercises.filter((ex) => {
    const matchesSearch = ex.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesGroup = selectedGroup ? ex.muscleGroup === selectedGroup : true
    return matchesSearch && matchesGroup
  })

  const muscleGroupList = Object.entries(muscleGroups)

  return (
    <>
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
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '16px' : '18px',
              color: '#000',
            }}
          >
            Выбрать упражнение
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: '#FF3B30' }}>
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
          <Box
            sx={{ p: isMobile ? 1.5 : 2, borderBottom: '1px solid #C6C6C8' }}
          >
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
                  backgroundColor:
                    selectedGroup === null ? '#D63027' : '#D1D1D6',
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
                  backgroundColor:
                    selectedGroup === key ? '#FF3B30' : '#E5E5EA',
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

          <List sx={{ bgcolor: '#FFFFFF', p: 0 }}>
            <ListItemButton
              onClick={() => setShowCustomDialog(true)}
              sx={{
                py: isMobile ? 1 : 1.5,
                px: isMobile ? 1.5 : 2,
                borderBottom: '1px solid #E5E5EA',
                '&:active': {
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                },
              }}
            >
              <ListItemText
                primary="➕ Своё упражнение"
                primaryTypographyProps={{
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: 500,
                  color: '#FF3B30',
                }}
              />
            </ListItemButton>

            {filteredExercises.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Упражнения не найдены
                </Typography>
              </Box>
            ) : (
              filteredExercises.map((exercise, index) => {
                const isCustom = exercise.id.startsWith('custom-')
                return (
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
                          isCustom
                            ? 'Своё упражнение'
                            : muscleGroups[
                                exercise.muscleGroup as keyof typeof muscleGroups
                              ]
                        }
                        primaryTypographyProps={{
                          fontSize: isMobile ? '15px' : '16px',
                          fontWeight: 500,
                          color: '#000',
                        }}
                        secondaryTypographyProps={{
                          fontSize: isMobile ? '11px' : '12px',
                          color: isCustom ? '#FF3B30' : '#8E8E93',
                        }}
                      />
                    </ListItemButton>
                    {index < filteredExercises.length - 1 && (
                      <Divider sx={{ ml: 2 }} />
                    )}
                  </React.Fragment>
                )
              })
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* Компактная модалка добавления своего упражнения с красными акцентами */}
      <Dialog
        open={showCustomDialog}
        onClose={() => setShowCustomDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: '400px',
            margin: 2,
          },
        }}
      >
        <DialogTitle sx={{ p: 2, pb: 0, fontWeight: 600, color: '#000' }}>
          Добавить упражнение
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Название упражнения"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            size="small"
            sx={{ mb: 2, ...redTextFieldSx }}
          />
          <FormControl fullWidth size="small" sx={redSelectSx}>
            <InputLabel>Группа мышц</InputLabel>
            <Select
              value={newExerciseGroup}
              onChange={(e) => setNewExerciseGroup(e.target.value)}
              label="Группа мышц"
            >
              {muscleGroupList.map(([key, name]) => (
                <MenuItem key={key} value={key}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setShowCustomDialog(false)}
            sx={{ color: '#8E8E93' }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleAddCustomExercise}
            variant="contained"
            disabled={!newExerciseName.trim()}
            sx={{ bgcolor: '#FF3B30', '&:hover': { bgcolor: '#D63027' } }}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
