import { TbPacman } from 'react-icons/tb'

export function Logo(props: any) {
  return (
    <div {...props}>
      <div className="mx-6 my-10 flex flex-shrink-0 flex-row items-center gap-1 ">
        <div className="flex">
          <TbPacman className="h-14 w-14 text-secondary"></TbPacman>
        </div>
        <div className="flex nav__brand">
          <h1 >PersonaChain</h1>
        </div>
      </div>
    </div>
  )
}
