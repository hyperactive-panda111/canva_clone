import { fabric } from 'fabric';
import { useCallback, useMemo, useRef, useState } from "react";

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
    JSON_KEYS, 
    RECTANGLE_OPTIONS, 
    STROKE_COLOR, 
    STROKE_DASH_ARRAY, 
    STROKE_WIDTH, 
    TEXT_OPTIONS, 
    TRIANGLE_OPTIONS 
} from '../types';

import { useAutoResize } from './use-auto-resize';
import { useCanvasEvents } from './use-canvas-events';
import { createFilter, downloadFile, isTextType, transformText } from '../utils';
import { useClipboard } from './use-clipboard';
import { useHistory } from './use-history';
import { useHotkeys } from './use-hotkeys';
import { useWindowEvents } from './use-window-events';
import { useLoadState } from './use-load-state';

const buildEditor = ({ 
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    autoZoom,
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

    const generateSaveOptions = () => {
        const { width, height, left, top } = getWorkspace() as fabric.Rect;
        
        return {
            name: 'Image',
            format: 'png',
            quality: 1,
            width,
            height,
            left, 
            top,
        };
    };
    
    const saveJpg = () => {
	const options = generateSaveOptions();

	canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
	const dataUrl = canvas.toDataURL(options);

	downloadFile(dataUrl, 'jpg');
	autoZoom();
};

const savePng = () => {
	const options = generateSaveOptions();

	canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
	const dataUrl = canvas.toDataURL(options);

	downloadFile(dataUrl, 'png');
	autoZoom();
};

const saveSvg = () => {
	const options = generateSaveOptions();

	canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
	const dataUrl = canvas.toDataURL(options);

	downloadFile(dataUrl, 'svg');
	autoZoom();
};


const saveJson = async () => {
	const dataUrl = canvas.toJSON(JSON_KEYS);

	await transformText(dataUrl.objects);
	const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
		JSON.stringify(dataUrl, null, '\t'),
	)}`;
    downloadFile(fileString, 'json');
};

const loadJson = (json: string) => {
	const data = JSON.parse(json);

	canvas.loadFromJSON(data, () => {
		autoZoom();
	});
};

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
        saveJpg,
        savePng,
        saveSvg,
        saveJson,
        loadJson,
        canUndo,
        canRedo,
        autoZoom,
        getWorkspace,
        zoomIn: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio += 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
                new fabric.Point(center.left, center.top),
                zoomRatio > 1 ? 1 : zoomRatio,
            );
        },
        zoomOut: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio -= 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
                new fabric.Point(center.left, center.top),
                zoomRatio < 0.2 ? 0.2 : zoomRatio,
            );
        },
        changeSize: (size: { width: number; height: number }) => {
            const workspace = getWorkspace();

            workspace?.set(size);
            autoZoom();
            //TODO: Save feature
            save();
        },
        changeBackground: (value: string) => {
            const workspace = getWorkspace();
            workspace?.set({ fill: value });
            canvas.renderAll();
            //TODO: Save feature
            save();
        },
        enableDrawingMode: () => {
            canvas.discardActiveObject();
            canvas.renderAll();
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.color = strokeColor;
            canvas.freeDrawingBrush.width = strokeWidth;
        },
        disableDrawingMode: () => {
            canvas.isDrawingMode = false;
        },
        onUndo: () => undo(),
        onRedo: () => redo(),
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
            });
            canvas.freeDrawingBrush.color = value;
            canvas.renderAll();
        },
        changeStrokeWidth: (value: number) => {
            setStrokeWidth(value);
            canvas.getActiveObjects().forEach((obj) => {
                obj.set({ strokeWidth: value });
            });
            canvas.freeDrawingBrush.width = value;
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
    defaultState,
    defaultWidth,
    defaultHeight,
    clearSelectionCallback,
    saveCallback
}: EditorHookProps) => {
    const initialState = useRef(defaultState);
    const initialWidth = useRef(defaultWidth);
    const initialHeight = useRef(defaultHeight);
     
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

    const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
    const [fillColor, setFillColor] = useState(FILL_COLOR);
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
    const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

    const { copy, paste } = useClipboard({ canvas });
    
    const { autoZoom} = useAutoResize({
        canvas,
        container,
    });

    const { 
        save, 
        canRedo, 
        canUndo, 
        redo, 
        undo, 
        canvasHistory, 
        setHistoryIndex,
     } = useHistory({ 
        canvas,
        saveCallback,
     });

    useCanvasEvents({ 
        save,
        canvas,
        clearSelectionCallback,
        setSelectedObjects,
    });

    useWindowEvents();
    
    useHotkeys({
        canvas,
        undo,
        redo,
        save,
        paste,
        copy,
    });

    useLoadState({
        canvas,
        autoZoom,
        initialState,
        canvasHistory,
        setHistoryIndex
    });

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                save,
                undo,
                redo,
                canUndo,
                canRedo,
                autoZoom,
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
        
    }, [
        save,
        undo,
        redo,
        canUndo,
        canRedo,
        autoZoom,
        canvas,
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
	fabric.Object.prototype.set({
		cornerColor: '#FFF',
		cornerStyle: 'circle',
		borderColor: '#3b82f6',
		borderScaleFactor: 1.5,
		transparentCorners: false,
		borderOpacityWhenMoving: 1,
		cornerStrokeColor: '#3b82f6',
	});
	    
        const initialWorkspace = new fabric.Rect({
            width: initialWidth.current,
            height: initialHeight.current,
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

        const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
        canvasHistory.current = [currentState];
        setHistoryIndex(0);
        
    }, []);

    return { init, editor };
}
