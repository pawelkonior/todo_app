import { useEffect, useState } from "react";
import {
    deleteDataAPI,
    getDataAPI,
    sendDataAPI,
    updateDataAPI,
} from "./helpers/api.js";
import AddOperation from "./components/AddOperation.jsx";
import AddTimeSpent from "./components/AddTimeSpent.jsx";
import {
    Badge,
    Button,
    ButtonGroup,
    Chip,
    Collapse,
    Container,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [operationId, setOperationId] = useState(null);
    const [timeSpentId, setTimeSpentId] = useState(null);

    useEffect(() => {
        const data = Promise.all([
            getDataAPI("tasks"),
            getDataAPI("operations"),
        ]);

        data.then((results) => {
            const [taskData, operationData] = results;
            const tasks = taskData.map((task) => ({
                ...task,
                operations: operationData.filter(
                    (operation) => operation.taskId === task.id
                ),
            }));

            setTasks(tasks);
        }).catch(console.error);
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        const result = await sendDataAPI(
            {
                title,
                description,
                status: "open",
                addedDate: new Date(),
            },
            "tasks"
        );

        setTitle("");
        setDescription("");
        setTasks([...tasks, result]);
    }

    async function handleDeleteTask(event) {
        const id = +event.target.dataset.id;
        const task = tasks.find((task) => task.id === id);

        for (const operation of task.operations) {
            await deleteDataAPI(operation.id, "operations");
        }

        await deleteDataAPI(id, "tasks");
        setTasks(tasks.filter((task) => task.id !== id));
    }

    async function handleDeleteOperation(id) {
        await deleteDataAPI(id, "operations");
        setTasks(
            tasks.map((task) => {
                return {
                    ...task,
                    operations: task.operations.filter(
                        (operation) => operation.id !== id
                    ),
                };
            })
        );
    }

    function handleFinishTask(id) {
        return async function () {
            await updateDataAPI(
                {
                    status: "closed",
                },
                "tasks",
                id,
                "PATCH"
            );

            setTasks(
                tasks.map((task) => ({
                    ...task,
                    status: task.id === id ? "closed" : task.status,
                }))
            );
        };
    }

    return (
        <Container maxWidth="md">
            <h1>Todo App</h1>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} direction="column">
                    <TextField
                        label="Title"
                        variant="outlined"
                        value={title}
                        type="text"
                        id="title"
                        name="title"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={description}
                        id="desc"
                        name="desc"
                        onChange={(event) => setDescription(event.target.value)}
                    />

                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Stack>
            </form>

            <Grid container spacing={2} gap={2} style={{ marginTop: "20px" }}>
                {tasks.map((task) => (
                    <Grid xs={12} key={task.id}>
                        <List
                            sx={{
                                width: "100%",
                                bgcolor: "background.paper",
                            }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            <ListItemButton onClick={() => {}}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={task.title}
                                    secondary={task.description}
                                />
                                <ButtonGroup
                                    variant="contained"
                                    aria-label="outlined primary button group"
                                >
                                    {operationId === task.id ? (
                                        <AddOperation
                                            setOperationId={setOperationId}
                                            taskId={task.id}
                                            setTasks={setTasks}
                                        />
                                    ) : (
                                        <>
                                            {task.status === "open" && (
                                                <button
                                                    onClick={() =>
                                                        setOperationId(task.id)
                                                    }
                                                >
                                                    Add operation
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {task.status === "open" && (
                                        <Button
                                            onClick={handleFinishTask(task.id)}
                                        >
                                            Finish
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleDeleteTask}
                                        data-id={task.id}
                                    >
                                        Delete
                                    </Button>
                                </ButtonGroup>
                                {true ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={true} timeout="auto" unmountOnExit>
                                {task.operations &&
                                    task.operations.map((operation) => (
                                        <List
                                            component="div"
                                            disablePadding
                                            key={operation.id}
                                        >
                                            <ListItemText
                                                primary={operation.description}
                                            />

                                            {operation.timeSpent !== 0 && (
                                                <Chip
                                                    color="secondary"
                                                    label={`${~~(
                                                        operation.timeSpent / 60
                                                    )}h ${
                                                        operation.timeSpent % 60
                                                    }m`}
                                                />
                                            )}
                                            <ButtonGroup
                                                variant="contained"
                                                aria-label="outlined primary button group"
                                            >
                                                {operation.id ===
                                                timeSpentId ? (
                                                    <AddTimeSpent
                                                        setTasks={setTasks}
                                                        operationId={
                                                            operation.id
                                                        }
                                                        timeSpent={
                                                            operation.timeSpent
                                                        }
                                                        setTimeSpentId={
                                                            setTimeSpentId
                                                        }
                                                    />
                                                ) : (
                                                    <>
                                                        {task.status ===
                                                            "open" && (
                                                            <Button
                                                                onClick={() =>
                                                                    setTimeSpentId(
                                                                        operation.id
                                                                    )
                                                                }
                                                            >
                                                                Add Spent Time
                                                            </Button>
                                                        )}
                                                    </>
                                                )}

                                                {task.status === "open" && (
                                                    <Button
                                                        onClick={() =>
                                                            handleDeleteOperation(
                                                                operation.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </ButtonGroup>
                                        </List>
                                    ))}
                            </Collapse>
                        </List>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default App;
