import React, { useState } from 'react'
import { Box, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { Outlet } from 'react-router-dom'
import Navigation from './Layout/Navigation/Navigation'

export const AppLayout: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Navigation
      onItemClick={isMobile ? () => setMobileOpen(false) : undefined}
    />
  )

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F2F2F7',
      }}
    >
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              backgroundColor: '#F2F2F7',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
          }}
        >
          {drawer}
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - 280px)` },
          ml: { md: '0px' },
          minHeight: '100vh',
          backgroundColor: '#F2F2F7',
        }}
      >
        {/* iOS-style Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mb: 2,
              color: '#000000',
              backgroundColor: '#FFFFFF',
              border: '1px solid #C6C6C8',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: '#F2F2F7',
              },
            }}
          >
            <Menu />
          </IconButton>
        )}

        <Outlet />
      </Box>
    </Box>
  )
}

export default AppLayout
