const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let particleArray = []

const adjystX = 4
const adjystY = 50

//handle touch 
const touch ={
  x : null,
  y : null,
  radius : 90
}

window.addEventListener('touchmove',event =>{
  touch.x = event.touches[0].clientX
  touch.y = event.touches[0].clientY
})
const gradient = ctx.createLinearGradient(0,0,canvas.width,canvas.height)
gradient.addColorStop(0, 'yellow')
gradient.addColorStop(0.3, 'red')
gradient.addColorStop(0.6, 'green')
gradient.addColorStop(1, 'green')
//gradient.addColorStop(1, 'green')


ctx.fillStyle = gradient
ctx.font = '22px Vedanna'
ctx.fillText('Merry ',30,30)
ctx.fillText('Christmas ',7,50)
ctx.fillText('🎄',45,70)

const textCordinates = ctx.getImageData(0,0,canvas.width,canvas.height)

class Particle {
  constructor(x,y) {
    this.x = x
    this.y = y
    this.size = 1.3
    this.baseX = x
    this.baseY = y
    this.density = Math.random() * 30
  }
  draw(){
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2)
    ctx.closePath()
    ctx.fill()
  }
  update(){
    let dx = touch.x - this.x
    let dy = touch.y - this.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    let forceDirectionX = dx / distance
    let forceDirectionY = dy / distance
    let maxDistance = touch.radius
    let force = (maxDistance - distance) / maxDistance
    let directionX = forceDirectionX * force * this.density
    let directionY = forceDirectionY * force * this.density
    
    if(distance < touch.radius){
      this.x -= directionX
      this.y -= directionY
    }
    else{
      if(this.x !== this.baseX){
        let dx = this.x - this.baseX
        this.x -= dx/20
      }
      if(this.t !== this.baseY){
        let dy = this.y - this.baseY
        this.y -= dy/20
      }
    }
  }
}

function init(){
  particleArray = []
  /*
  for(let i=0; i<1000; i++){
    let x = (Math.random()* canvas.width)
    let y = (Math.random()* canvas.height)
    particleArray.push(new Particle(x,y))
  }*/
  for(let y=0,y2=textCordinates.height; y<y2; y++){
    for(let x=0,x2=textCordinates.width; x<x2; x++){
      if(textCordinates.data[(y*4*textCordinates.width) +(x*4)+3] > 128){
        let positionX = x + adjystX
        let positionY = y + adjystY
        particleArray.push(new Particle(positionX*3, positionY*3))
      }
    }
  }
}
init()

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  for(let i=0; i<particleArray.length; i++){
    particleArray[i].draw()
    particleArray[i].update()
  }
  connect()
  requestAnimationFrame(animate)
}
animate()

function connect(){
  let opacityValue = 1
  let particleLength = particleArray.length
  for(let a=0; a<particleLength; a++){
    for(let b=a; b<particleLength; b++){
      let dx = particleArray[a].x - particleArray[b].x
      let dy = particleArray[a].y - particleArray[b].y
      let distance = Math.sqrt(dx * dx + dy * dy)
      opacityValue = 1 - (distance / 8)
      
      if(distance < 8){
        ctx.strokeStyle = 'rgba(250, 220, 100,' + opacityValue + ')'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particleArray[a].x,particleArray[a].y)
        ctx.lineTo(particleArray[b].x,particleArray[b].y)
        ctx.stroke()
      }
    }
  }
}