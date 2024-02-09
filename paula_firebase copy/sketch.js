import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

window.setup = setup;
window.draw = draw;

let drawing = [];
let savedDrawings = []; // Array to hold all the saved drawings
let drawingTimestamp;
let currentPath = [];
let isDrawing = false;

const firebaseDatbaseConnection = initializeApp({
  apiKey: "AIzaSyACTZs6IaFhE6VeldeyYfhzjqC9C_69Sv4",
  authDomain: "test01-d0fdd.firebaseapp.com",
  databaseURL: "https://test01-d0fdd-bbb6e.europe-west1.firebasedatabase.app/",
  projectId: "test01-d0fdd",
  storageBucket: "test01-d0fdd.appspot.com",
  messagingSenderId: "968693583529",
  appId: "1:968693583529:web:1bd15312655ae0daa223b8",
  measurementId: "G-HN8Z87RXQB",
});

const firebaseDatabase = getDatabase(firebaseDatbaseConnection);

function setup() {
  canvas = createCanvas(windowWidth, 2000);

  canvas.mousePressed(startPath);
  canvas.parent("canvascontainer");
  canvas.mouseReleased(endPath);

  select("#saveButton").mousePressed(saveDrawing);
  select("#clearButton").mousePressed(clearDrawing);
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
  background(255);

  if (isDrawing) {
    var point = {
      x: mouseX,
      y: mouseY,
    };
    currentPath.push(point);
  }

  stroke(0);
  strokeWeight(4);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
      vertex(path[j].x, path[j].y);
    }
    endShape();
  }

  if (savedDrawings != null) {
    stroke(225, 0, 255);

    for (let k = 0; k < savedDrawings.length; k++) {
      var currentDrawing = savedDrawings[k];
      beginShape();
      for (let d = 0; d < currentDrawing.length; d++) {
        let x = currentDrawing[d].x;
        let y = currentDrawing[d].y;
        vertex(x, y);
      }
      endShape();
    }
  }
}

function saveDrawing() {
  drawingTimestamp = Date.now();
  let data = ref(firebaseDatabase, "drawings/" + drawingTimestamp);

  set(data, {
    name: "Paulik2",
    drawing: drawing,
  });

  getAndDrawData();
}

function getAndDrawData() {
  let data = ref(firebaseDatabase, "drawings/");

  onValue(data, (snapshot) => {
    const db = snapshot.val();
    console.log(db);
    var keys = Object.keys(db);
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      drawPreviousDrawings(key);
    }
  });
}

function drawPreviousDrawings(key) {
  let data = ref(firebaseDatabase, "drawings/" + key);

  onValue(data, (snapshot) => {
    const drawing = snapshot.val();
    console.log(drawing);

    let l = drawing.drawing.length;
    console.log(l);

    for (let i = 0; i < l; i++) {
      var currentDrawing = [];
      var arr = drawing.drawing[i];
      for (let j = 0; j < arr.length; j++) {
        let dx = drawing.drawing[i][j].x;
        let dy = drawing.drawing[i][j].y;
        var point = { x: dx, y: dy };
        currentDrawing.push(point);
      }
      savedDrawings.push(currentDrawing);
    }

    console.log(savedDrawings.length);
  });
}

function clearDrawing() {
  drawing = [];

  let data = ref(firebaseDatabase, "drawings/" + drawingTimestamp);
  remove(data);

  savedDrawings = [];
}
