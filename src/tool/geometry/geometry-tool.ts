import * as Math3D from "@math.gl/core"
import GeometryInterface, {
    Axis,
    Size,
    SizeAndPos,
    Vector3,
    Quaternion
} from "../../contract/tool/geometry"

export default class Geometry implements GeometryInterface {
    getAxisFromQuaternion(quaternion: Quaternion): Axis {
        const mtx = new Math3D.Matrix3()
        mtx.fromQuaternion(quaternion)
        return {
            x: mtx.getColumn(0),
            y: mtx.getColumn(1),
            z: mtx.getColumn(2)
        }
    }

    rotateQuaternionAroundVector(
        quat: Quaternion,
        vec: Vector3,
        ang: number
    ): Quaternion {
        const rotation = new Math3D.Quaternion()
        rotation.fromAxisRotation(vec, ang)
        const result = new Math3D.Quaternion(quat)
        const [x, y, z, w] = result.multiplyRight(rotation, undefined).elements
        return [x, y, z, w]
    }

    addVectors(a: Vector3, b: Vector3): Vector3 {
        const [ax, ay, az] = a
        const [bx, by, bz] = b
        return [ax + bx, ay + by, az + bz]
    }

    subVectors(a: Vector3, b: Vector3): Vector3 {
        const [ax, ay, az] = a
        const [bx, by, bz] = b
        return [ax - bx, ay - by, az - bz]
    }

    scaleVector(a: Vector3, scale: number): Vector3 {
        const [x, y, z] = a
        return [x * scale, y * scale, z * scale]
    }

    /**
     * @returns The length of a vector.
     */
    length(vector: Vector3): number {
        const [x, y, z] = vector
        return Math.sqrt(x * x + y * y + z * z)
    }

    distance(pointA: Vector3, pointB: Vector3): number {
        return this.length(this.subVectors(pointB, pointA))
    }

    rotateVectorWithQuaternion(vec: Vector3, quat: Quaternion): Vector3 {
        const v = new Math3D.Vector3(vec)
        v.transformByQuaternion(quat)
        const [x, y, z] = v.elements
        return [x, y, z]
    }

    fitToCover(
        sourceSize: Size,
        targetSize: Size,
        alignement: number = 0.5
    ): SizeAndPos {
        if (sourceSize.width <= 0 || sourceSize.height <= 0) {
            return { x: 0, y: 0, width: 0, height: 0 }
        }

        const scaleW = targetSize.width / sourceSize.width
        const scaleH = targetSize.height / sourceSize.height
        const scale = Math.max(scaleW, scaleH)
        const coverSize: Size = {
            width: scale * sourceSize.width,
            height: scale * sourceSize.height
        }
        const overflowX = coverSize.width - targetSize.width
        const overflowY = coverSize.height - targetSize.height
        return {
            ...coverSize,
            x: -alignement * overflowX,
            y: -alignement * overflowY
        }
    }
}
