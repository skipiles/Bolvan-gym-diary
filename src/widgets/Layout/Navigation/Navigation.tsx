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
  Button,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { navigationItems } from '@app/providers/ConfigRoute'
import { useInstantSound } from '@/shared/hooks/useInstantSound'
import { useAuth } from '@/hooks/useAuth'
import { Logout } from '@mui/icons-material'

interface Props {
  onItemClick?: () => void
}

const Navigation: React.FC<Props> = ({ onItemClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const playClickSound = useInstantSound(
    import.meta.env.BASE_URL + 'sounds/layout-click.mp3',
  )
  const { signOut } = useAuth()

  const handleItemClick = (path: string) => {
    playClickSound()
    navigate(path)
    if (onItemClick) {
      onItemClick()
    }
  }

  const handleLogout = async () => {
    playClickSound()
    await signOut()
    navigate('/login')
  }

  const getIsSelected = (itemPath: string) => {
    if (itemPath === '/') {
      return location.pathname === '/'
    }
    return location.pathname === itemPath
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
          const isSelected = getIsSelected(item.path)
          const activeColor = item.activeColor || '#8E8E93'

          return (
            <ListItem key={item.path} sx={{ padding: '2px' }}>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: isSelected
                    ? `${activeColor}10`
                    : 'transparent',
                  color: isSelected ? activeColor : '#000000',
                  '&:hover': {
                    backgroundColor: isSelected
                      ? `${activeColor}15`
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
                      backgroundColor: activeColor,
                      marginLeft: 'auto',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Кнопка выхода */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #C6C6C8',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            borderRadius: '10px',
            borderColor: '#FF3B30',
            color: '#FF3B30',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            py: 1,
            '&:hover': {
              borderColor: '#FF3B30',
              backgroundColor: 'rgba(255, 59, 48, 0.04)',
            },
          }}
        >
          Выйти
        </Button>
      </Box>
    </Box>
  )
}

export default Navigation
