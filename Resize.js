/**  Resize
 * methods:
    * stop
    * start
    * reInit
    * revert
 * settings: (as object)
    * selector ***
    * sides (default: ["left", "right", "bottom", "top"]) (as array)
    * minWidth (default: no limit)
    * maxWidth (default: no limit)
    * minHeight (default: no limit)
    * maxHeight (default: no limit)
 * callbacks:
    * onResize(el, side, newPos, oldPos, mousePos)
    * onResizeDone(el, side, newPos, oldPos, mousePos)
 * **/
function Resize(settings,onResize,onResizeDone){
    this.elements = settings.selector;
    this.sides = settings.sides ? settings.sides : ["left", "right", "bottom", "top"]; // bottom, top, left, right
    this.minWidth = settings.minWidth ? settings.minWidth : -Infinity;
    this.maxWidth = settings.maxWidth ? settings.maxWidth : Infinity;
    this.minHeight = settings.minHeight ? settings.minHeight : -Infinity;
    this.maxHeight = settings.maxHeight ? settings.maxHeight : Infinity;
    this.onResize = onResize;
    this.onResizeDone = onResizeDone;
    resize_init(this);
}
function resize_init(that) {
    let m_down=false, target, pos={}, side="";
    function resize(e) {
        e.preventDefault();
        if(m_down) {
            let el = target.parentNode;
            let classes = target.className.split(" ");
            side = "";
            for (let i=0; i<classes.length; i++) {
                let _c=classes[i];
                if (_c === "resize_left")
                    side = "left";
                else if (_c === "resize_right")
                    side = "right";
                else if (_c === "resize_top")
                    side = "top";
                else if (_c === "resize_bottom")
                    side = "bottom";
            }
            if(side==="left" && (parseFloat(pos.width)-e.pageX+pos.x>=that.minWidth && parseFloat(pos.width)-e.pageX+pos.x<=that.maxWidth)){
                el.style.left = parseFloat(pos.left)+e.pageX-pos.x+ "px";
                el.style.width = parseFloat(pos.width)-e.pageX+pos.x+ "px";
            }
            else if(side==="right" &&
                (parseFloat(pos.width)+e.pageX-pos.x>=that.minWidth && parseFloat(pos.width)+e.pageX-pos.x<=that.maxWidth)){
                el.style.width = parseFloat(pos.width)+e.pageX-pos.x+ "px";
            }
            else if(side==="top" &&
                (parseFloat(pos.height)-e.pageY+pos.y>=that.minHeight && parseFloat(pos.height)-e.pageY+pos.y<=that.maxHeight)){
                el.style.top = parseFloat(pos.top)+e.pageY-pos.y+ "px";
                el.style.height = parseFloat(pos.height)-e.pageY+pos.y+ "px";
            }
            else if(side==="bottom" &&
                (parseFloat(pos.height)+e.pageY-pos.y>=that.minHeight && parseFloat(pos.height)+e.pageY-pos.y<=that.maxHeight)){
                el.style.height = parseFloat(pos.height)+e.pageY-pos.y+ "px";
            }
            that.onResize && that.onResize(el, side, {
                    left:window.getComputedStyle(el).left,
                    top:window.getComputedStyle(el).top,
                    width:window.getComputedStyle(el).width,
                    height:window.getComputedStyle(el).height,
                }, {
                    width:pos.width,
                    height:pos.height,
                    left:pos.left,
                    top:pos.top
                }, {
                    x: e.pageX+"px",
                    y: e.pageY+"px"
                });
        }
    }
    function resize_mousedown(e) {
        e.preventDefault();
        m_down=true;
        target=e.target;
        pos={
            x: e.pageX,
            y: e.pageY,
            height: window.getComputedStyle(target.parentNode).height,
            width: window.getComputedStyle(target.parentNode).width,
            left: window.getComputedStyle(target.parentNode).left,
            top: window.getComputedStyle(target.parentNode).top
        };
        e.stopPropagation();
    }
    function resize_mouseup(e) {
        e.preventDefault();
        if(m_down){
            that.onResizeDone && that.onResizeDone(target.parentNode, side, {
                left:window.getComputedStyle(target.parentNode).left,
                top:window.getComputedStyle(target.parentNode).top,
                width:window.getComputedStyle(target.parentNode).width,
                height:window.getComputedStyle(target.parentNode).height,
            }, {
                width:pos.width,
                height:pos.height,
                left:pos.left,
                top:pos.top
            }, {
                x: e.pageX+"px",
                y: e.pageY+"px"
            });
            m_down=false;
            target="";
            pos={};
            let handles = document.querySelectorAll(".resize_el");
            for(let el of handles) {
                let classes = el.className.split(" ");
                for (let i=0; i<classes.length; i++) {
                    let _c=classes[i];
                    if (_c === "resize_left")
                        el.style.height= window.getComputedStyle(el.parentNode).height;
                    else if (_c === "resize_right")
                        el.style.height= window.getComputedStyle(el.parentNode).height;
                    else if (_c === "resize_top")
                        el.style.width= window.getComputedStyle(el.parentNode).width;
                    else if (_c === "resize_bottom")
                        el.style.width= window.getComputedStyle(el.parentNode).width;
                }
            }
        }
    }
    let elements = document.querySelectorAll(that.elements);
    for(let el of elements) {
        if(that.sides.indexOf("left") > -1) {
            let resize_left = document.createElement("DIV");
            resize_left.setAttribute("class", "resize_el resize_left");
            resize_left.style.left = "0px";
            resize_left.style.top = "0px";
            resize_left.style.width = "5px";
            resize_left.style.height = window.getComputedStyle(el).height;
            resize_left.style.cursor = "w-resize";
            resize_left.style.position = "absolute";
            el.appendChild(resize_left);
        }
        if(that.sides.indexOf("right") > -1) {
            let resize_right = document.createElement("DIV");
            resize_right.setAttribute("class", "resize_el resize_right");
            resize_right.style.right = "0px";
            resize_right.style.top = "0px";
            resize_right.style.width = "5px";
            resize_right.style.height = window.getComputedStyle(el).height;
            resize_right.style.cursor = "e-resize";
            resize_right.style.position = "absolute";
            el.appendChild(resize_right);
        }
        if(that.sides.indexOf("top") > -1) {
            let resize_top = document.createElement("DIV");
            resize_top.setAttribute("class", "resize_el resize_top");
            resize_top.style.left = "0px";
            resize_top.style.top = "0px";
            resize_top.style.width = window.getComputedStyle(el).width;
            resize_top.style.height = "5px";
            resize_top.style.cursor = "n-resize";
            resize_top.style.position = "absolute";
            el.appendChild(resize_top);
        }
        if(that.sides.indexOf("bottom") > -1) {
            let resize_bottom = document.createElement("DIV");
            resize_bottom.setAttribute("class", "resize_el resize_bottom");
            resize_bottom.style.left = "0px";
            resize_bottom.style.bottom = "0px";
            resize_bottom.style.width = window.getComputedStyle(el).width;
            resize_bottom.style.height = "5px";
            resize_bottom.style.cursor = "s-resize";
            resize_bottom.style.position = "absolute";
            el.appendChild(resize_bottom);
        }
    }
    let handles = document.querySelectorAll(".resize_el");
    for(let el of handles) {
        el.addEventListener('mousedown', resize_mousedown);
        el.resize_mousedown=resize_mousedown;
    }
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', resize_mouseup);
    document.resize=resize;
    document.resize_mouseup=resize_mouseup;
}
function resize_stop() {
    let handles = document.querySelectorAll(".resize_el");
    for(let el of handles) {
        el.removeEventListener('mousedown', el.resize_mousedown);
        el.style.display="none";
    }
    document.removeEventListener('mousemove', document.resize);
    document.removeEventListener('mouseup', document.resize_mouseup);
}
function resize_start() {
    let handles = document.querySelectorAll(".resize_el");
    for(let el of handles) {
        el.removeEventListener('mousedown', el.resize_mousedown);
        el.addEventListener('mousedown', el.resize_mousedown);
        el.style.display="";
    }
    document.removeEventListener('mousemove', document.resize);
    document.addEventListener('mousemove', document.resize);
    document.removeEventListener('mouseup', document.resize_mouseup);
    document.addEventListener('mouseup', document.resize_mouseup);
}
function resize_remove() {
    let handles = document.querySelectorAll(".resize_el");
    for(let handle of handles) {
        handle.removeEventListener('mousedown', handle.resize_mousedown);
        handle.remove();
    }
    document.removeEventListener('mousemove', document.resize);
    document.removeEventListener('mouseup', document.resize_mouseup);
}
Resize.prototype = {
    reInit: function(){
        resize_stop();
        resize_init(this);
    },
    stop: function () {
        resize_stop();
    },
    start: function () {
        resize_start();
    },
    remove: function () {
        resize_remove();
    },
    revert: function (el,side,pos) {
        function transitionEnd(){
            el.removeEventListener('transitionend',transitionEnd);
            el.style.transition= "";
        }
        el.style.transition= "0.5s";
        el.addEventListener('transitionend',transitionEnd);
        el.style.left = pos.left;
        el.style.top = pos.top;
        el.style.width = pos.width;
        el.style.height = pos.height;
        let handles = el.querySelectorAll(".resize_el");
        for(let handle of handles) {
            let classes = handle.className.split(" ");
            for (let i=0; i<classes.length; i++) {
                let _c=classes[i];
                if (_c === "resize_left")
                    handle.style.height= window.getComputedStyle(handle.parentNode).height;
                else if (_c === "resize_right")
                    handle.style.height= window.getComputedStyle(handle.parentNode).height;
                else if (_c === "resize_top")
                    handle.style.width= window.getComputedStyle(handle.parentNode).width;
                else if (_c === "resize_bottom")
                    handle.style.width= window.getComputedStyle(handle.parentNode).width;
            }
        }
    }
};
/** todo:
        * check bind events
    :todo
 **/