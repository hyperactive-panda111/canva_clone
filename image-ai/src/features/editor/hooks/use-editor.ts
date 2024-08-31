import { fabric } from 'fabric';
import { useCallback, useMemo, useState } from "react";

import { 
    BuildEditorProps,
    CIRCLE_OPTIONS, 
    DIAMOND_OPTIONS, 
    Editor, 
    EditorHookProps, 
    FILL_COLOR, 
    FONT_FAMILY, 
    FONT_SIZE, 
    FONT_WEIGHT, 
    RECTANGLE_OPTIONS, 
    STROKE_COLOR, 
    STROKE_DASH_ARRAY, 
    STROKE_WIDTH, 
    TEXT_OPTIONS, 
    TRIANGLE_OPTIONS 
} from '../types';

import { useAutoResize } from './use-auto-resize';
import { useCanvasEvents } from './use-canvas-events';
import { createFilter, isTextType } from '../utils';
import { useClipboard } from './use-clipboard';

const buildEditor = ({ 
    copy, 
    paste,
    canvas,
    fillColor,
    fontFamily,
    setFontFamily,
    setFillColor,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    selectedObjects,
    strokeDashArray,
    setStrokeDashArray,
 }: BuildEditorProps): Editor => {
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
        onCopy: () => copy(),
        onPaste: () => paste(),
        changeImageFilter: (value: string) => {
            const objects = canvas.getActiveObjects();
            objects.forEach((obj) => {
                if (obj.type === 'image') {

                    const imageObject = obj as fabric.Image;

                    const effect = createFilter(value);

                    imageObject.filters = effect ? [effect] : [];
                    imageObject.applyFilters();
                    canvas.renderAll();
                }
            })
        },
        addImage: (value: string) => {
            fabric.Image.fromURL(
                value,
            (image) => {
                const workspace = getWorkspace();
                
                image.scaleToHeight(workspace?.height || 0);
                image.scaleToWidth(workspace?.width || 0);

                addToCanvas(image);
            },
            {
                crossOrigin: 'anonymous',
            })
        },
        delete: () => {
            canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));
            canvas.discardActiveObject();
            canvas.renderAll();
        },
        addText: (value, options) => {
            const object = new fabric.Textbox(value,
                {
                    ...TEXT_OPTIONS,
                    fill: fillColor,
                    ...options,
                });

                addToCanvas(object);
        },
        getActiveOpacity: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 1;
            };

            const value = selectedObject.get('opacity') || 1;
            return value;
        },
        changeFontWeight: (value: number) => {
            canvas.getActiveObjects().forEach((obj) => {
                if (isTextType(obj.type)) {
                    //@ts-ignore
                    // Faulty TS library, fontWeight property exists
                    obj.set({ fontWeight: value });
                }
            });
            canvas.renderAll();
        },
        changeFontLinethrough: (value: boolean) => {
            canvas.getActiveObjects().forEach((obj) => {
                if (isTextType(obj.type)) {
                    //@ts-ignore
                    // Faulty TS library, linethrough property exists
                    obj.set({ linethrough: value });
                }
            });
            canvas.renderAll();
        },
        getActiveFontLinethrough: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return false;
            }

            //@ts-ignore
            // Faulty TS library, fontStyle property exists
            const value = selectedObject.get('linethrough') || false;
            return value as boolean;
        },
        changeFontUnderline: (value: boolean) => {
            canvas.getActiveObjects().forEach((obj) => {
                if (isTextType(obj.type)) {
                    //@ts-ignore
                    // Faulty TS library, underline property exists
                    obj.set({ underline: value });
                }
            });
            canvas.renderAll();
        },
        getActiveFontUnderline: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return false;
            }

            //@ts-ignore
            // Faulty TS library, underline property exists
            const value = selectedObject.get('underline') || false;
            return value as boolean;
        },
        changeFontSize: (value: number) => {
            canvas.getActiveObjects().forEach((obj) => {
                if (isTextType(obj.type)) {
                    //@ts-ignore
                    //Faulty TS library, fontSize exists.
                    obj.set({ fontSize: value});
                }
            });

            canvas.renderAll();
        },
        getActiveFontSize: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return FONT_SIZE;
            }

            //@ts-ignore
            //Faulty TS library, textAlign exists.
            const value = selectedObject.get('fontSize') || FONT_SIZE;
            return value as number;
        },
        changeTextAlign: (value: string) => {
            canvas.getActiveObjects().forEach((obj) => {
                if (isTextType(obj.type)) {
                    //@ts-ignore
                    //Faulty TS library, textAlign exists.
                    obj.set({ textAlign: value});
                }
            });

            canvas.renderAll();
        },
        getActiveTextAlign: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 'left';
            }

            //@ts-ignore
            //Faulty TS library, textAlign exists.
            const value = selectedObject.get('textAlign') || 'left';
            return value as string;
        },
        changeFontStyle: (value: string) => {
            canvas.getActiveObjects().forEach((obj) => {
                if (isTextType(obj.type)) {
                    //@ts-ignore
                    // Faulty TS library, fontStyle property exists
                    obj.set({ fontStyle: value });
                }
            });
            canvas.renderAll();
        },
        getActiveFontStyle: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 'normal';
            }

            //@ts-ignore
            // Faulty TS library, fontStyle property exists
            const value = selectedObject.get('fontStyle') || 'normal';
            return value as string;
        },
        changeOpacity: (value: number) => {
            canvas.getActiveObjects().forEach((obj) => {
                obj.set({ opacity: value });
            });
            canvas.renderAll();
        },
        bringFoward: () => {
            canvas.getActiveObjects().forEach((obj) => {
                canvas.bringForward(obj);
            });

            canvas.renderAll();
            const workspace = getWorkspace();
            workspace?.sendToBack();
        },
        sendBackwards: () => {
            canvas.getActiveObjects().forEach((obj) => {
                canvas.sendBackwards(obj);
            });

            canvas.renderAll();
            const workspace = getWorkspace();
            workspace?.sendToBack();
        },
        changeFontFamily: (value: string) => {
            setFontFamily(value);
            canvas.getActiveObjects().forEach((obj) => {
                if (isTextType(obj.type)) {
                    obj._set('fontFamily', value);
                }
            });
            canvas.renderAll();
        },
        changeFillColor: (value: string) => {
            setFillColor(value);
            canvas.getActiveObjects().forEach((obj) => {
                obj.set({ fill: value });
            });
            canvas.renderAll();
        },
        changeStrokeColor: (value: string) => {
            setStrokeColor(value);
            canvas.getActiveObjects().forEach((obj) => {
                // Text types don't a stroke value, so we need to check it
                if (isTextType(obj.type)) {
                    obj.set({ fill: value });
                }
                obj.set({ stroke: value });
                canvas.renderAll();
            });
        },
        changeStrokeWidth: (value: number) => {
            setStrokeWidth(value);
            canvas.getActiveObjects().forEach((obj) => {
                obj.set({ strokeWidth: value });
            });
            canvas.renderAll();
        },
        changeStrokeDashArray: (value: number[]) => {
            setStrokeDashArray(value);
            canvas.getActiveObjects().forEach((obj) => {
                obj.set({ strokeDashArray: value });
            });
            canvas.renderAll();
        },
        addCircle: () => {
            const object = new fabric.Circle({
                ...CIRCLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });
            
            addToCanvas(object);
            canvas.renderAll();
        },
        addSoftRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 50,
                ry: 50,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });
            
            addToCanvas(object);
        },
        addRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });
            
            addToCanvas(object);
        },
        addTriangle: () => {
            const object = new fabric.Triangle({
                ...TRIANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
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
                    fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
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
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
                }
            );
        
            addToCanvas(object);
        },
        canvas,
        getActiveFontWeight: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return FONT_WEIGHT;
            }

            //@ts-ignore
            // Faulty TS library, fontFamily property exists
            const value = selectedObject.get('fontWeight') || FONT_WEIGHT;
            return value as number;
        },
        getActiveFontFamily: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return fontFamily;
            }

            //@ts-ignore
            // Faulty TS library, fontFamily property exists
            const value = selectedObject.get('fontFamily') || fontFamily;
            return value as string;
        },
        getActiveStrokeColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeColor;
            }

            const value = selectedObject.get('stroke') || strokeColor;
            return value;
        },
        getActiveFillColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return fillColor;
            }

            const value = selectedObject.get('fill') || fillColor;
            return value as string;
        },
        getActiveStrokeWidth: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeWidth;
            }

            const value = selectedObject.get('strokeWidth') || strokeWidth;
            return value;
        },
        getActiveStrokeDashArray: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeDashArray;
            }

            const value = selectedObject.get('strokeDashArray') || strokeDashArray;
            return value;
        },
        selectedObjects,
    };
};

export const useEditor = ({
    clearSelectionCallback
}: EditorHookProps) => {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

    const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
    const [fillColor, setFillColor] = useState(FILL_COLOR);
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
    const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

    const { copy, paste } = useClipboard({ canvas });
    
    useAutoResize({
        canvas,
        container,
    });

    useCanvasEvents({
        canvas,
        clearSelectionCallback,
        setSelectedObjects,
    });

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                copy,
                paste,
                canvas,
                fillColor,
                setFillColor,
                strokeColor,
                strokeDashArray,
                setStrokeColor,
                setStrokeDashArray,
                strokeWidth,
                setStrokeWidth,
                selectedObjects,
                fontFamily,
                setFontFamily,
            });
        };

        return undefined;
        
    }, [canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        selectedObjects,
        strokeDashArray,
        fontFamily,
        ]);


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
