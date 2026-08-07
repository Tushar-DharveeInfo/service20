
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { IResponsiveDeviceView } from '../../allinterface/deviceview/IResponsiveDeviceView'
import { CreateSVGForPreview, SelectModule, SelectSlot } from './ResponsiveDeviceViewHelperFunctions'
import { Label } from '../../basic/label/Label'
import { ITreeNode } from '../../allinterface/tree/ITreeControl'

const ResponsiveDeviceView = (props: IResponsiveDeviceView) => {
    const [svgViewData, setSvgViewData] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null);
    const saveAsImageRef = useRef(props.SaveAsImage);
    const lastHighlightedKeyRef = useRef('');

    useEffect(() => {
        saveAsImageRef.current = props.SaveAsImage;
    }, [props.SaveAsImage])

    const selectSlotAndModule = useCallback((selectedNode: ITreeNode, DeviceViewId?: string) => {
        const container = containerRef.current;
        if (!container) return;

        container.querySelectorAll('.SVGSel').forEach((element) => {
            element.classList.remove('SVGSel');
        });

        if (selectedNode?.treetype?.toLowerCase() === "device" && DeviceViewId) {
            // calling select module function sara's code
            SelectModule(DeviceViewId);
        } else if (selectedNode?.treetype?.toLowerCase() === "deviceslot"
            || selectedNode.treetype?.toLowerCase() === "devicenetworkport"
            || selectedNode.treetype?.toLowerCase() === "slot"
            || selectedNode.treetype?.toLowerCase() === "networkport"
            || selectedNode.treetype?.toLowerCase() === "devicepowerport"
            || selectedNode.treetype?.toLowerCase() === "powerport"
        ) {
            // calling select slot function sara's code
            SelectSlot(selectedNode?.NodeEntID)
        }
    }, [])

    useEffect(() => {
        let isCurrent = true;

        if (props.imageSource) {
            const craeteSvg = async (source: string) => {
                // calling create svg function sara's code 
                const svgData: string = CreateSVGForPreview(source);

                if (!isCurrent) return;

                if ((props.outputFormat === "SVG" || props.outputFormat === "PNG") && svgData) {
                    function svgToBlobUrl(svgString: string): {
                        url: string;
                        revoke: () => void;
                    } {
                        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                        const url = URL.createObjectURL(blob);

                        return {
                            url,
                            revoke: () => URL.revokeObjectURL(url),
                        };
                    }
                    function svgToPngBlobUrl(svgString: string): Promise<{
                        url: string;
                        revoke: () => void;
                    }> {
                        return new Promise((resolve, reject) => {
                            const img = new Image();

                            const svgBlob = new Blob([svgString], {
                                type: "image/svg+xml;charset=utf-8",
                            });

                            const svgUrl = URL.createObjectURL(svgBlob);

                            img.onload = () => {
                                const canvas = document.createElement("canvas");
                                canvas.width = img.width;
                                canvas.height = img.height;

                                const ctx = canvas.getContext("2d");
                                if (!ctx) {
                                    reject("Canvas not supported");
                                    return;
                                }

                                ctx.drawImage(img, 0, 0);

                                canvas.toBlob((blob) => {
                                    if (!blob) {
                                        reject("PNG conversion failed");
                                        return;
                                    }

                                    const pngUrl = URL.createObjectURL(blob);

                                    // cleanup SVG URL
                                    URL.revokeObjectURL(svgUrl);

                                    resolve({
                                        url: pngUrl,
                                        revoke: () => URL.revokeObjectURL(pngUrl),
                                    });
                                }, "image/png");
                            };

                            img.onerror = reject;
                            img.src = svgUrl;
                        });
                    }
                    if (props.outputFormat === "SVG") {
                        const { url } = svgToBlobUrl(svgData);
                        saveAsImageRef.current?.(url)
                    } else {
                        const { url, revoke } = await svgToPngBlobUrl(svgData);
                        if (!isCurrent) {
                            revoke();
                            return;
                        }
                        saveAsImageRef.current?.(url)
                    }
                } else if (svgData) {
                    setSvgViewData(svgData)

                } else {
                    setSvgViewData(null)
                }
            }
            craeteSvg(props.imageSource)
        } else {
            setSvgViewData(null)
        }

        return () => {
            isCurrent = false;
        }
    }, [props.imageSource, props.outputFormat])

    useEffect(() => {
        if (!svgViewData || !props.selectedNode || !containerRef.current) return;
        if (props.selectedTabName && props.tabName !== props.selectedTabName) return;

        const selectedNode = props.selectedNode;
        const highlightKey = [
            props.tabName,
            props.selectedTabName,
            selectedNode.treetype,
            selectedNode.NodeEntID,
            props.selectedDeviceViewId,
            props.imageSource
        ].join('|');

        if (lastHighlightedKeyRef.current === highlightKey) return;

        lastHighlightedKeyRef.current = highlightKey;
        selectSlotAndModule(selectedNode, props.selectedDeviceViewId)
    }, [
        props.imageSource,
        props.selectedDeviceViewId,
        props.selectedNode?.NodeEntID,
        props.selectedNode?.treetype,
        props.selectedNode,
        props.selectedTabName,
        props.tabName,
        selectSlotAndModule,
        svgViewData
    ])

    const handleMouseEvent = (event: React.MouseEvent) => {

        if (event.target instanceof SVGElement) {
            const clientX: number = event.clientX;
            const clientY: number = event.clientY;
            const clickElement = document.elementFromPoint(clientX, clientY);
            if (props.handleMouse) {
                props.handleMouse(event, clickElement?.innerHTML)
            }

        }
    }
    const handleDoubleClickMouseEvent = (event: React.MouseEvent) => {
        if (event.target instanceof SVGElement) {
            const clientX: number = event.clientX;
            const clientY: number = event.clientY;
            const clickElement = document.elementFromPoint(clientX, clientY);
            if (props.handleMouseDoubleClick) {
                props.handleMouseDoubleClick(event, clickElement?.innerHTML)
            }

        }
    }
    return (
        <div className={`nz-devicePreview-div ${props.className}`} key={props.uniqueName}>
            <TransformWrapper disabled={props.allowZoom}>
                <TransformComponent >
                    {svgViewData && <div ref={containerRef} className={`nz-img-container ${props.className} ${props.uniqueName}`} id="nz-img-svg-container"
                        dangerouslySetInnerHTML={{ __html: typeof svgViewData === "string" ? svgViewData : "" }}
                        onClick={(event: React.MouseEvent) => { handleMouseEvent(event) }}
                        onDoubleClick={(event: React.MouseEvent) => { handleDoubleClickMouseEvent(event) }}
                    ></div>}
                </TransformComponent>
            </TransformWrapper>
            <div className='nz-devicepreviw-label'>
                <Label uniqueName="devicePreView" label={props.label} />
            </div>
        </div >
    )
}


export { ResponsiveDeviceView }
