import { differenceInSeconds } from "date-fns";
import { useContext, useEffect } from "react";
import { CycleContext } from "../../../../contexts/CycleContext";
import { CountdownContainer, Separator } from "./styles";

export function Countdown() {
    const {
        activeCycle,
        activeCycleId,
        markCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
    } = useContext(CycleContext);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutesAmountString = String(minutesAmount).padStart(2, "0");
    const secondsAmountString = String(secondsAmount).padStart(2, "0");

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutesAmountString}:${secondsAmountString}`;
        }
    }, [minutesAmountString, secondsAmountString]);

    useEffect(() => {
        let interval: number;
        if (activeCycle) {
            interval = setInterval(() => {
                const amountSecondsPassed = differenceInSeconds(
                    new Date(),
                    new Date(activeCycle.startedAt)
                );

                if (amountSecondsPassed >= totalSeconds) {
                    markCycleAsFinished();
                    setSecondsPassed(amountSecondsPassed);
                    clearInterval(interval);
                    return;
                }

                setSecondsPassed(amountSecondsPassed);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeCycle, totalSeconds, activeCycleId, secondsAmountString]);

    return (
        <CountdownContainer>
            <span>{minutesAmountString[0]}</span>
            <span>{minutesAmountString[1]}</span>
            <Separator>:</Separator>
            <span>{secondsAmountString[0]}</span>
            <span>{secondsAmountString[1]}</span>
        </CountdownContainer>
    );
}
