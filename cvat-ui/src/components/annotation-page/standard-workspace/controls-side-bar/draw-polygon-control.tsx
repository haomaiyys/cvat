// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Popover from 'antd/lib/popover';
import Icon from '@ant-design/icons';

import { Canvas } from 'cvat-canvas-wrapper';
import { PolygonIcon } from 'icons';
import { ShapeType } from 'reducers/interfaces';

import DrawShapePopoverContainer from 'containers/annotation-page/standard-workspace/controls-side-bar/draw-shape-popover';
import withVisibilityHandling from './handle-popover-visibility';

interface Props {
    canvasInstance: Canvas;
    isDrawing: boolean;
}

function DrawPolygonControl(props: Props): JSX.Element {
    const { canvasInstance, isDrawing } = props;
    const CustomPopover = withVisibilityHandling(Popover, 'draw-polygon');

    const dynamcPopoverPros = isDrawing ?
        {
            overlayStyle: {
                display: 'none',
            },
        } :
        {};

    const dynamicIconProps = isDrawing ?
        {
            className: 'cvat-draw-polygon-control cvat-active-canvas-control',
            onClick: (): void => {
                canvasInstance.draw({ enabled: false });
            },
        } :
        {
            className: 'cvat-draw-polygon-control',
        };

    return (
        <CustomPopover
            {...dynamcPopoverPros}
            overlayClassName='cvat-draw-shape-popover'
            placement='right'
            content={<DrawShapePopoverContainer shapeType={ShapeType.POLYGON} />}
        >
            <Icon {...dynamicIconProps} component={PolygonIcon} />
        </CustomPopover>
    );
}

export default React.memo(DrawPolygonControl);
