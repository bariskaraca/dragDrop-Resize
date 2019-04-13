/**  DragDrop
 * methods:
    * stop
    * reInit
 * settings: (as object)
    * dragSelector ***
    * dropSelector
    * direction  (horizontal || vertical)
    * revert (revert animation default: true)
    * clone (default: true)
 * callbacks:
    * onDrag(el, newPos, oldPos, mousePos, onDropZone)
    * onDrop(el, newPos, oldPos, mousePos, onDropZone)
 * **/
function DragDrop(settings,onDrag,onDrop){
    this.dragEl = settings.dragSelector;
    this.dropEl = settings.dropSelector ? settings.dropSelector : "";
    this.direction = settings.direction ? settings.direction : false;
    this.revert = settings.revert === false ? settings.revert : true;
    this.clone = settings.clone === false ? settings.clone : true;
    this.onDrag = onDrag;
    this.onDrop = onDrop;

    dragdrop_init(this);
}
function dragdrop_init(that) {
    let startPos = {x:0,y:0}, originalPos = {x:0,y:0}, elements = document.querySelectorAll(that.dragEl), dragging = false, droppable = false;
    let dropElements=[],target="",draggedEl = "";
    if(that.dropEl !== "")
        dropElements = document.querySelectorAll(that.dropEl);
    for(let el of elements) {
        function startDragging(e) {
            e.preventDefault();
            function move(e) {
                e.preventDefault();
                if(dragging) {
                    if ('vertical' !== that.direction)
                        draggedEl.style.left = (e.pageX - startPos.x) + 'px';
                    if ('horizontal' !== that.direction)
                        draggedEl.style.top = (e.pageY - startPos.y) + 'px';
                    let pos = draggedEl.getBoundingClientRect();
                    draggedEl.hidden = true;
                    let target1 = document.elementFromPoint(pos.left, pos.top);
                    let target2 = document.elementFromPoint(pos.left + pos.width, pos.top + pos.height);
                    if (target1 === target2) {
                        for (let dropEl of dropElements) {
                            if (dropEl === target1) {
                                droppable = true;
                                target = dropEl;
                            }
                        }
                    }
                    else {
                        droppable = false;
                    }
                    draggedEl.hidden = false;
                    that.onDrag && that.onDrag(
                        el, startPos,
                        {
                            x: startPos.x+"px",
                            y: startPos.y+"px"
                        },
                        {
                            x: draggedEl.style.left,
                            y: draggedEl.style.top
                        },
                        {
                            x: e.pageX+"px",
                            y: e.pageY+"px"
                        },
                        droppable);
                }
            }
            function mouseUp(e) {
                e.preventDefault();
                if (dragging) {
                    dragging = false;
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', mouseUp);
                    if(that.dropEl && draggedEl.parentNode !== target && droppable){
                        draggedEl.style.position= "absolute";
                        draggedEl.style.left= parseFloat(draggedEl.style.left)-parseFloat(window.getComputedStyle(target).getPropertyValue("left"))+"px";
                        draggedEl.style.top= parseFloat(draggedEl.style.top)-parseFloat(window.getComputedStyle(target).getPropertyValue("top"))+"px";
                        target.appendChild(draggedEl);
                        that.onDrop && that.onDrop(
                            draggedEl,
                            {x:draggedEl.style.left,y:draggedEl.style.top},
                            {
                                x:startPos.x+"px",
                                y:startPos.y+"px"
                            },
                            {
                                x:e.pageX+"px",
                                y:e.pageY+"px"
                            },
                            true);
                    }
                    else if(!that.dropEl)
                        that.onDrop && that.onDrop(
                            draggedEl,
                            {x:draggedEl.style.left,y:draggedEl.style.top},
                            {
                                x:startPos.x+"px",
                                y:startPos.y+"px"
                            },
                            {
                                x:e.pageX+"px",
                                y:e.pageY+"px"
                            },
                            true);
                    else if(!droppable){
                        if(that.revert){
                            draggedEl.style.transition= "0.5s";
                            draggedEl.addEventListener('transitionend',transitionEnd);
                        }
                        else {
                            that.onDrop && that.onDrop(
                                draggedEl,
                                {x:draggedEl.style.left,y:draggedEl.style.top},
                                {
                                    x:startPos.x+"px",
                                    y:startPos.y+"px"
                                },
                                {
                                    x:e.pageX+"px",
                                    y:e.pageY+"px"
                                },
                                false);
                        }
                        draggedEl.style.position= "fixed";
                        draggedEl.style.left= originalPos.x+"px";
                        draggedEl.style.top= originalPos.y+"px";
                        function transitionEnd(){
                            draggedEl.removeEventListener('transitionend',transitionEnd);
                            draggedEl.style.transition= "";
                            if(that.clone){
                                draggedEl.remove();
                            }
                            that.onDrop && that.onDrop(
                                draggedEl,
                                {x:draggedEl.style.left,y:draggedEl.style.top},
                                {
                                    x:startPos.x+"px",
                                    y:startPos.y+"px"
                                },
                                {
                                    x:e.pageX+"px",
                                    y:e.pageY+"px"
                                },
                                false);
                        }
                    }
                    draggedEl.style.zIndex = 1000;
                }
            }
            if (e.currentTarget instanceof HTMLElement || e.currentTarget instanceof SVGElement) {
                dragging = true;
                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', mouseUp);
                if(that.clone){
                    draggedEl=el.cloneNode(true);
                    document.body.appendChild(draggedEl);
                }
                else
                    draggedEl=el;
                // let left = el.style.left ? parseFloat(el.style.left) : 0;
                // let top = el.style.top ? parseFloat(el.style.top) : 0;
                let left = parseFloat(window.getComputedStyle(draggedEl).getPropertyValue("left"));
                let top = parseFloat(window.getComputedStyle(draggedEl).getPropertyValue("top"));
                startPos.x = e.pageX - left;
                startPos.y = e.pageY - top;
                draggedEl.style.zIndex = 1001;
                originalPos.x = left;
                originalPos.y = top;
            }
        }
        el.addEventListener('mousedown', startDragging);
        el.startDrag=startDragging;
    }
}
function stop(that) {
    let elements = document.querySelectorAll(that.dragEl);
    for(let el of elements) {
        el.removeEventListener('mousedown', el.startDrag);
    }
}
DragDrop.prototype = {
    reInit: function(){
        stop(this);
        dragdrop_init(this);
    },
    stop: function () {
        stop(this);
    }
};
/** todo:
        * check bind events
    :todo
 **/