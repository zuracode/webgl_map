// hooks
import { useEffect, useState } from 'react'
import { useActiveCircle, useGeofence, usePaint, usePrevious } from './helpers/hooks'

// components
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { Map } from './components/Map'
import ActivityContainer from './components/ActivityContainer'

// styles
import styled, { css } from 'styled-components'

// utils
import { lockActivities } from './helpers/mock'
import { moveCamera } from './helpers/utils'

// styled components
const padding = css`
    padding: 9.5px 20px;
`
const baseContainerStyle = css`
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
    font-family: Roboto, Arial, sans-serif;
    border-radius: 2px;
`
const Container = styled.div`
    display: flex;
    height: 100%;
    overflow: hidden;
`
const InteractionContainer = styled.div`
    position: absolute;
    z-index: 1;
    left: 190px;
    top: 10px;
`
const InteractionButton = styled.button`
    ${baseContainerStyle};
    ${padding};
    font-size: 18px;
    border: 0;
    cursor: pointer;
    color: rgb(86, 86, 86);
    margin-right: 10px;
    &:hover {
        background-color: rgb(235, 235, 235);
        color: black;
    }
`

const render = (status: Status) => {
    return <h1>{status}</h1>
}

const WebGLMap = () => {
    const [map, setMap] = useState<google.maps.Map>()
    const [toggleActivity, setToggleActivity] = useState(false)
    const [activeActivityIndex, setActiveActivityIndex] = useState(0)

    /**
     * Custom hooks
     */
    const prevActiveActivityIndex = usePrevious(activeActivityIndex)

    const { circlesList } = usePaint({ map, activitiesList: lockActivities })

    const { handleGeofenceToggle } = useGeofence({
        map,
        activeActivityIndex,
        activitiesList: lockActivities,
        circlesList,
    })

    /**
     * Handlers(events)
     */
    const handleToggleActivity = () => {
        setToggleActivity(!toggleActivity)
    }

    const handlePreviousActivityClick = () => {
        if (activeActivityIndex === 0) {
            setActiveActivityIndex(lockActivities.length - 1)
        } else {
            setActiveActivityIndex(activeActivityIndex - 1)
        }
    }

    const handleNextActivityClick = () => {
        if (activeActivityIndex === lockActivities.length - 1) {
            setActiveActivityIndex(0)
        } else {
            setActiveActivityIndex(activeActivityIndex + 1)
        }
    }

    /**
     * Colorize active Circle
     */
    useActiveCircle({
        circlesList,
        activitiesList: lockActivities,
        activeActivityIndex,
        prevActiveActivityIndex: prevActiveActivityIndex ?? 0,
    })

    /**
     * Move animation between circles
     */
    useEffect(() => {
        moveCamera({
            map,
            lockActivitiesList: lockActivities,
            prevActiveActivityIndex: prevActiveActivityIndex ?? 0,
            activeActivityIndex,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeActivityIndex])

    // put apiKey to make google map work
    return (
        <Container>
            <Wrapper apiKey="" render={render}>
                <Map
                    streetViewControl={false}
                    fullscreenControl={false}
                    mapId=""
                    map={map}
                    setMap={setMap}
                    style={{ flexGrow: '1', height: '100%' }}
                />
            </Wrapper>
            <InteractionContainer>
                <InteractionButton onClick={handlePreviousActivityClick}>
                    Previous
                </InteractionButton>
                <InteractionButton onClick={handleNextActivityClick}>Next</InteractionButton>
                {/* <InteractionButton onClick={handleGeofenceToggle}>
          Geofence
        </InteractionButton> */}
                <InteractionButton onClick={handleToggleActivity}>Activity</InteractionButton>
            </InteractionContainer>
            {!!toggleActivity && (
                <ActivityContainer
                    lockActivitiesList={lockActivities}
                    activeActivityIndex={activeActivityIndex}
                />
            )}
        </Container>
    )
}
export default WebGLMap
