import { makeComment } from "./comment"
import { PythonScripting } from "@/contract/factory/scripting"

export function makeApiFunction(): Promise<PythonScripting> {
    return new Promise((resolve) =>
        resolve({
            imports: [
                "sys",
                "json",
                "traceback",
                { name: "Client", from: "brayns" },
            ],
            code: [
                ...makeComment(
                    "Connect to Brayns Renderer using the first command line",
                    "argument as hostname.",
                    "Define `exec()` function to call entry points on Brayns Renderer."
                ),
                "class Api:",
                [
                    "def __init__(self):",
                    [
                        "hostname_and_port = sys.argv[1]",
                        'print("Connecting to Brayns Renderer on", hostname_and_port, "...")',
                        "self.brayns = Client(hostname_and_port)",
                    ],
                    "",
                    "def exec(self, entry_point: str, params=None):",
                    [
                        "try:",
                        [
                            `return self.brayns.rockets_client.request(entry_point, params)`,
                        ],
                        "except Exception as ex:",
                        [
                            `print()`,
                            `print("########## ERROR ##########")`,
                            `print("Entrypoint: ", entry_point)`,
                            `print("Params: ", json.dumps(params, indent=4))`,
                            `print()`,
                            `print(traceback.format_exc())`,
                            `print()`,
                            `sys.exit(2)`,
                        ],
                    ],
                ],
                "exec = Api().exec",
            ],
        })
    )
}
