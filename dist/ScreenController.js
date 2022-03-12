"use strict";
exports.__esModule = true;
exports.ScreenController = void 0;
var electron_1 = require("electron");
var ScreenController = /** @class */ (function () {
    function ScreenController(browserWindow, initialScreenSize, initialScreenEdge) {
        if (initialScreenSize === void 0) { initialScreenSize = 'initial'; }
        if (initialScreenEdge === void 0) { initialScreenEdge = 'bottom-right'; }
        this.isScreenVisible = true;
        this.currentX = 0;
        this.currentY = 0;
        this.browserWindow = browserWindow;
        this.currentScreenEdge = initialScreenEdge;
        this.currentScreenSize = initialScreenSize;
        this.screenSizes = {
            initial: {
                width: 550,
                height: 450
            },
            large: {
                width: 550,
                height: 450
            }
        };
        var _a = this.browserWindow.getBounds(), x = _a.x, y = _a.y;
        this.windowPositionByScreenSize = {
            initial: { x: x, y: y },
            large: { x: x, y: y }
        };
        this.setCurrentWindowXY();
    }
    ScreenController.prototype.setWindowPositionByScreenSize = function () {
        this.windowPositionByScreenSize[this.currentScreenSize] = {
            x: this.currentX,
            y: this.currentY
        };
    };
    ScreenController.prototype.setCurrentWindowXY = function () {
        this.currentX = this.browserWindow.getBounds().x;
        this.currentY = this.browserWindow.getBounds().y;
    };
    ScreenController.prototype.memoLastWindowPosition = function () {
        this.setWindowPositionByScreenSize();
        this.setCurrentWindowXY();
    };
    ScreenController.prototype.getScreenSizeInPixels = function () {
        var _a = this.screenSizes[this.currentScreenSize], width = _a.width, height = _a.height;
        return {
            width: width,
            height: height
        };
    };
    ScreenController.prototype.setWindowSize = function (size) {
        if (this.currentScreenSize === size) {
            return;
        }
        this.currentScreenSize = size;
        this.memoLastWindowPosition();
        var _a = this.getScreenSizeInPixels(), width = _a.width, height = _a.height;
        var _b = this.windowPositionByScreenSize[size], x = _b.x, y = _b.y;
        this.browserWindow.setMaximumSize(width, height);
        this.browserWindow.setBounds({ width: width, height: height, x: x, y: y }, true);
    };
    ScreenController.prototype.calculateScreenMovement = function (movement) {
        var edgeMovements = {
            'top-right': {
                left: 'top-left',
                bottom: 'bottom-right'
            },
            'top-left': {
                right: 'top-right',
                bottom: 'bottom-left'
            },
            'bottom-right': {
                left: 'bottom-left',
                top: 'top-right'
            },
            'bottom-left': {
                right: 'bottom-right',
                top: 'top-left'
            }
        };
        return (edgeMovements[this.currentScreenEdge][movement] || this.currentScreenEdge);
    };
    ScreenController.prototype.moveWindowToScreenEdge = function (edge) {
        if (edge === void 0) { edge = this.currentScreenEdge; }
        this.currentScreenEdge = edge;
        var _a = this.browserWindow.getBounds(), x = _a.x, y = _a.y;
        var display = electron_1.screen.getDisplayNearestPoint({ x: x, y: y });
        var bounds = { x: display.bounds.x, y: display.bounds.y };
        var _b = this.getScreenSizeInPixels(), width = _b.width, height = _b.height;
        var SCREEN_PADDING = 24;
        switch (edge) {
            case 'top-left':
                bounds.x += SCREEN_PADDING;
                bounds.y += SCREEN_PADDING;
                break;
            case 'bottom-left':
                bounds.x += SCREEN_PADDING;
                bounds.y += display.size.height - height - SCREEN_PADDING;
                break;
            case 'top-right':
                bounds.x += display.size.width - width - SCREEN_PADDING;
                bounds.y += SCREEN_PADDING;
                break;
            case 'bottom-right':
                bounds.x += display.size.width - width - SCREEN_PADDING;
                bounds.y += display.size.height - height - SCREEN_PADDING;
                break;
        }
        this.browserWindow.setBounds(bounds, true);
    };
    ScreenController.prototype.toggleWindowSize = function () {
        var size = this.currentScreenSize === 'initial' ? 'large' : 'initial';
        this.setWindowSize(size);
    };
    ScreenController.prototype.setActiveDisplay = function (displayId) {
        var display = electron_1.screen
            .getAllDisplays()
            .find(function (display) { return display.id === displayId; });
        if (display) {
            this.browserWindow.setBounds(display.workArea);
            this.moveWindowToScreenEdge();
        }
    };
    return ScreenController;
}());
exports.ScreenController = ScreenController;
//# sourceMappingURL=ScreenController.js.map