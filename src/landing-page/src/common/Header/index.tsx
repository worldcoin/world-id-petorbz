import { memo, ReactNode } from 'react'
import cn from 'classnames'
import { Icon } from '../Icon';

export const Header = memo(function Header(props: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn(
      "grid place-items-center md:place-items-start",
      props.className
    )}>
      <Icon className="w-[150px] h-8 text-ffffff" name="logo"/>
      {props.children}
    </div>
  )
})