export function highlight(colour, win = window) {
  const doc = win.document,
    sel = doc.getSelection();
  let col = colour;
  if (sel.baseNode.parentElement.style.backgroundColor === colour) {
    col = "transparent";
  }
  let range;
  if (sel.rangeCount && sel.getRangeAt) {
    range = sel.getRangeAt(0);
  }
  doc.designMode = "on";
  if (range) {
    sel.removeAllRanges();
    sel.addRange(range);
  }

  if (!doc.execCommand("HiliteColor", false, col)) {
    doc.execCommand("BackColor", false, col);
  }
  doc.designMode = "off";
}

export default {
  highlight
};
