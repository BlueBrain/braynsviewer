import GeometryInterface from "../../contract/tool/geometry"
import Geometry from "../../tool/geometry"

let globalGeometry: GeometryInterface | undefined

/**
 * @returns Geometry singleton.
 */
export default function makeGeometry(): GeometryInterface {
    if (!globalGeometry) globalGeometry = new Geometry()
    return globalGeometry
}
