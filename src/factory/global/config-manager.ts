import ConfigManager from "../../manager/config/config-manager"
import ConfigManagerInterface from "../../contract/manager/config"

export default function makeConfigManager(): ConfigManagerInterface {
    return new ConfigManager()
}
