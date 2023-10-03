import * as React from "react"
import Icon from "../icon"
import Touchable from "../touchable"
import "./expand.css"

interface IExpandProps {
    className?: string
    label: string
    value: boolean
    onChange?(value: boolean): void
    children: React.ReactNode
}

interface IExpandState {
    value: boolean
}

const ICON_SIZE = "2rem"

export default class Expand extends React.Component<
    IExpandProps,
    IExpandState
> {
    private lastValue = this.props.value
    state: IExpandState = {
        value: this.props.value,
    }

    refresh = () => {
        const value = this.props.value
        if (value === this.lastValue) return
        this.lastValue = value
        this.setState({ value })
    }

    componentDidUpdate = this.refresh
    componentDidMount = this.refresh

    handleValueChange = () => {
        const value = !this.state.value
        this.setState({ value })
        const { onChange } = this.props
        if (typeof onChange === "function") {
            onChange(value)
        }
    }

    render() {
        const classes = [
            "custom",
            "tfw-view-Expand",
            this.props.className || "",
        ]

        return (
            <div
                className={classes.join(" ")}
                tabIndex={0}
                aria-expanded={this.state.value}
            >
                <Touchable onClick={this.handleValueChange}>
                    <div className="head">
                        <div className="icons">
                            <Icon name="plus" size={ICON_SIZE} />
                            <Icon name="minus" size={ICON_SIZE} />
                        </div>
                        <div>{this.props.label}</div>
                    </div>
                </Touchable>
                <div className="body">{this.props.children}</div>
            </div>
        )
    }
}
