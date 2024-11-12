import { Icon } from '@iconify/react'
import { useRef, useState } from 'react'
import homeFill from '@iconify/icons-eva/home-fill'
import personFill from '@iconify/icons-eva/person-fill'
import settings2Fill from '@iconify/icons-eva/settings-2-fill'
// next
import NextLink from 'next/link'
// material
import { alpha } from '@mui/material/styles'
import {
  Box,
  Avatar,
  Button,
  Divider,
  MenuItem,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
// components
import MenuPopover from '../../components/MenuPopover'
import { MIconButton } from '../../components/@material-extend'
import { useRouter } from 'next/router'
import SendMoneyPopup from '@/components/popup/SendMoneyPopup'
import WithdrawPopup from '@/components/popup/WithdrawPopup'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  { label: 'Home', icon: homeFill, linkTo: '/' },
  { label: 'Profile', icon: personFill, linkTo: '#' },
  { label: 'Settings', icon: settings2Fill, linkTo: '#' },
]

// ----------------------------------------------------------------------

export default function AccountPopover({ user }) {
  const [sendMoneyPopup, setSendMoneyPopup] = useState(false)
  const [withdrawMoneyPopup, setWithdrawMoneyPopup] = useState(false)
  const router = useRouter()
  const anchorRef = useRef(null)
  const [copy, setCopy] = useState(false)

  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleCopyReferenceCode = () => {
    navigator.clipboard.writeText(user.myReference)
    setCopy(true)
  }

  const handleLogOut = () => {
    localStorage.removeItem('earth_user')
    router.push('/')
  }

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: theme => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar alt="My Avatar" src={user?.avatarUrl} />
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box
          sx={{ my: 1.5, px: 2.5, display: 'flex', flexDirection: 'column' }}
        >
          <Typography variant="subtitle1" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Balance: <strong>৳ {user.balance}</strong>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              My Reference: <strong>{user.myReference}</strong>
            </Typography>
            <Tooltip title={copy ? 'Coppied' : 'Copy Reference Code'}>
              <IconButton
                onClick={handleCopyReferenceCode}
                size="small"
                sx={{ marginLeft: 1 }}
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{ p: 2, pt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Button
            onClick={() => {
              setSendMoneyPopup(true)
              setOpen(false)
            }}
            sx={{ whiteSpace: 'nowrap' }}
            size="small"
            fullWidth
            color="primary"
            variant="contained"
          >
            Send Money
          </Button>
          <Button
            onClick={() => {
              setWithdrawMoneyPopup(true)
              setOpen(false)
            }}
            size="small"
            fullWidth
            color="primary"
            variant="contained"
          >
            Withdraw
          </Button>
        </Box>

        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => router.push('/my-account')}
            sx={{ mb: 1 }}
            fullWidth
            color="primary"
            variant="outlined"
          >
            Go to account
          </Button>
          <Button
            onClick={handleLogOut}
            fullWidth
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>

      {sendMoneyPopup && (
        <SendMoneyPopup open={sendMoneyPopup} setOpen={setSendMoneyPopup} />
      )}

      {withdrawMoneyPopup && (
        <WithdrawPopup
          open={withdrawMoneyPopup}
          setOpen={setWithdrawMoneyPopup}
        />
      )}
    </>
  )
}
