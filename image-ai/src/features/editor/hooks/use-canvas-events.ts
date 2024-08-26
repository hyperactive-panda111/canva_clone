import { fabric } from 'fabric';
import { useEffect } from 'react';

interface UseCanvasEventsProps {
    canvas: fabric.Canvas | null;
    setSelectedObjects: (objects: fabric.Object[]) => void;
    clearSelectionCallback?: () => void;
}

export const useCanvasEvents = ({
    canvas,
    setSelectedObjects,
    clearSelectionCallback
}: UseCanvasEventsProps) => {

    useEffect(() => {
        if (canvas) {
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
                canvas.off('selection:created');
                canvas.off('selection:updated');
                canvas.off('selection:cleared');
            }
        }
    }, [canvas, setSelectedObjects, clearSelectionCallback]);
};
