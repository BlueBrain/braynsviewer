export default interface ConfigManagerInterface {
    /**
     * Brayns address can be found in param `host` where the hostname is
     * separated from the port by a color (":").
     * But if this param has not been provided, the implementation can
     * decide to open a dialog box to ask it to the user.
     */
    getBraynsAddress(): Promise<{ host: string; port: number }>
}
