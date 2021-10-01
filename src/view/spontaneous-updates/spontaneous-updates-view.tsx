import * as React from "react"
import './spontaneous-updates-view.css'



export interface SpontaneousUpdatesViewProps {
    className?: string
}

export default function SpontaneousUpdatesView(props: SpontaneousUpdatesViewProps) {
    return <div className={getClassNames(props)}>
        <h1>Spontaneous updates</h1>
    </div>
}


function getClassNames(props: SpontaneousUpdatesViewProps): string {
    const classNames = ['custom', 'view-SpontaneousUpdatesView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
