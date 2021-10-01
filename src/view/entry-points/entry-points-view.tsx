import * as React from "react"
import './entry-points-view.css'



export interface EntryPointsViewProps {
    className?: string
}

export default function EntryPointsView(props: EntryPointsViewProps) {
    return <div className={getClassNames(props)}>
        <h1>Entry points</h1>
    </div>
}


function getClassNames(props: EntryPointsViewProps): string {
    const classNames = ['custom', 'view-EntryPointsView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
