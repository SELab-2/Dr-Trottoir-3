import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import React from 'react';
import {Box, IconButton, Link} from '@mui/material';
import {DragHandle, Clear, Add} from '@mui/icons-material';
import {Building} from './types';

interface Props {
    list: Building[];
    onReorder: (list: Building[]) => void;
    onRemove: (index: number) => void;
    onAdd: () => void;
    onHovering: (hovering: number) => void;
    hovering: number;
}

function BuildingList({list, onReorder, onRemove, onAdd, onHovering, hovering}: Props) {
    const onDragEnd = (result: DropResult) => {
        document.body.style.color = 'inherit';
        const {destination, source} = result;

        if (!destination || destination.droppableId !== source.droppableId) {
            return;
        }

        if (destination.index === source.index) {
            return;
        }

        const templist = Array.from(list);
        const [building] = templist.splice(source.index, 1);
        templist.splice(destination.index, 0, building);
        onReorder(templist);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={'BuildingList'}>
                {(provided, snapshot) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                        {list.map(({id, name}, index) =>
                            <Draggable key={id} draggableId={id} index={index}>
                                {((draggableProvided) => (
                                    <Box paddingBottom={1} {...draggableProvided.draggableProps}
                                        ref={draggableProvided.innerRef}>
                                        <Box
                                            bgcolor={hovering == index ?
                                                'var(--primary-yellow)' :
                                                'var(--secondary-light)'}
                                            borderRadius={'var(--small_corner)'}
                                            paddingY={0.2} paddingX={'3%'} alignItems={'center'} display={'flex'}
                                            onMouseEnter={() => onHovering(index)}
                                            onMouseLeave={() => onHovering(-1)}
                                        >
                                            <Box marginRight={'3%'} textAlign={'center'} color={'grey'}>
                                                {index + 1}
                                            </Box>
                                            <Link flexGrow={5} noWrap href={`/building/${id}`} color={'inherit'}
                                                underline={'none'}>{name}</Link>
                                            <IconButton onClick={() => {
                                                onHovering(-1);
                                                onRemove(index);
                                            }} size={'small'}>
                                                <Clear style={{flexGrow: 1}}/>
                                            </IconButton>
                                            <Box alignItems={'center'} {...draggableProvided.dragHandleProps}>
                                                <DragHandle/>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Draggable>
                        )}
                        {provided.placeholder}
                        <Box paddingBottom={1}>
                            <Box bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                                paddingY={0.2} paddingX={'3%'} display={'flex'} alignItems={'center'}>
                                <Box flexGrow={1}/>
                                <IconButton onClick={onAdd} size={'small'}>
                                    <Add/>
                                </IconButton>
                                <Box flexGrow={1}/>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default BuildingList;
