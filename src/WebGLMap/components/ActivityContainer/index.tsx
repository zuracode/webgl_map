// utils
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

// components
import Activity from './Activity'

// styled components
const Container = styled.div`
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
    font-family: Roboto, Arial, sans-serif;
    border-radius: 2px;
    position: absolute;
    z-index: 1;
    left: 10px;
    top: 90px;
    height: 500px;
    width: 450px;
    overflow: hidden;

    .container {
        position: relative;
        height: 100%;
        overflow: auto;

        .header {
            padding: 10px 20px;
            position: sticky;
            top: 0;
            margin: 0;
            font-size: 18px;
            font-weight: normal;
            text-align: center;
            background-color: rgb(255, 255, 255);
        }

        .content {
            margin-bottom: 10px;
        }
    }
`

type Props = {
    lockActivitiesList: any
    activeActivityIndex: number
}

const ActivityContainer = ({ lockActivitiesList, activeActivityIndex }: Props) => {
    const refs = useRef<any[]>([])

    useEffect(() => {
        if (refs.current?.[activeActivityIndex]) {
            refs.current[activeActivityIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            })
        }
    }, [activeActivityIndex, refs])

    return (
        <Container>
            <div className="container">
                <p className="header">Activity Details</p>
                <div className="content">
                    {lockActivitiesList.map((lockActivity: any, lockActivityIndex: number) => (
                        <Activity
                            key={lockActivityIndex}
                            ref={(element) => (refs.current[lockActivityIndex] = element)}
                            activity={lockActivity}
                            active={activeActivityIndex === lockActivityIndex}
                        />
                    ))}
                </div>
            </div>
        </Container>
    )
}

export default ActivityContainer
