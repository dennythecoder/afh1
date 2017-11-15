class HighlightManager {
  constructor(store) {
    this.$store = store;
  }

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
    location.endLocation = this.getLocation();
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
    if (rng.startContainer === rng.endContainer) {
      end.offset = start.offset + rng.toString().length;
    } else {
      end.offset = rng.endOffset;
    }

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
    if (!startEl || !endEl) return;
    window.doc = this.document;
    let startNode = startEl.childNodes[start.index];
    let endNode = endEl.childNodes[end.index];
    let range = document.createRange();
    let startOffset = pickOffset(startNode, start);
    let endOffset = pickOffset(endNode, end);
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    return range;
  }
  findEl(location) {
    return findElInDocument(location, this.document);
  }
  markHighlights() {
    let highlights = this.$store.getters.highlights;
    let destroyedHighlights = this.$store.getters.destroyedHighlights;
    this.markSelectedHighlights(highlights, "yellow");
    this.markSelectedHighlights(destroyedHighlights, "transparent");
  }
  markSelectedHighlights(highlights, color) {
    highlights.forEach(highlight => {
      if (
        highlight.location.chapterName ===
        this.$store.getters.lastLocation.chapterName
      ) {
        let range =
          highlight.range && highlight.range.anchorNode
            ? highlight.range
            : this.createRange(highlight.start, highlight.end);
        if (range) {
          this.highlightRange(color, range);
          highlight.range = this.selection.getRangeAt(0);

          this.selection.removeAllRanges();
        }
      }
    });
  }
}

function pickOffset(node, location) {
  return node.length < location.offset ? node.length - 1 : location.offset;
}

function findElInDocument(location, doc) {
  let elements = doc.querySelectorAll(location.tagName);
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].outerHTML === location.outerHTML) {
      return elements[i];
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
  let iframe = document.querySelector("iframe");
  _defaultWindow = iframe ? iframe.contentWindow : window;
  return _defaultWindow;
}

let _highlightManager;
export function CreateHighlightManager(store) {
  if (_highlightManager) return _highlightManager;
  _highlightManager = new HighlightManager(store);
  window.hh = _highlightManager;
  return _highlightManager;
}
