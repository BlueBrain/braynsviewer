import BraynsServiceInterface from "@/contract/service/brayns"
export type ScriptingImport =
    | string
    | {
          name: string
          from: string
      }
    | {
          names: string[]
          from: string
      }

export type PythonScripting =
    | Array<string | PythonScripting>
    | {
          imports: ScriptingImport[]
          code: Array<string | PythonScripting> | string | PythonScripting
      }

export interface ScriptingFactoryInterface {
    /**
     * The following call:
     * ```ts
     * stringify({
     *   [
     *   "for i in range(10):",
     *   {
     *     imports: [{ name: "math" }],
     *     code: [
     *       "print(i * math.pi)"
     *     ]
     *   }
     * ], "    ")
     * ```
     * will give this string:
     * ```python
     * import math
     * for i in range(10):
     *     print(i * math.pi)
     * ```
     */
    stringify(script: PythonScripting, indent?: string): string

    makeApiFunction(): Promise<PythonScripting>
    makeInitCamera(brayns: BraynsServiceInterface): Promise<PythonScripting>
    makeInitRenderer(brayns: BraynsServiceInterface): Promise<PythonScripting>
    makeLoadModels(brayns: BraynsServiceInterface): Promise<PythonScripting>
    makeScriptHeader(brayns: BraynsServiceInterface): Promise<PythonScripting>
}
