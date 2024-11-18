export function makeComment(...lines: string[]): string[] {
    return [
        "",
        "#======================================================================",
        ...lines.map((line) => `# ${line}`),
        "#----------------------------------------------------------------------",
    ]
}
