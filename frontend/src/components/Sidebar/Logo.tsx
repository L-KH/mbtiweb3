import { TbPacman } from 'react-icons/tb'
import logo from '../assets/logo-bg.png'
import Image from "next/image";

export function Logo(props: any) {
  return (
    <div {...props}>
      <div className="mx-6 my-10 flex flex-shrink-0 flex-row items-center gap-1 ">
      <Image src={logo} className='h-10 w-10 text-secondary' />

        <div className="flex nav__brand">
          <h1 >PersonaChain</h1>
        </div>
      </div>
    </div>
  )
}
