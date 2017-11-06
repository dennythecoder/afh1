class HighlightManager {
  get window() {
    return defaultWindow();
  }
  get document() {
    return this.window.document;
  }
  get selection() {
    return this.window.getSelection();
  }

  highlightRange(colour, range) {
    let sel = this.selection,
      doc = this.document;
    sel.removeAllRanges();
    sel.addRange(range);
    let location = this.getLocation();
    doc.designMode = "on";
    doc.execCommand("HiliteColor", false, colour);
    doc.designMode = "off";
    return location;
  }
  highlight(colour) {
    let sel = this.selection;
    let col = colour;
    if (!sel.baseNode) return;
    if (sel.baseNode.parentElement.style.backgroundColor === colour) {
      col = "transparent";
    }
    let range = sel.getRangeAt(0);
    return this.highlightRange(col, range);
  }
  getLocation() {
    let win = this.window,
      sel = win.getSelection(),
      rng = sel.getRangeAt(0);
    let start = getNodeLocation(rng.startContainer);
    let end = getNodeLocation(rng.endContainer);
    start.offset = rng.startOffset;
    end.offset = rng.startOffset;
    let textContent = rng.toString();
    return {
      start,
      end,
      textContent
    };
  }
  createRange(start, end) {
    let startEl = this.findEl(start);
    let endEl = this.findEl(end);
    let startNode = startEl.childNodes[start.index];
    let endNode = endEl.childNodes[end.index];
    let range = document.createRange();
    range.setStart(startNode, start.offset);
    range.setEnd(endNode, end.offset);
    return range;
  }
  findEl(location) {
    let elements = this.document.querySelectorAll(location.tagName);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].outerHTML === location.outerHTML) {
        return elements[i];
      }
    }
  }
}

function getNodeIndexInElement(element, node) {
  for (let i = 0; i < element.childNodes.length; i++) {
    if (element.childNodes[i] === node) {
      return i;
    }
  }
}

function getNodeLocation(node) {
  let parentElement = node.parentElement;
  let tagName = parentElement.tagName,
    className = parentElement.className,
    index = getNodeIndexInElement(parentElement, node),
    outerHTML = parentElement.outerHTML;
  return { tagName, className, index, outerHTML };
}

let _defaultWindow;
function defaultWindow() {
  if (_defaultWindow) return _defaultWindow;
  let iframe = document.querySelector("iframe");
  _defaultWindow = iframe ? iframe.contentWindow : window;
  return _defaultWindow;
}

let _highlightManager;
export function CreateHighlightManager() {
  if (_highlightManager) return _highlightManager;
  _highlightManager = new HighlightManager();
  window.hh = _highlightManager;
  return _highlightManager;
}
