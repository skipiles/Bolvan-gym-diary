import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { navigationItems } from '@app/providers/ConfigRoute'
// import { useSound } from '@shared/hooks/useSound'
import { useInstantSound } from '@/shared/hooks/useInstantSound'

interface Props {
  onItemClick?: () => void
}

const Navigation: React.FC<Props> = ({ onItemClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const playClickSound = useInstantSound(
    import.meta.env.BASE_URL + 'sounds/layout-click.mp3'
  )

  const handleItemClick = (path: string) => {
    if (location.pathname !== path) {
      playClickSound()
    }

    navigate(path)
    if (onItemClick) {
      onItemClick()
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: isMobile ? '100%' : '100vh',
        backgroundColor: '#F2F2F7',
        display: 'flex',
        flexDirection: 'column',
        borderRight: isMobile ? 'none' : '1px solid #C6C6C8',
      }}
    >
      {/* iOS-style Header */}
      <Box
        sx={{
          padding: '16px 20px',
          borderBottom: '1px solid #C6C6C8',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box
          sx={{
            fontSize: '17px',
            fontWeight: 600,
            color: '#000000',
            textAlign: 'center',
          }}
        >
          Bolvan Gym Diary
        </Box>
      </Box>

      {/* iOS-style Navigation List */}
      <List
        sx={{
          flex: 1,
          padding: '8px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {navigationItems.map((item) => {
          const isSelected = location.pathname === item.path

          return (
            <ListItem key={item.path} sx={{ padding: '2px' }}>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: isSelected
                    ? 'rgba(0, 122, 255, 0.1)'
                    : 'transparent',
                  color: isSelected ? '#007AFF' : '#000000',
                  '&:hover': {
                    backgroundColor: isSelected
                      ? 'rgba(0, 122, 255, 0.15)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  transition: 'all 0.2s ease',
                  minHeight: '44px',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '32px',
                    color: 'inherit',
                    fontSize: '20px',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '17px',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                />
                {isSelected && (
                  <Box
                    sx={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#007AFF',
                      marginLeft: 'auto',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export default Navigation
