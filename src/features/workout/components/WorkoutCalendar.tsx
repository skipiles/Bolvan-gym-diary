import React from 'react'
import { Box, Typography, IconButton, Paper } from '@mui/material'
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
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate)

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Вычислим пустые ячейки в начале месяца (смещение)
  const firstDayOfMonth = startOfMonth(currentMonth)
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7 // Пн=0, Вс=6

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: '12px',
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
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Дни недели */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
          mb: 1,
        }}
      >
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant="caption"
            sx={{ textAlign: 'center', fontWeight: 500 }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Календарная сетка */}
      <Box
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}
      >
        {/* Пустые ячейки для выравнивания */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <Box key={`empty-${i}`} sx={{ p: 1 }} />
        ))}

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
                p: 1,
                borderRadius: '10px',
                backgroundColor: isSelected ? '#FF3B30' : 'transparent',
                color: isSelected
                  ? '#FFFFFF'
                  : isCurrentMonth
                    ? '#000000'
                    : '#8E8E93',
                fontWeight: isToday(day) ? 700 : 400,
                position: 'relative',
                '&:hover': {
                  backgroundColor: isSelected
                    ? '#FF3B30'
                    : 'rgba(0, 122, 255, 0.1)',
                },
              }}
            >
              {format(day, 'd')}
              {hasWorkout && !isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    width: 4,
                    height: 4,
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
