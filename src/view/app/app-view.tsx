import * as React from "react"

import './app-view.css'


export interface AppViewProps {
    className?: string
}

export default function AppView(props: AppViewProps) {
    return <div className={getClassNames(props)}>
    </div>
}


function getClassNames(props: AppViewProps): string {
    const classNames = ['custom', 'ui-view-AppView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
