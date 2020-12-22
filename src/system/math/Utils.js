Math.lerp = function(start, end, amt, extrapolate = false){
    if(!extrapolate){return (1-amt)*start+amt*end}
    amt=Math.clamp(amt,0,1);
    return (1-amt)*start+amt*end
}

Math.clamp= function(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}