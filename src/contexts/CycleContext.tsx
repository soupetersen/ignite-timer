import { differenceInSeconds } from "date-fns";
import { createContext, useEffect, useReducer, useState } from "react";
import {
    ActionTypes,
    addNewCycleAction,
    interruptCurrentCycleAction,
    markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { cyclesReducer } from "../reducers/cycles/reducer";
import { Cycle } from "../types/cycle";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CycleContextData {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    stopCycle: () => void;
}

interface CycleContextProviderProps {
    children: React.ReactNode;
}

export const CycleContext = createContext({} as CycleContextData);

export function CycleContextProvider({ children }: CycleContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(
        cyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        },
        () => {
            const localData = localStorage.getItem(
                "@ignite-time:cycles-state-1.0.0"
            );
            return localData
                ? JSON.parse(localData)
                : { cycles: [], activeCycleId: null };
        }
    );
    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startedAt)
            );
        }
        return 0;
    });

    useEffect(() => {
        const statejSON = JSON.stringify(cyclesState);
        localStorage.setItem("@ignite-time:cycles-state-1.0.0", statejSON);
    }, [cyclesState]);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }

    function createNewCycle({ task, minutesAmount }: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id: id,
            task,
            minutesAmount,
            startedAt: new Date(),
        };

        dispatch(addNewCycleAction(newCycle));
        setAmountSecondsPassed(0);
    }

    function markCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
    }

    function stopCycle() {
        dispatch(interruptCurrentCycleAction());
    }

    return (
        <CycleContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                stopCycle,
            }}
        >
            {children}
        </CycleContext.Provider>
    );
}
