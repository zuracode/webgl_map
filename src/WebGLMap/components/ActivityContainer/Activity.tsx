// utils
import { forwardRef } from 'react'
import styled from 'styled-components'

// styled components
const Container = styled.div`
    background-color: ${({ active }: { active: boolean }) => (active ? '#dbd9d7' : '#f2f0ee')};
    padding: 10px;

    p {
        margin: 0;
        text-align: center;
    }

    &:not(:first-child) {
        margin-top: 10px;
    }
`

type Props = {
    activity: any
    active: boolean
}

const Activity = forwardRef(({ activity, active }: Props, ref) => (
    //@ts-ignore
    <Container active={active} ref={ref}>
        <p>
            <span>Battery Charging: </span>
            <span>{activity.batteryCharging.toString()}</span>
        </p>
        <p>
            <span>Battery Level: </span>
            <span>{activity.batteryLevel}%</span>
        </p>
        <p>
            <span>Activity Type: </span>
            <span>{activity.type}</span>
        </p>
        <p>
            <span>Timestamp (UTC): </span>
            <span>{activity.date}</span>
        </p>
    </Container>
))

export default Activity
