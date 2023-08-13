import {
  BookOpenIcon,
  CalendarIcon,
  CogIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UserGroupIcon,
  TemplateIcon ,
} from '@heroicons/react/outline'
import {
  TbBrandGithub,
  TbBrandTwitter,
  TbBrandDiscord,
  TbBrandMedium,
} from 'react-icons/tb'
import {
  LightningBoltIcon,
  UsersIcon,
} from '@heroicons/react/outline';

interface INavigation {
  name: string
  href: string
  icon?: any
  current?: boolean
  checkActive?(pathname: String, route: INavigation): boolean
  exact?: boolean
}

interface IBottomNavigation {
  name: string
  href: string
  icon?: any
}

interface IBottomIcons {
  name: string
  href: string
  icon?: any
}

interface IBottomDisclaimer {
  name: string
  href: string
}

export function routeIsActive(pathname: String, route: INavigation): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route)
  }

  return route?.exact
    ? pathname == route?.href
    : route?.href
    ? pathname.indexOf(route.href) === 0
    : false
}

const navigation: INavigation[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true, exact: true },
  // {
  //   name: 'Theme Preview',
  //   href: '/themePreview',
  //   icon: UsersIcon,
  //   current: false,
  // },
  { name: 'Mint Your Identity', href: '/MintYourIdentity', icon: LightningBoltIcon, current: false },
  { name: 'Community Wall', href: '/CommunityWall', icon: UsersIcon, current: false },
  {
    name: 'Cover/Image Suggestions',
    href: '/Gallery',
    icon: TemplateIcon,
    current: false,
  },
  { name: 'Twitter Callback', href: '/TwitterCallback', current: false }


]

const bottomNavigation: IBottomNavigation[] = [
  // { name: 'Docs', href: '#', icon: BookOpenIcon },
  // { name: 'Settings', href: '#', icon: CogIcon },
  { name: 'Meme Competition', href: '/MemeCompetition', icon: UserGroupIcon },
  { name: 'Special Edition NFTs', href: '/MemeCompetition', icon: FolderIcon },
]

const bottomIcons: IBottomIcons[] = [
  {
    name: 'GitHub',
    href: '#',
    icon: TbBrandGithub,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/PersonaChains',
    icon: TbBrandTwitter,
  },
  {
    name: 'Discord',
    href: '#',
    icon: TbBrandDiscord,
  },
  {
    name: 'Medium',
    href: '#',
    icon: TbBrandMedium,
  },
]

const bottomDisclaimer: IBottomDisclaimer[] = [
  // { name: 'About', href: '#' },
  // { name: 'Privacy', href: '#' },
  // { name: 'Terms', href: '#' },
]

export function updateCurrentItem(route: INavigation) {
  navigation.map((item) => (item.current = false))
  route.current = true
}

export type { INavigation, IBottomNavigation }
export { bottomNavigation, bottomIcons, bottomDisclaimer }
export default navigation
