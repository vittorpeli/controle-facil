import { UserRound } from "lucide-react"

export interface UserIconProps {
    name: string
    membershipStatus: string
}

export function UserIcon({name, membershipStatus}: UserIconProps) {
    return <div className="nav__user">
        <div className="nav__user-icon"><UserRound /></div>
        <div className="nav__user-info">
            <p className="font-base font-bold">{name}</p>
            <p className="font-serif text-dark-glare italic">{membershipStatus}</p>
        </div>
    </div>
}