import { fabric } from 'fabric';
import { useEffect } from 'react';

interface UseCanvasEventsProps {
    canvas: fabric.Canvas | null;
    setSelectedObjects: (objects: fabric.Object[]) => void;
    clearSelectionCallback?: () => void;
    save: () => void;
}

export const useCanvasEvents = ({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback
}: UseCanvasEventsProps) => {

    useEffect(() => {
        if (canvas) {
            canvas.on('object:added', (e) => save());
            canvas.on('object:modified', (e) => save());
            canvas.on('object:removed', (e) => save());
            canvas.on('selection:created', (e) => {
                setSelectedObjects(e.selected || []);
            });
            canvas.on('selection:updated', (e) => {  
                setSelectedObjects(e.selected || []);
            });
            canvas.on('selection:cleared', (e) => {                
                setSelectedObjects([]);
                clearSelectionCallback?.();
            });
        };

        return () => {
            if (canvas) {
                canvas.off('object:created');
                canvas.off('object:modified');
                canvas.off('object:removed');
                canvas.off('selection:created');
                canvas.off('selection:updated');
                canvas.off('selection:cleared');
            }
        }
    }, 
    [
        save,
        canvas, 
        setSelectedObjects, 
        clearSelectionCallback
    ]);
};
