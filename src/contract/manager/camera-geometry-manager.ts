import EventInterface from "../tool/event"
import { Vector3, Quaternion } from "../tool/geometry"

/**
 * Deals with position/orientation of a camera in the space.
 */
export default interface CameraGeometryManagerInterface {
    readonly eventGeometryChange: EventInterface<CameraGeometryManagerInterface>
    getGeometry(): CameraGeometry
    setGeometry(geometry: CameraGeometry)
    /**
     * Move the camera to its right.
     * @param distance Set it negative to go left.
     */
    moveAlongOwnX(distance: number)
    /**
     * Move the camera to its top.
     * @param distance Set it negative to go bottom.
     */
    moveAlongOwnY(distance: number)
    /**
     * Move the camera forward.
     * @param distance Set it negative to go backward.
     */
    moveAlongOwnZ(distance: number)
    /**
     * Rotate the camera around its target with an axis
     * oriented as X, and going to the top for positive
     * angles.
     * @param radians Angle of rotation.
     */
    orbitAroundOwnX(radians: number)
    /**
     * Rotate the camera around its target with an axis
     * oriented as Y, and going to the right for positive
     * angles.
     * @param radians Angle of rotation.
     */
    orbitAroundOwnY(radians: number)
}

export interface CameraGeometry {
    // Where the camera stands.
    position: Vector3
    // What it's looking at (reference point).
    target: Vector3
    orientation: Quaternion
}
