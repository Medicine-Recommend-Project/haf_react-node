import react, {useEffect, useState} from "react";
import {Button, UncontrolledTooltip} from "reactstrap";



const TextHandler = ({ scheduleUpdate }) => {
    let text = ""
    useEffect(() => {
        console.log(scheduleUpdate.text)
        const intervalId = setInterval(() => {
            text = scheduleUpdate.text;
            scheduleUpdate.scheduleUpdate();
        }, 2000);

        return () => clearInterval(intervalId);
    });

    return (
        <>{text}</>
    );
}

const TooltipContent = ({props}) => {
    return (
        <div className="text-center">
            <UncontrolledTooltip placement="top" target={props.target} trigger="click">
                {({ scheduleUpdate }) => (
                    <TextHandler scheduleUpdate={{
                        scheduleUpdate,
                        text: props.text
                    }} />
                )}
            </UncontrolledTooltip>
        </div>
    );
}
export default TooltipContent;
