import Color from "../color"
import CssVarManager from "./css-var-manager"
import "./theme.css"

const CSS_PREFIX = "theme"
const CSS_COLOR = "-color"
const CSS_ON = "-on"
const CSS_COLOR_PRIMARY = "-primary"
const CSS_COLOR_PRIMARY_LIGHT = "-primary-light"
const CSS_COLOR_PRIMARY_DARK = "-primary-dark"
const CSS_COLOR_ACCENT = "-accent"
const CSS_COLOR_ACCENT_LIGHT = "-accent-light"
const CSS_COLOR_ACCENT_DARK = "-accent-dark"
const CSS_COLOR_ERROR = "-error"
const CSS_COLOR_SCREEN = "-screen"
const CSS_COLOR_FRAME = "-frame"
const CSS_COLOR_SECTION = "-section"
const CSS_COLOR_INPUT = "-input"
const CSS_COLOR_WHITE = "-white"
const CSS_COLOR_BLACK = "-black"
const CSS_COLOR_LINK = "-link"
const CSS_OPACITY = "-opacity-"
const CSS_SHADOW = "-shadow"

export interface ThemeSettings {
    colors: {
        primary: ColorPalette
        accent: ColorPalette
        error: string
        screen: string
        frame: string
        section: string
        input: string
        white: string
        black: string
    }
}

interface ColorPalette {
    dark: string
    base: string
    light: string
}

type ColorNames =
    | "primary"
    | "primary-light"
    | "primary-dark"
    | "accent"
    | "accent-light"
    | "accent-dark"
    | "error"
    | "screen"
    | "frame"
    | "section"
    | "input"
    | "white"
    | "black"
    | "link"

const Theme = {
    apply,
    get defaultDarkTheme(): ThemeSettings {
        return {
            colors: {
                black: "#001e",
                white: "#eefe",
                error: "#f44",
                screen: "#123",
                frame: "#234",
                section: "#345",
                input: "#abc",
                primary: { dark: "#003ba7", base: "#2b75ee", light: "#85b6ff" },
                accent: { dark: "#d56900", base: "#ff8d1e", light: "#ffa956" },
            },
        }
    },
    get defaultLightTheme(): ThemeSettings {
        return {
            colors: {
                black: "#111e",
                white: "#eeee",
                error: "#f20",
                screen: "#bbb",
                frame: "#ccc",
                section: "#ddd",
                input: "#eee",
                primary: { dark: "#1f2859", base: "#3e50b4", light: "#5871ff" },
                accent: { dark: "#59501f", base: "#b4a23e", light: "#ffe658" },
            },
        }
    },
}

export default Theme

/**
 *
 * @param settings All the theme settings are needed. Use a helper function
 * if you want default values to be filled for you.
 * @param target Target element to apply to theme on. If omitted the theme is applied on BODY.
 */
function apply(settings: ThemeSettings, target?: HTMLElement | SVGElement) {
    const vars = new CssVarManager(target)
    applyColors(settings, vars)
    applyShadows(settings, vars)
}

function applyColors(settings: ThemeSettings, vars: CssVarManager) {
    const white = Color.fromColorOrString(settings.colors.white)
    const black = Color.fromColorOrString(settings.colors.black)
    applyColor(vars, "primary", settings.colors.primary.base, white, black)
    applyColor(
        vars,
        "primary-light",
        settings.colors.primary.light,
        white,
        black
    )
    applyColor(vars, "primary-dark", settings.colors.primary.dark, white, black)
    applyColor(vars, "accent", settings.colors.accent.base, white, black)
    applyColor(vars, "accent-light", settings.colors.accent.light, white, black)
    applyColor(vars, "accent-dark", settings.colors.accent.dark, white, black)
    applyColor(vars, "error", settings.colors.error, white, black)
    applyColor(vars, "screen", settings.colors.screen, white, black)
    applyColor(vars, "frame", settings.colors.frame, white, black)
    applyColor(vars, "section", settings.colors.section, white, black)
    applyColor(vars, "input", settings.colors.input, white, black)
    applyColor(vars, "white", settings.colors.white, white, black)
    applyColor(vars, "black", settings.colors.black, white, black)
    vars.set(
        varNameForColor("link"),
        Color.bestContrast(
            settings.colors.frame,
            settings.colors.accent.dark,
            settings.colors.accent.base,
            settings.colors.accent.light
        )
    )
}

function applyColor(
    vars: CssVarManager,
    colorName: ColorNames,
    colorValue: string,
    white: Color,
    black: Color
) {
    const color = Color.fromColorOrString(colorValue)
    vars.set(varNameForColor(colorName), color.stringify())
    const step = 5
    const percent = 0.01
    for (let opacity = step; opacity < 100; opacity += step) {
        color.A = opacity * percent
        vars.set(varNameForColor(colorName, opacity), color.stringify())
    }
    const colorOn = Color.bestContrast(color, white, black)
    vars.set(varNameForColorOn(colorName), colorOn.stringify())
    for (let opacity = step; opacity < 100; opacity += step) {
        const transparentColorOn = colorOn.copy()
        transparentColorOn.A = opacity * percent * colorOn.A
        vars.set(
            varNameForColorOn(colorName, opacity),
            transparentColorOn.stringify()
        )
    }
}

// eslint-disable-next-line no-unused-vars
const COLOR_CLASSNAME_MAPPING: { [key in ColorNames]: string } = {
    "accent-dark": CSS_COLOR_ACCENT_DARK,
    "accent-light": CSS_COLOR_ACCENT_LIGHT,
    "primary-dark": CSS_COLOR_PRIMARY_DARK,
    "primary-light": CSS_COLOR_PRIMARY_LIGHT,
    accent: CSS_COLOR_ACCENT,
    black: CSS_COLOR_BLACK,
    error: CSS_COLOR_ERROR,
    frame: CSS_COLOR_FRAME,
    input: CSS_COLOR_INPUT,
    primary: CSS_COLOR_PRIMARY,
    screen: CSS_COLOR_SCREEN,
    section: CSS_COLOR_SECTION,
    white: CSS_COLOR_WHITE,
    link: CSS_COLOR_LINK,
}

function varNameForColor(color: ColorNames, opacity: number = 0) {
    const colorClassName = COLOR_CLASSNAME_MAPPING[color]
    return `${CSS_PREFIX}${CSS_COLOR}${colorClassName}${
        opacity > 0 ? `${CSS_OPACITY}${opacity}` : ""
    }`
}

function varNameForColorOn(color: ColorNames, opacity: number = 0) {
    const colorClassName = COLOR_CLASSNAME_MAPPING[color]
    return `${CSS_PREFIX}${CSS_COLOR}${CSS_ON}${colorClassName}${
        opacity > 0 ? `${CSS_OPACITY}${opacity}` : ""
    }`
}

function applyShadows(settings: ThemeSettings, vars: CssVarManager) {
    // @see: https://material.io/design/environment/elevation.html#default-elevations
    const types: { [key: string]: number } = {
        card: 1,
        button: 2,
        header: 4,
        "button-pressed": 8,
        dialog: 24,
    }
    const color = "#000a"
    const scale = 0.0625
    for (const type of Object.keys(types)) {
        const value = types[type] * scale
        vars.set(
            `${CSS_PREFIX}${CSS_SHADOW}-${type}`,
            `0 ${value}rem ${2 * value}rem ${color}`
        )
    }
}
