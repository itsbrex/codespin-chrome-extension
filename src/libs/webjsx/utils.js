/**
 * Sets attributes and properties on a DOM element based on the provided props.
 * If the property exists on the element, it sets it as a property.
 * Otherwise, it sets it as an attribute or property based on the value type.
 *
 * @param el - The DOM element to update.
 * @param props - The new properties to apply.
 */
export function setAttributes(el, props) {
    let isRenderingSuspended = false;
    if (el.__webjsx_suspendRendering) {
        isRenderingSuspended = true;
        el.__webjsx_suspendRendering(); // Call the suspension function
    }
    for (const [key, value] of Object.entries(props)) {
        if (key === "children" ||
            key === "key" ||
            key === "dangerouslySetInnerHTML")
            continue;
        if (el instanceof HTMLElement) {
            if (key.startsWith("on") && typeof value === "function") {
                // Handle event listeners
                const eventName = key.substring(2).toLowerCase();
                const existingListener = el.__webjsx_listeners?.[eventName];
                if (existingListener) {
                    el.removeEventListener(eventName, existingListener);
                }
                el.addEventListener(eventName, value);
                el.__webjsx_listeners = {
                    ...(el.__webjsx_listeners || {}),
                    [eventName]: value,
                };
            }
            else if (key in el) {
                // If the property exists on the element, set it as a property
                el[key] = value;
            }
            else if (typeof value === "string") {
                // Apply string attributes via setAttribute
                el.setAttribute(key, value);
            }
            else {
                // Assign non-string values as properties
                el[key] = value;
            }
        }
        // If not an HTML Element, then prefer attributes.
        // eg: SVG, MATH
        else {
            if (typeof value === "string") {
                // Apply string attributes via setAttribute
                el.setAttribute(key, value);
            }
            else {
                // Assign non-string values as properties
                el[key] = value;
            }
        }
    }
    // Handle dangerouslySetInnerHTML separately
    if ("dangerouslySetInnerHTML" in props) {
        const html = props.dangerouslySetInnerHTML.__html || "";
        el.innerHTML = html;
    }
    // Handle removing old attributes not present in new props
    const currentAttrs = Array.from(el.attributes).map((attr) => attr.name);
    for (const attr of currentAttrs) {
        if (!(attr in props) && !attr.startsWith("on")) {
            el.removeAttribute(attr);
        }
    }
    // Resetting old properties if not in new props
    const oldProps = el.__webjsx_props || {};
    for (const key of Object.keys(oldProps)) {
        if (!(key in props)) {
            if (key.startsWith("on")) {
                // Remove event listeners
                const eventName = key.substring(2).toLowerCase();
                const existingListener = el.__webjsx_listeners?.[eventName];
                if (existingListener) {
                    el.removeEventListener(eventName, existingListener);
                    delete el.__webjsx_listeners[eventName];
                }
            }
            else if (key in el) {
                // Remove property by setting it to undefined or a default value
                el[key] = undefined;
            }
            else {
                // Remove attribute if it doesn't exist as a property
                el.removeAttribute(key);
            }
        }
    }
    // Store the current props for future updates
    el.__webjsx_props = props;
    if (isRenderingSuspended) {
        el.__webjsx_resumeRendering();
    }
}
/**
 * Updates attributes and properties on a DOM element based on the new and old props.
 *
 * @param el - The DOM element to update.
 * @param newProps - The new properties to apply.
 * @param oldProps - The old properties to compare against.
 */
export function updateAttributes(el, newProps, oldProps) {
    let isRenderingSuspended = false;
    if (el.__webjsx_suspendRendering) {
        isRenderingSuspended = true;
        el.__webjsx_suspendRendering(); // Call the suspension function
    }
    for (const [key, value] of Object.entries(newProps)) {
        if (key === "children" ||
            key === "key" ||
            key === "dangerouslySetInnerHTML")
            continue;
        if (key.startsWith("on") && typeof value === "function") {
            // Handle event listeners
            const eventName = key.substring(2).toLowerCase();
            const existingListener = el.__webjsx_listeners?.[eventName];
            if (existingListener !== value) {
                if (existingListener) {
                    el.removeEventListener(eventName, existingListener);
                }
                el.addEventListener(eventName, value);
                el.__webjsx_listeners = {
                    ...(el.__webjsx_listeners || {}),
                    [eventName]: value,
                };
            }
        }
        else if (key in el) {
            // If the property exists on the element, set it as a property
            el[key] = value;
        }
        else if (typeof value === "string") {
            // Apply string attributes via setAttribute
            el.setAttribute(key, value);
        }
        else {
            // Assign non-string values as properties
            el[key] = value;
        }
    }
    // Handle dangerouslySetInnerHTML separately
    if ("dangerouslySetInnerHTML" in newProps) {
        const html = newProps.dangerouslySetInnerHTML.__html || "";
        el.innerHTML = html;
    }
    else if ("dangerouslySetInnerHTML" in oldProps) {
        // If previously set and now removed, clear innerHTML
        el.innerHTML = "";
    }
    // Remove old attributes/properties not present in newProps
    for (const key of Object.keys(oldProps)) {
        if (!(key in newProps) &&
            key !== "children" &&
            key !== "key" &&
            key !== "dangerouslySetInnerHTML") {
            if (key.startsWith("on")) {
                // Remove event listeners
                const eventName = key.substring(2).toLowerCase();
                const existingListener = el.__webjsx_listeners?.[eventName];
                if (existingListener) {
                    el.removeEventListener(eventName, existingListener);
                    delete el.__webjsx_listeners[eventName];
                }
            }
            else if (key in el) {
                // Remove property by setting it to undefined or a default value
                el[key] = undefined;
            }
            else {
                // Remove attribute if it doesn't exist as a property
                el.removeAttribute(key);
            }
        }
    }
    // Store the current props for future updates
    el.__webjsx_props = newProps;
    if (isRenderingSuspended) {
        el.__webjsx_resumeRendering();
    }
}
//# sourceMappingURL=utils.js.map