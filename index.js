const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "black";
const leftOffset = 300;
const topOffset = 50;
const rectSize = 150;
const radius = 75;
let figuresData = [];

const drawCircle = (x, y) => {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
  ctx.fill();
  ctx.stroke();
};
const drawRect = (x, y) => {
  ctx.beginPath();
  ctx.fillStyle = "green";
  ctx.rect(x, y, rectSize, rectSize);
  ctx.fill();
  ctx.stroke();
};

const reloadData = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  figuresData.forEach(el => {
    if (el.selected === true) {
      ctx.lineWidth = 5;
    } else ctx.lineWidth = 1;
    if (el.type === 'rect') {
      drawRect(el.x, el.y)
    } else if (el.type === 'circle') {
      drawCircle(el.x, el.y)
    }
  })
};

const getData = () => {
  let data = localStorage.getItem('data');
  if (data) {
    figuresData = JSON.parse(data)
    reloadData()
  }
};
getData()


const dragAndDrop = (e, targetEl) => {
  if (e.target.classList.contains('figures-item') || targetEl) {
    let x1 = event.clientX;
    let y1 = event.clientY;
    let dx = rectSize / 2;
    let dy = rectSize / 2;
    let figureType = '';

    if (targetEl) {
      figureType = targetEl.type;
      figuresData.splice(figuresData.indexOf(targetEl), 1);
      if (figureType === 'circle') {
        dx = x1 - targetEl.x - leftOffset + 75;
        dy = y1 - targetEl.y - topOffset + 75;
      } else if (figureType === 'rect') {
        dx = x1 - targetEl.x - leftOffset;
        dy = y1 - targetEl.y - topOffset;
      }
      reloadData()
    } else figureType = e.target.classList[0];
    let dragElement = document.createElement('div');
    dragElement.classList.add(figureType);
    dragElement.classList.add('drag-item');
    dragElement.style.left = x1 - dx + 'px';
    dragElement.style.top = y1 - dy + 'px';
    document.body.appendChild(dragElement);

    const dragAt = (event) => {
      let x2 = event.clientX;
      let y2 = event.clientY;
      dragElement.style.left = x2 - dx + 'px';
      dragElement.style.top = y2 - dy + 'px';
    };

    document.addEventListener('mousemove', dragAt);

    const mouseUp = (event) => {
      dragElement.remove()
      document.removeEventListener('mousemove', dragAt);
      let canvasX = event.clientX - leftOffset;
      let canvasY = event.clientY - topOffset;
      if (canvasX > 0 && canvasX < canvas.width && canvasY > 0 && canvasY < canvas.height) {
        figuresData.forEach(el => {
          el.selected = false
        });
        dragElement.selected = true;
        if (figureType === 'rect') {
          figuresData.push({type: 'rect', x: canvasX - dx, y: canvasY - dy, selected: true});
          drawRect(canvasX - dx, canvasY - dy);
          reloadData();
          figureType = null
        } else if (figureType === 'circle') {
          figuresData.push({type: 'circle', x: canvasX - dx + 75, y: canvasY - dy + 75, selected: true});
          drawCircle(canvasX - dx + 75, canvasY - dy + 75);
          reloadData();
          figureType = null;
        }
      }
      localStorage.setItem('data', JSON.stringify(figuresData));
      document.removeEventListener('mouseup', mouseUp);
    }
    document.addEventListener('mouseup', mouseUp);
  }
};
document.addEventListener('mousedown', dragAndDrop);

const selectItem = (event) => {
  let x = event.offsetX;
  let y = event.offsetY;
  let targetEl = figuresData.find(el => {
    if (el.type === 'rect' && el.x + rectSize >= x && el.x <= x && el.y + rectSize >= y && el.y <= y) {
      return el
    }
    if (el.type === 'circle' && (el.x - x) ** 2 + (el.y - y) ** 2 <= radius ** 2) {
      return el
    }
  });
  if (targetEl) {
    dragAndDrop(event, targetEl)
  } else {
    figuresData.forEach(el => el.selected = false)
  }
};

canvas.addEventListener('mousedown', selectItem);

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 46) {
    let findEl = figuresData.find(el => el.selected === true);
    figuresData.splice(figuresData.indexOf(findEl), 1);
    reloadData()
  }
});






