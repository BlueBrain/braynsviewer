export default interface GeometryInterface {
    /**
     * Compute the size and position of an image that we want to paste on a target
     * so as to cover it entirely and keep image aspect ratio.
     *
     * @param sourceSize Size of the image you want to fit.
     * @param targetSize Area where to fit the source image.
     * @param alignement Float between 0 and 1. This is the percentage of
     * the image that will overflow on the left or on the top.
     * Use 0.5 to get a centered result.
     */
    fitToCover(
        sourceSize: Size,
        targetSize: Size,
        alignement?: number
    ): SizeAndPos

    addVectors(a: Vector3, b: Vector3)

    /**
     * @return a - b
     */
    subVectors(a: Vector3, b: Vector3)

    /**
     * Multiply each component of the vector by a scalar.
     * @param a
     */
    scaleVector(a: Vector3, scale: number): Vector3

    /**
     * @returns The length of a vector.
     */
    length(vector: Vector3): number

    /**
     * Compute distance betweeb `pointA` and `pointB`.
     */
    distance(pointA: Vector3, pointB: Vector3): number

    rotateVectorWithQuaternion(vec: Vector3, quat: Quaternion): Vector3

    /**
     * Get the X, Y, Z axis of the matrix that maps this orientation.
     * @param quaternion Must be a unit quaternion.
     */
    getAxisFromQuaternion(quaternion: Quaternion): Axis

    /**
     * Rotate a quaternion around an axis.
     * @param quat Quaternion to rotate.
     * @param vec Rotation axis.
     * @param ang Angle in radians.
     */
    rotateQuaternionAroundVector(
        quat: Quaternion,
        vec: Vector3,
        ang: number
    ): Quaternion
}

/**
 * Define the smallest cube that contain a 3D object.
 */
export interface BoundingBox {
    /** Coords of the box corner with smallest coords. */
    min: Vector3
    /** Coords of the box corner with greatest coords. */
    max: Vector3
}

export interface Axis {
    x: Vector3
    y: Vector3
    z: Vector3
}

export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]
export type Quaternion = Vector4
export interface Size {
    width: number
    height: number
}
export interface Position {
    x: number
    y: number
}
export interface SizeAndPos extends Size, Position {}
