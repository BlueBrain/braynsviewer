import * as React from "react"
import './loaders-view.css'



export interface LoadersViewProps {
    className?: string
}

export default function LoadersView(props: LoadersViewProps) {
    return <div className={getClassNames(props)}>
        <h1>Loaders</h1>
    </div>
}


function getClassNames(props: LoadersViewProps): string {
    const classNames = ['custom', 'view-LoadersView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
