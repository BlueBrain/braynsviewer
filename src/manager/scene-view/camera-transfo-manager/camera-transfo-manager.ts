import CameraServiceInterface, {
    CameraCommonParams,
    CameraTransformation
} from "../../../contract/service/camera"
import GeometryInterface, { Vector3 } from "../../../contract/tool/geometry"
import TransfoGestureWatcherInterface, {
    TranslationEvent
} from "../../../contract/watcher/transfo-gesture"

export default class CameraTransfoManager {
    private _enabled = true
    private _element?: HTMLElement | SVGElement
    private _cameraTransfo: CameraTransformation = {
        orientation: [0, 0, 0, 1],
        position: [0, 0, -1],
        target: [0, 0, 0],
    }
    /**
     * When a gesture starts, we clone `_cameraTransfo` into `_referenceCameraTransfo`
     * so we can work with this without worrying for any Brayns broadcast.
     */
    private _referenceCameraTransfo: CameraTransformation
    /**
     * Orbiting is constraint to one axis at the time.
     */
    private _horizontallyContraint = false

    constructor(
        readonly geometry: GeometryInterface,
        readonly cameraService: CameraServiceInterface,
        readonly transfoGestureWatcher: TransfoGestureWatcherInterface
    ) {
        cameraService.eventCommonParamsChange.add(this.handleCameraUpdate)
        cameraService.getCommonParams().then(this.handleCameraUpdate)
        transfoGestureWatcher.eventMove.add(this.handleMove)
        transfoGestureWatcher.eventOrbit.add(this.handleOrbit)
        transfoGestureWatcher.eventZoom.add(this.handleZoom)
    }

    get enabled() {
        return this._enabled
    }
    set enabled(value: boolean) {
        this._enabled = value
    }

    private handleMove = (evt: TranslationEvent) => {
        if (!this.enabled) return

        const SCALE = 1
        if (evt.isBegin) {
            this._referenceCameraTransfo = {
                orientation: [...this._cameraTransfo.orientation],
                position: [...this._cameraTransfo.position],
                target: [...this._cameraTransfo.target],
            }
        }
        const { orientation, position, target } = this._referenceCameraTransfo
        const geom = this.geometry
        const axis = geom.getAxisFromQuaternion(orientation)
        const shiftX = geom.scaleVector(axis.x, -SCALE * evt.x)
        const shiftY = geom.scaleVector(axis.y, SCALE * evt.y)
        const shift = geom.addVectors(shiftX, shiftY)
        this.cameraService.setCommonParams({
            position: geom.addVectors(position, shift),
            target: geom.addVectors(target, shift),
        })
    }

    private handleOrbit = (evt: TranslationEvent) => {
        if (!this.enabled) return
        
        console.log("ORBIT")
        if (evt.isBegin) {
            this._referenceCameraTransfo = {
                orientation: [...this._cameraTransfo.orientation],
                position: [...this._cameraTransfo.position],
                target: [...this._cameraTransfo.target],
            }
            this._horizontallyContraint = Math.abs(evt.x) > Math.abs(evt.y)
        }
        const SCALE = 0.005
        if (this._horizontallyContraint) {
            this.orbitAroundY(-evt.x * SCALE)
        } else {
            this.orbitAroundX(-evt.y * SCALE)
        }
    }

    private orbitAroundX(angle: number) {
        const geom = this.geometry
        const { orientation } = this._referenceCameraTransfo
        const axis = geom.getAxisFromQuaternion(orientation)
        this.orbitAroundAxis(axis.x, angle)
    }

    private orbitAroundY(angle: number) {
        const geom = this.geometry
        const { orientation } = this._referenceCameraTransfo
        const axis = geom.getAxisFromQuaternion(orientation)
        this.orbitAroundAxis(axis.y, angle)
    }

    private orbitAroundAxis(axis: Vector3, angle: number) {
        console.log("angle =", Math.floor((180 * angle) / Math.PI))
        const geom = this.geometry
        const { orientation, position, target } = this._referenceCameraTransfo
        const direction = geom.subVectors(position, target)
        const newOrientation = geom.rotateQuaternionAroundVector(
            orientation,
            axis,
            angle
        )
        const newDirection = geom.rotateVectorWithQuaternion(
            direction,
            newOrientation
        )
        const newPosition = geom.addVectors(target, newDirection)
        this.cameraService.setCommonParams({
            orientation: newOrientation,
            position: newPosition,
        })
    }

    private handleZoom = (delta: number) => {
        if (!this.enabled) return
        
        const SCALE = 0.001
        const geom = this.geometry
        const transfo = this._cameraTransfo
        const direction = geom.scaleVector(
            geom.subVectors(transfo.target, transfo.position),
            -SCALE * delta
        )
        const newPosition = geom.addVectors(transfo.position, direction)
        transfo.position = newPosition
        this.cameraService.setCommonParams(transfo)
    }

    set element(element: HTMLElement | SVGElement | undefined) {
        this.transfoGestureWatcher.element = element
    }

    private handleCameraUpdate = (params: CameraCommonParams) => {
        this._cameraTransfo = params
    }
}
