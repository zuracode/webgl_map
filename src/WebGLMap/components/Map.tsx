import { useEffect, useRef, ReactNode, Children, isValidElement, cloneElement } from 'react'
import { useDeepCompareEffectForMaps } from '../helpers/hooks'

type MapProps = {
    style: { [key: string]: string }
    children?: ReactNode
    map?: google.maps.Map
    setMap: (param: google.maps.Map) => void
} & google.maps.MapOptions

const Map = ({ map, setMap, children, style, mapId, ...options }: MapProps) => {
    const ref = useRef<HTMLDivElement>(null)

    /**
     * Initialize Map
     */
    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, { mapId }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, map])

    /**
     * Set options to maps
     */
    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options)
        }
    }, [map, options])

    return (
        <>
            <div ref={ref} style={style} />
            {Children.map(children, (child) => {
                if (isValidElement(child)) {
                    // @ts-ignore
                    return cloneElement(child, { map })
                }
            })}
        </>
    )
}

export { Map }
