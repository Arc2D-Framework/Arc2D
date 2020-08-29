//
// window._achild = Element.prototype.appendChild;
// Element.prototype.appendChild = function(el) {
//     return window._achild.apply(this, [el.element?el.element:el]);
// };