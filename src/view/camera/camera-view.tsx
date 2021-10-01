import * as React from "react"
import './camera-view.css'



export interface CameraViewProps {
    className?: string
}

export default function CameraView(props: CameraViewProps) {
    return <div className={getClassNames(props)}>
        <h1>Camera</h1>
    </div>
}


function getClassNames(props: CameraViewProps): string {
    const classNames = ['custom', 'view-CameraView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
