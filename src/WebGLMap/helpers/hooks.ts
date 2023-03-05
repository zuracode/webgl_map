// hooks
import { useEffect, useRef, EffectCallback, useState } from 'react'

// utils
import { deepCompareEqualsForMaps, fallsInsideGeofence, viewParam } from './utils'

// configs
import { chargingColor, chargedColor, pathColor, activeColor, geofenceFillColor } from './configs'

const useDeepCompareMemoize = (value: any) => {
    const ref = useRef()

    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value
    }

    return ref.current
}

const useDeepCompareEffectForMaps = (callback: EffectCallback, dependencies: any[]) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

const usePrevious = (value: any) => {
    const ref = useRef({
        value: value,
        prev: null,
    })

    const current = ref.current.value

    if (value !== current) {
        ref.current = {
            value: value,
            prev: current,
        }
    }

    // return the previous value only
    return ref.current.prev
}

const useGeofence = ({
    isActive = false,
    map,
    activitiesList,
    activeActivityIndex,
    circlesList,
}: {
    isActive?: boolean
    map?: google.maps.Map
    activeActivityIndex: number
    activitiesList: any
    circlesList: any
}) => {
    const [toggle, setToggle] = useState(false)
    const [geofenceMarker, setGeofenceMarker] = useState<null | google.maps.Circle>(null)

    /**
     * Handlers
     */
    const handleToggle = () => {
        setToggle((prevToggle) => !prevToggle)
    }

    /**
     * Hooks
     */
    useEffect(() => {
        setToggle(isActive)
    }, [isActive])

    useEffect(() => {
        if (toggle) {
            if (map && activitiesList?.length) {
                const geofenceMarker = new google.maps.Circle({
                    strokeColor: activeColor,
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    fillColor: geofenceFillColor,
                    fillOpacity: 0.35,
                    map,
                    center: {
                        lat: parseFloat(activitiesList[0].lat),
                        lng: parseFloat(activitiesList[0].lng),
                    },
                    radius: 900,
                })

                setGeofenceMarker(geofenceMarker)

                for (let i = 0; i < circlesList.length; i++) {
                    const x = fallsInsideGeofence(circlesList[i], geofenceMarker)

                    if (!x) {
                        circlesList[i].setOptions({ fillColor: activeColor })
                    }
                }
            }
        } else {
            if (activitiesList?.length && circlesList?.length) {
                // colorize active circle
                circlesList[activeActivityIndex].setOptions({
                    fillColor: activitiesList[activeActivityIndex].batteryCharging
                        ? chargingColor
                        : chargedColor,
                    strokeColor: activeColor,
                })

                // colorize all circles except active
                for (let i = 0; i < circlesList.length; i++) {
                    if (i !== activeActivityIndex) {
                        circlesList[i].setOptions({
                            fillColor: activitiesList[i].batteryCharging
                                ? chargingColor
                                : chargedColor,
                            strokeColor: activitiesList[i].batteryCharging
                                ? chargingColor
                                : chargedColor,
                        })
                    }
                }
            }

            if (geofenceMarker) {
                geofenceMarker.setMap(null)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggle])

    return {
        handleGeofenceToggle: handleToggle,
    }
}

const usePaint = ({ map, activitiesList }: { map?: google.maps.Map; activitiesList: any }) => {
    const [circlesList, setCirclesList] = useState<google.maps.Circle[] | []>([])

    useEffect(() => {
        if (map && activitiesList?.length) {
            const path: any = []
            const circles: any = []

            const VIEW_PARAMS = viewParam({
                lat: parseFloat(activitiesList[0].lat),
                lng: parseFloat(activitiesList[0].lng),
            })
            map.setOptions(VIEW_PARAMS)

            activitiesList.forEach((lockActivity: any) => {
                const circle = new google.maps.Circle({
                    fillColor: lockActivity.batteryCharging ? chargingColor : chargedColor,
                    strokeColor: lockActivity.batteryCharging ? chargingColor : chargedColor,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillOpacity: 0.25,
                    map,
                    center: { lat: lockActivity.lat, lng: lockActivity.lng },
                    radius: lockActivity.radius,
                })

                circles.push(circle)

                path.push(new google.maps.LatLng(lockActivity.lat, lockActivity.lng))
            })

            new google.maps.Polyline({
                map: map,
                path: path,
                strokeColor: pathColor,
                strokeOpacity: 1,
                strokeWeight: 4,
            })

            setCirclesList(circles)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, activitiesList])

    return { circlesList }
}

const useActiveCircle = ({
    circlesList,
    activitiesList,
    activeActivityIndex = 0,
    prevActiveActivityIndex = 0,
}: {
    activitiesList: any[]
    circlesList: google.maps.Circle[] | []
    activeActivityIndex: number
    prevActiveActivityIndex: number
}) => {
    useEffect(() => {
        if (circlesList?.length && circlesList?.[activeActivityIndex]) {
            circlesList[activeActivityIndex].setOptions({ strokeColor: activeColor })
        }
        if (prevActiveActivityIndex !== activeActivityIndex) {
            circlesList[prevActiveActivityIndex].setOptions({
                strokeColor: activitiesList[prevActiveActivityIndex].batteryCharging
                    ? chargingColor
                    : chargedColor,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [circlesList, activeActivityIndex, prevActiveActivityIndex])
}

export { useDeepCompareEffectForMaps, usePrevious, useGeofence, usePaint, useActiveCircle }
