import * as React from "react"
import './scene-view.css'



export interface SceneViewProps {
    className?: string
}

export default function SceneView(props: SceneViewProps) {
    return <div className={getClassNames(props)}>
        <h1>Scene</h1>
    </div>
}


function getClassNames(props: SceneViewProps): string {
    const classNames = ['custom', 'view-SceneView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
