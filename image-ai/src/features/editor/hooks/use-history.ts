import { useCallback, useRef, useState } from "react";
import { JSON_KEYS } from "../types";

interface useHistoryProps {
    canvas: fabric.Canvas | null;
}

export const useHistory = ({ canvas }: useHistoryProps) => {
    const [historyIndex, setHistoryIndex] = useState(0);
    const canvasHistory = useRef<string[]>([]);
    const skipSave = useRef(false);

    const canUndo = useCallback(() => {
        return historyIndex > 0;
    }, [historyIndex]);

    const canRedo = useCallback(() => {
        return historyIndex < canvasHistory.current.length - 1;
    }, [historyIndex]);

    const save = useCallback((skip = false) => {
        if (!canvas) return;

        const currentState = canvas.toJSON(JSON_KEYS);
        const json = JSON.stringify(currentState);

        if (!skipSave.current && !skip) {
            canvasHistory.current.push(json);
            setHistoryIndex(canvasHistory.current.length - 1);
        }


    }, 
    [
        canvas
    ]);

    const undo = useCallback(() => {
        if (canUndo()) {
            skipSave.current = true;
            canvas?.clear().renderAll();

            const previousIndex = historyIndex - 1;
            const previousState = canvasHistory.current[previousIndex];
            
            canvas?.loadFromJSON(previousState, () => {
                canvas.renderAll();
                setHistoryIndex(previousIndex);
                skipSave.current = false;
            });
        }

    }, [canUndo, canvas]);

    const redo = useCallback(() => {
        if (canRedo()) {
            skipSave.current = true;
            canvas?.clear().renderAll();

            const nextIndex = historyIndex + 1;
            const nextState = canvasHistory.current[nextIndex];

            canvas?.loadFromJSON(nextState, () => {
                canvas.renderAll();
                setHistoryIndex(nextIndex);
                skipSave.current = false;
            })


        }
    }, [canRedo, canvas, historyIndex]);

    return { 
        save, 
        redo, 
        undo,
        canRedo,
        canUndo,
        setHistoryIndex,
        canvasHistory,
    };
};