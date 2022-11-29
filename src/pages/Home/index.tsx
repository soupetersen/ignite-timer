import { HandPalm, Play } from "phosphor-react";
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from "./styles";
import { useContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { Cycle } from "../../types/cycle";
import { CycleContext } from "../../contexts/CycleContext";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";

const formValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa").max(100),
    minutesAmount: zod
        .number()
        .min(1, "Mínimo de 5 minutos")
        .max(60, "Máximo de 60 minutos"),
});

type formData = zod.infer<typeof formValidationSchema>;

export function Home() {
    const { activeCycle, createNewCycle, stopCycle } = useContext(CycleContext);
    const newCycleForm = useForm<formData>({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 5,
        },
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    const task = watch("task");
    const isSubmitDisabled = !task;

    function handleCreateNewCycle(data: formData) {
        createNewCycle(data);
        reset();
    }

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
                {activeCycle ? (
                    <StopCountdownButton type="button" onClick={stopCycle}>
                        <HandPalm size={24} />
                        Pausar
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    );
}
