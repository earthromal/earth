import React from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import { Button, TextField, Typography } from '@mui/material'
import { ButtonAnimate } from '../animate'
import { sendMoney, withdrawMoney } from '@/func/functions'
import toast from 'react-hot-toast'

const WithdrawPopup = ({ setOpen }) => {
  const [input, setInput] = React.useState({ sendTo: '', amount: '' })
  const handleChange = e => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const user =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('earth_user')
      : false
  const parsedUser = user ? JSON.parse(user) : false

  const handleWithdraw = async () => {
    if (!parsedUser) {
      return toast.error('You need to login first')
    }
    if (parsedUser.balance < input.amount) {
      return toast.error('You do not have enough balance')
    }
    if (input.amount < 0) {
      return toast.error('You cannot withdraw negative amount')
    }
    if (input.amount < 500) {
      return toast.error('You cannot withdraw less than 500')
    }
    if (!input.amount) {
      return toast.error('Please input amount')
    }

    const send = await withdrawMoney(parsedUser.myReference, input.amount)
    if (send) {
      toast.success('Money Withdraw successfully')
      window.location.reload()
    } else {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="popup_wrapper">
      <div className="popup_content relative">
        <ClearIcon
          onClick={() => setOpen(false)}
          className="absolute right-0 top-0 mr-4 mt-4 h-4 w-4 cursor-pointer"
        />
        <div className="mt-4">
          <Typography variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
            Withdraw Money
          </Typography>

          {/* marque tag */}
          <marquee>
            <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              Withdraw money will not charge any service charge.
            </Typography>
          </marquee>

          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            variant="outlined"
            onChange={handleChange}
          />

          <ButtonAnimate>
            <Button
              fullWidth
              size="large"
              onClick={handleWithdraw}
              variant="contained"
              sx={{ mt: 2, px: 4 }}
            >
              Withdraw Money
            </Button>
          </ButtonAnimate>
        </div>
      </div>
    </div>
  )
}

export default WithdrawPopup
