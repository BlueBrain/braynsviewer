import * as React from "react"
import './renderer-view.css'



export interface RendererViewProps {
    className?: string
}

export default function RendererView(props: RendererViewProps) {
    return <div className={getClassNames(props)}>
        <h1>Renderer</h1>
    </div>
}


function getClassNames(props: RendererViewProps): string {
    const classNames = ['custom', 'view-RendererView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
