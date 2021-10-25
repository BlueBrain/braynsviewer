import LoadersServiceInterface, {
    AddModelParams,
    LoaderDefinition
} from "../contract/service/loaders"

export default class LoadersServiceMock implements LoadersServiceInterface {
    async addModel(params: AddModelParams): Promise<any> {
        return {}
    }
    
    async listAvailableLoaders(): Promise<LoaderDefinition[]> {
        return [
            {
                name: "Hello world!",
                extensions: ["flc", "assbin", "blender"],
                properties: [],
            },
            {
                name: "Second...",
                extensions: ["avi", "mp4"],
                properties: [],
            },
        ]
    }
}
