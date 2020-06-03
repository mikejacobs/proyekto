// Add event listener for style changes
// https://stackoverflow.com/questions/2157963/is-it-possible-to-listen-to-a-style-change-event/20683311#20683311

let boxes = [];
let desk;
let currentTarget;
let body;
exportScrapes = () => {
  let json = [];
  boxes.forEach(box => {
    let jso = box.getScrapStyles();
    json.push(jso);
  });
  return JSON.stringify(json);
};
class Scrap {
  constructor(style, content) {
    this.element = document.createElement("div");
    this.element.innerHTML =
      "<!-- all styles on .box and all its html contents will be saved -->";
    console.log("style, content", style, content);

    this.elementContent = document.createElement("div"); // for shaping content
    this.elementContent.className = "content";
    if (content) {
      this.elementContent.innerHTML += decodeURI(content);
    } else {
      let elementEdit = document.createElement("div");
      elementEdit.className = "edit";
      elementEdit.setAttribute("contenteditable", "true");
      elementEdit.innerHTML = "Inspect me!";
      this.elementContent.appendChild(elementEdit);
    }
    this.element.appendChild(this.elementContent);
    this.element.className = "box";
    if (style) {
      this.element.style = style;
    }

    this.setupFileDrop();

    ["nw-handle", "ne-handle", "sw-handle", "se-handle"].forEach(handle => {
      let handleEl = document.createElement("div");
      console.log("handleEl", handleEl, handle);
      handleEl.addEventListener("mousedown", window.mouseDown, false);
      handleEl.classList.add("handle");
      handleEl.classList.add(handle);
      this.element.appendChild(handleEl);
    });

    boxes.push(this);
    desk.appendChild(this.element);
    return this;
  }

  resizeBasedOnContents() {}

  setupFileDrop() {
    var droppedFiles = false;
    let el = this.element;

    let dragStart = e => {
      el.classList.add("is-dragover");
    };
    let dragEnd = e => {
      el.classList.remove("is-dragover");
    };
    let drop = e => {
      //   droppedFiles = e.originalEvent.dataTransfer.files;
      //   resize based on image
      //   resizeBasedOnContents
      console.log("dropped file");
      //   do we even need to upload the file if images are added to
      //   contenteditable divs as data uris? might only work in firefox
    };

    this.element.addEventListener("dragover", dragStart, false);
    this.element.addEventListener("dragenter", dragStart, false);

    this.element.addEventListener("dragleave", dragEnd, false);
    this.element.addEventListener("dragend", dragEnd, false);
    this.element.addEventListener("drop", dragEnd, false);
    this.element.addEventListener("drop", drop, false);
  }

  getScrapStyles() {
    const style = this.element.style.cssText;
    const html = encodeURI(this.elementContent.outerHTML);
    return { style, html };
  }
}

start = {};
window.mouseUp = target => {
  document.body.classList.remove("isDragging");
  document.body.classList.remove("move");
  document.body.classList.remove("resize");
  window.removeEventListener("mousemove", divMove, true);
  window.removeEventListener("mousemove", divResize, true);
};
window.mouseDown = e => {
  currentTarget = e.currentTarget.parentNode;

  start.x = e.clientX;
  start.y = e.clientY;
  start.width = parseInt(
    document.defaultView.getComputedStyle(currentTarget).width,
    10
  );
  start.height = parseInt(
    document.defaultView.getComputedStyle(currentTarget).height,
    10
  );
  //   if space is held down move, else resize
  document.body.classList.add("isDragging");
  if (e.metaKey) {
    window.addEventListener("mousemove", divMove, true);
    document.body.classList.add("move");
  } else {
    window.addEventListener("mousemove", divResize, true);
    document.body.classList.add("resize");
  }

  window.addEventListener("mouseup", mouseUp, false);
};

window.divMove = e => {
  e.preventDefault();
  e.stopPropagation();
  currentTarget.style.top = e.pageY + "px";
  currentTarget.style.left = e.pageX + "px";
};
window.divResize = e => {
  e.preventDefault();
  e.stopPropagation();
  currentTarget.style.width = start.width + e.clientX - start.x + "px";
  currentTarget.style.height = start.height + e.clientY - start.y + "px";
};

defaultScrap = {
  title: "Title",
  content: "Content",
  dimensions: {
    w: 100,
    h: 100
  },
  position: {
    x: 100,
    y: 100
  },
  background: "#fff"
};

newScrap = () => {
  new Scrap();
  //   moveListener();
};

window.onload = event => {
  console.log("running script");
  desk = document.getElementById("desk");
  window.addEventListener(
    "keydown",
    e => {
      e.which == 224 ? document.body.classList.add("meta") : null;
    },
    false
  );
  window.addEventListener(
    "keyup",
    e => {
      console.log("up", e);
      e.which == 224 ? document.body.classList.remove("meta") : null;
    },
    false
  );

  document.getElementById("scrap").addEventListener(
    "click",
    () => {
      newScrap();
    },
    false
  );

  document.getElementById("save").addEventListener(
    "click",
    () => {
      document.write(exportScrapes());
    },
    false
  );
  document.getElementById("import").addEventListener(
    "click",
    () => {
      // prompt
      // create new boxes from json
      let saved = JSON.parse(prompt("Paste desk", "<>"));
      console.log("saved", saved);
      console.log("saved parse", saved[0]);
      saved.forEach(box => {
        console.log("box", box, box.style, decodeURI(box.html));
        new Scrap(box.style, box.html);
      });
    },
    false
  );
  //   document.getElementById("wormhole");
};
