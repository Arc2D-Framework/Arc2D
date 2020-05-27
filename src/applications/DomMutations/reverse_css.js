

var ReverseCssSelector = {}
ReverseCssSelector.DOMNodePathStep = function(value, optimized)
{
    this.value = value;
    this.optimized = optimized || false;
}
ReverseCssSelector.DOMNodePathStep.prototype = {
    /**
     * @override
     * @return {string}
     */
    toString: function()
    {
        return this.value;
    }
}
ReverseCssSelector.DOMPresentationUtils = {}

ReverseCssSelector.DOMPresentationUtils.cssPath = function(node, optimized)
{
    if (node.nodeType !== Node.ELEMENT_NODE)
        return "";
    var steps = [];
    var contextNode = node;
    while (contextNode) {
        var step = ReverseCssSelector.DOMPresentationUtils._cssPathStep(contextNode, !!optimized, contextNode === node);
        if (!step)
            break; // Error - bail out early.
        steps.push(step);
        if (step.optimized)
            break;
        contextNode = contextNode.parentNode;
    }
    steps.reverse();
    return steps.join(" > ");
}

ReverseCssSelector.DOMPresentationUtils._cssPathStep = function(node, optimized, isTargetNode)
{
    if (node.nodeType !== Node.ELEMENT_NODE)
        return null;
    var id = node.getAttribute("id");
    if (optimized) {
        if (id)
            return new ReverseCssSelector.DOMNodePathStep(idSelector(id), true);
        var nodeNameLower = node.nodeName.toLowerCase();
        if (nodeNameLower === "body" || nodeNameLower === "head" || nodeNameLower === "html")
            return new ReverseCssSelector.DOMNodePathStep(node.tagName.toLowerCase(), true);
    }
    var nodeName = node.tagName.toLowerCase();
    if (id)
        return new ReverseCssSelector.DOMNodePathStep(nodeName + idSelector(id), true);
    var parent = node.parentNode;
    if (!parent || parent.nodeType === Node.DOCUMENT_NODE)
        return new ReverseCssSelector.DOMNodePathStep(nodeName, true);
    /**
     * @param {!ReverseCssSelector.DOMNode} node
     * @return {!Array.<string>}
     */
    function prefixedElementClassNames(node)
    {
        var classAttribute = node.getAttribute("class");
        if (!classAttribute)
            return [];
        return classAttribute.split(/\s+/g).filter(Boolean).map(function(name) {
            // The prefix is required to store "__proto__" in a object-based map.
            return "$" + name;
        });
    }
    /**
     * @param {string} id
     * @return {string}
     */
    function idSelector(id)
    {
        return "#" + escapeIdentifierIfNeeded(id);
    }
    /**
     * @param {string} ident
     * @return {string}
     */
    function escapeIdentifierIfNeeded(ident)
    {
        if (isCSSIdentifier(ident))
            return ident;
        var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
        var lastIndex = ident.length - 1;
        return ident.replace(/./g, function(c, i) {
            return ((shouldEscapeFirst && i === 0) || !isCSSIdentChar(c)) ? escapeAsciiChar(c, i === lastIndex) : c;
        });
    }
    /**
     * @param {string} c
     * @param {boolean} isLast
     * @return {string}
     */
    function escapeAsciiChar(c, isLast)
    {
        return "\\" + toHexByte(c) + (isLast ? "" : " ");
    }
    /**
     * @param {string} c
     */
    function toHexByte(c)
    {
        var hexByte = c.charCodeAt(0).toString(16);
        if (hexByte.length === 1)
          hexByte = "0" + hexByte;
        return hexByte;
    }
    /**
     * @param {string} c
     * @return {boolean}
     */
    function isCSSIdentChar(c)
    {
        if (/[a-zA-Z0-9_-]/.test(c))
            return true;
        return c.charCodeAt(0) >= 0xA0;
    }
    /**
     * @param {string} value
     * @return {boolean}
     */
    function isCSSIdentifier(value)
    {
        return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);
    }
    var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
    var needsClassNames = false;
    var needsNthChild = false;
    var ownIndex = -1;
    var elementIndex = -1;
    var siblings = parent.children;
    for (var i = 0; (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
        var sibling = siblings[i];
        if (sibling.nodeType !== Node.ELEMENT_NODE)
            continue;
        elementIndex += 1;
        if (sibling === node) {
            ownIndex = elementIndex;
            continue;
        }
        if (needsNthChild)
            continue;
        if (sibling.tagName.toLowerCase() !== nodeName)
            continue;
        needsClassNames = true;
        var ownClassNames = prefixedOwnClassNamesArray.values();
        var ownClassNameCount = 0;
        for (var name in ownClassNames)
            ++ownClassNameCount;
        if (ownClassNameCount === 0) {
            needsNthChild = true;
            continue;
        }
        var siblingClassNamesArray = prefixedElementClassNames(sibling);
        for (var j = 0; j < siblingClassNamesArray.length; ++j) {
            var siblingClass = siblingClassNamesArray[j];
            if (!ownClassNames.hasOwnProperty(siblingClass))
                continue;
            delete ownClassNames[siblingClass];
            if (!--ownClassNameCount) {
                needsNthChild = true;
                break;
            }
        }
    }
    var result = nodeName;
    if (isTargetNode && nodeName.toLowerCase() === "input" && node.getAttribute("type") && !node.getAttribute("id") && !node.getAttribute("class"))
        result += "[type=\"" + node.getAttribute("type") + "\"]";
    if (needsNthChild) {
        result += ":nth-child(" + (ownIndex + 1) + ")";
    } else if (needsClassNames) {
        for (var prefixedName in prefixedOwnClassNamesArray.values())
            result += "." + escapeIdentifierIfNeeded(prefixedName.substr(1));
    }
    return new ReverseCssSelector.DOMNodePathStep(result, false);
};


