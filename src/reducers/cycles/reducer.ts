import { Cycle } from "../../types/cycle";
import { produce } from "immer";
import { ActionTypes } from "./actions";

interface CyclesState {
    cycles: Cycle[];
    activeCycleId: string | null;
}

export function cyclesReducer(state: CyclesState, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
            return produce(state, (draft) => {
                draft.cycles.push(action.payload.newCycle);
                draft.activeCycleId = action.payload.newCycle.id;
            });
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
            return produce(state, (draft) => {
                const currentCycle = draft.cycles.find(
                    (cycle) => cycle.id === draft.activeCycleId
                );

                if (currentCycle) {
                    currentCycle.finishedAt = new Date();
                    draft.activeCycleId = null;
                }
            });

        case ActionTypes.INTERRUPT_CURRENT_CYCLE:
            return produce(state, (draft) => {
                const currentCycle = draft.cycles.find(
                    (cycle) => cycle.id === draft.activeCycleId
                );
                if (currentCycle) {
                    currentCycle.interruptedAt = new Date();
                    draft.activeCycleId = null;
                }
            });
        default:
            return state;
    }
}
