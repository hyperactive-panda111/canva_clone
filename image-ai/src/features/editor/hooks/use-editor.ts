import { fabric } from 'fabric';
import { useCallback, useMemo, useState } from "react";

import { 
    BuildEditorProps,
    CIRCLE_OPTIONS, 
    DIAMOND_OPTIONS, 
    Editor, 
    RECTANGLE_OPTIONS, 
    TRIANGLE_OPTIONS 
} from '../types';

import { useAutoResize } from './use-auto-resize';

const buildEditor = ({ canvas }: BuildEditorProps): Editor => {
    const getWorkspace = () => {
        return canvas.getObjects().find((obj) => obj.name === 'clip');
    };

    const center = (obj: fabric.Object) => {
        const workspace = getWorkspace();
        const center = workspace?.getCenterPoint();

        if (!center) return;

        //@ts-ignore
        canvas._centerObject(obj, center);
    }

    const addToCanvas = (object: fabric.Object) => {
        center(object);
        canvas.add(object);
        canvas.setActiveObject(object);
    }

    return {
        addCircle: () => {
            const object = new fabric.Circle({
                ...CIRCLE_OPTIONS,
            });
            
            addToCanvas(object);
        },
        addSoftRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 50,
                ry: 50,
            });
            
            addToCanvas(object);
        },
        addRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
            });
            
            addToCanvas(object);
        },
        addTriangle: () => {
            const object = new fabric.Triangle({
                ...TRIANGLE_OPTIONS,
            });
            
            addToCanvas(object);
        },
        addInverseTriangle:() => {
            const HEIGHT = 400;
            const WIDTH = 400;

            const object = new fabric.Polygon(
                [
                    { x: 0, y: 0 },
                    { x: WIDTH, y: 0 },
                    { x: WIDTH / 2, y: HEIGHT },
                ],
                {
                    ...TRIANGLE_OPTIONS,
                }
            );
            
            addToCanvas(object);
        },
        addDiamond: () => {
            const HEIGHT = DIAMOND_OPTIONS.height;
            const WIDTH = DIAMOND_OPTIONS.width;

            const object = new fabric.Polygon(
                [
                    { x: WIDTH / 2, y: 0 },
                    { x: WIDTH, y: HEIGHT / 2 },
                    { x: WIDTH / 2, y: HEIGHT },
                    { x: 0, y: HEIGHT / 2 },
                ],
                {
                    ...DIAMOND_OPTIONS,
                }
            );
        
            addToCanvas(object);
        },
    };
};

export const useEditor = () => {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useAutoResize({
        canvas,
        container,
    });

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({canvas});
        };

        return undefined;
    }, [canvas]);


    const init = useCallback(({
        initialCanvas,
        initialContainer
    }: {
        initialCanvas: fabric.Canvas,
        initialContainer: HTMLDivElement
    }) => {
        const initialWorkspace = new fabric.Rect({
            width: 900,
            height: 1200,
            name: 'clip',
            fill: 'white',
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: 'rgba(0, 0, 0, 0.8)',
                blur: 5,
            })
        })

        initialCanvas.setWidth(initialContainer.offsetWidth);
        initialCanvas.setHeight(initialContainer.offsetHeight);

        initialCanvas.add(initialWorkspace);
        initialCanvas.centerObject(initialWorkspace);
        initialCanvas.clipPath = initialWorkspace;

        setCanvas(initialCanvas);
        setContainer(initialContainer);
        
    }, []);

    return { init, editor };
}