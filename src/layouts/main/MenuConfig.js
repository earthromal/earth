import { Icon } from '@iconify/react'
import homeFill from '@iconify/icons-eva/home-fill'
import fileFill from '@iconify/icons-eva/file-fill'

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
}

const menuConfig = [
  {
    title: 'Home',
    path: '/',
    icon: <Icon icon={homeFill} {...ICON_SIZE} />,
  },
  {
    title: 'Products',
    path: '/products',
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
  },
  {
    title: 'Marketing Plan',
    path: '/marketing-plan',
    icon: <Icon icon={fileFill} {...ICON_SIZE} />,
  },
]

export default menuConfig
