/**
 * Created by 二哲 on 15/12/6.
 */
/*
* 不带参数指令
* v-tap=handler
* or
* 带参数指令
* v-tap=handler($index,el,$event)
*
* !!!新增!!!
* 把tapObj对象注册在原生event对象上
* event.tapObj拥有6个值
* pageX,pageY,clientX,clientY,distanceX,distanceY
* 后面2个分别的手指可能移动的位置(以后可用于拓展手势)
*
* */
;(function() {
    var vueTap = {};
    vueTap.install = function(Vue) {
        Vue.directive('tap', {
            isFn : true,
            acceptStatement : true,
            bind : function() {
                 //bind callback
            },
            update : function(fn) {
                var self = this;
                    self.tapObj = {};

                if(typeof fn !== 'function') {
                    return console.error('The param of directive "v-tap" must be a function!');
                }
                self.handler = function(e) { //This directive.handler
                    e.tapObj = self.tapObj;
                    fn.call(self,e);
                }
                this.el.addEventListener('touchstart',function(e) {

                    if(self.modifiers.stop)
                        e.stopPropagation();
                    if(self.modifiers.prevent)
                        e.preventDefault();
                    self.touchstart(e,self);
                },false);
                this.el.addEventListener('touchend',function(e) {
                    //e.preventDefault();
                    self.touchend(e,self,fn);
                },false);
            },
            unbind : function() {},
            isTap : function() {
                var self   = this;
                if(self.el.disabled){
                  return false;
                }
                var tapObj = this.tapObj;
                return this.time < 150 && Math.abs(tapObj.distanceX) < 4 && Math.abs(tapObj.distanceY) < 4;
            },
            touchstart : function(e,self) {
                var touches = e.touches[0];
                var tapObj = self.tapObj;
                tapObj.pageX = touches.pageX;
                tapObj.pageY = touches.pageY;
                tapObj.clientX = touches.clientX;
                tapObj.clientY = touches.clientY;
                self.time = +new Date();
            },
            touchend : function(e,self) {
                var touches = e.changedTouches[0];
                var tapObj = self.tapObj;
                self.time = +new Date() - self.time;
                tapObj.distanceX = tapObj.pageX - touches.pageX;
                tapObj.distanceY = tapObj.pageY - touches.pageY;

                if (self.isTap(tapObj))
                    self.handler(e);
            }
        });
    };

    if (typeof exports == "object") {
        module.exports = vueTap;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return vueTap })
    } else if (window.Vue) {
        window.vueTap = vueTap;
        Vue.use(vueTap);
    }

})();
