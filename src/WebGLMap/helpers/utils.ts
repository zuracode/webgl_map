// utils
import { createCustomEqual } from 'fast-equals'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { Easing, Tween, update } from '@tweenjs/tween.js'
import * as geometry from 'spherical-geometry-js'

const deepCompareEqualsForMaps = createCustomEqual(
    // @ts-ignore
    (deepEqual) => (a: any, b: any) => {
        if (
            isLatLngLiteral(a) ||
            a instanceof google.maps.LatLng ||
            isLatLngLiteral(b) ||
            b instanceof google.maps.LatLng
        ) {
            return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
        }
        // @ts-ignore
        return deepEqual(a, b)
    }
)

const moveCamera = ({
    map,
    lockActivitiesList = [],
    prevActiveActivityIndex = 0,
    activeActivityIndex = 0,
}: {
    map?: google.maps.Map
    lockActivitiesList: any
    prevActiveActivityIndex: number
    activeActivityIndex: number
}) => {
    if (map && lockActivitiesList?.length) {
        const VIEW_PARAMS = viewParam({
            lat: parseFloat(lockActivitiesList[prevActiveActivityIndex].lat),
            lng: parseFloat(lockActivitiesList[prevActiveActivityIndex].lng),
        })

        new Tween(VIEW_PARAMS)
            .to(
                {
                    center: {
                        lat: parseFloat(lockActivitiesList[activeActivityIndex].lat),
                        lng: parseFloat(lockActivitiesList[activeActivityIndex].lng),
                    },
                },
                5000
            )
            .easing(Easing.Cubic.Out)
            .onUpdate(() => {
                map.moveCamera(VIEW_PARAMS)
            })
            .start()
        const animate = (time: number) => {
            update(time)
            requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }
}

const fallsInsideGeofence = (lockMarker: any, geofenceMarker: any) => {
    const x = geometry.computeDistanceBetween(lockMarker.center, geofenceMarker.center)
    const r2 = geofenceMarker.radius
    const r1 = lockMarker.radius
    if (r1 - r2 < x && x < r1 + r2) {
        return true
    } else {
        return false
    }
}

const viewParam = ({ lat, lng }: { lat: Number; lng: Number }) => {
    const VIEW_PARAMS = {
        center: {
            lat: lat,
            lng: lng,
        },
        tilt: 100,
        heading: 0,
        zoom: 15,
    } as google.maps.CameraOptions

    return VIEW_PARAMS
}

export { deepCompareEqualsForMaps, moveCamera, fallsInsideGeofence, viewParam }
