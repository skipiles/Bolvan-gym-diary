import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'
import { ru } from 'date-fns/locale'

interface WorkoutCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  hasWorkoutOnDate: (date: Date) => boolean
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  selectedDate,
  onSelectDate,
  hasWorkoutOnDate,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate)

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <Paper
      sx={{
        p: isMobile ? 1.5 : 2,
        borderRadius: '16px',
        border: '1px solid #C6C6C8',
        backgroundColor: '#FFFFFF',
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
        <IconButton
          onClick={handlePrevMonth}
          size={isMobile ? 'small' : 'medium'}
        >
          <ChevronLeft />
        </IconButton>
        <Typography
          variant={isMobile ? 'subtitle1' : 'h6'}
          sx={{ fontWeight: 600 }}
        >
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </Typography>
        <IconButton
          onClick={handleNextMonth}
          size={isMobile ? 'small' : 'medium'}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Дни недели */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: isMobile ? 0.5 : 1,
          mb: 1,
        }}
      >
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant={isMobile ? 'caption' : 'body2'}
            sx={{ textAlign: 'center', fontWeight: 500, color: '#8E8E93' }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Дни месяца */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: isMobile ? 0.5 : 1,
        }}
      >
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const hasWorkout = hasWorkoutOnDate(day)

          return (
            <Box
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1 / 1',
                borderRadius: '10px',
                backgroundColor: isSelected ? '#FF3B30' : 'transparent',
                color: isSelected
                  ? '#FFFFFF'
                  : isCurrentMonth
                    ? '#000000'
                    : '#8E8E93',
                fontWeight: isToday(day) ? 700 : 400,
                position: 'relative',
                transition: 'all 0.2s ease',
                fontSize: isMobile ? '13px' : '14px',
                '&:hover': {
                  backgroundColor: isSelected
                    ? '#FF3B30'
                    : 'rgba(255, 59, 48, 0.1)',
                },
              }}
            >
              {format(day, 'd')}
              {hasWorkout && !isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: isMobile ? 2 : 4,
                    width: isMobile ? 3 : 4,
                    height: isMobile ? 3 : 4,
                    borderRadius: '50%',
                    backgroundColor: '#FF3B30',
                  }}
                />
              )}
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}
