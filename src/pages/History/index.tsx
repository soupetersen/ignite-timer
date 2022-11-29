import { formatDistanceToNow } from "date-fns";
import { useContext } from "react";
import { CycleContext } from "../../contexts/CycleContext";
import ptBR from "date-fns/esm/locale/pt-BR";
import { HistoryContainer, HistoryList, Status } from "./styles";

export function Historry() {
    const { cycles } = useContext(CycleContext);

    return (
        <HistoryContainer>
            <h1>Meu histórico</h1>
            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Duração</th>
                            <th>Inicio</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cycles.map((cycle) => {
                            return (
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minutesAmount} minutos</td>
                                    <td>
                                        {formatDistanceToNow(
                                            new Date(cycle.startedAt),
                                            {
                                                addSuffix: true,
                                                locale: ptBR,
                                            }
                                        )}
                                    </td>
                                    <td>
                                        {cycle.finishedAt && (
                                            <Status statusColor="green">
                                                Concluído
                                            </Status>
                                        )}

                                        {cycle.interruptedAt && (
                                            <Status statusColor="red">
                                                Interrompido
                                            </Status>
                                        )}

                                        {!cycle.finishedAt &&
                                            !cycle.interruptedAt && (
                                                <Status statusColor="yellow">
                                                    Em andamento
                                                </Status>
                                            )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    );
}
