const canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")
let x = canvas.width / 2
let y = canvas.height / 2
let projectileArray = []
let enemyArray = []
let interval = undefined
const score = document.querySelector(".score")
const scoreBoard = document.querySelector(".score-board")
const restartButton = document.querySelector("button")
const screenBoard = document.querySelector(".restart")
let scoreVar = 0

function init() {
    scoreVar = 0
    x = canvas.width / 2
    y = canvas.height / 2
    projectileArray = []
    enemyArray = []
    interval = undefined
}
class Player {
    constructor(x, y, radius, color) {
        this.x = x,
            this.y = y,
            this.radius = radius,
            this.color = color

    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 360)
        ctx.fill()
        ctx.closePath()
    }
}
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x,
            this.y = y,
            this.radius = radius,
            this.color = color,
            this.velocity = velocity

    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 360)
        ctx.fill()
        ctx.closePath()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
class Enemies {
    constructor(x, y, radius, color, velocity) {
        this.x = x,
            this.y = y,
            this.radius = radius,
            this.color = color,
            this.velocity = velocity

    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 360)
        ctx.fill()
        ctx.closePath()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
const player = new Player(x, y, 30, "blue")
document.addEventListener("click", function(event) {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10
    }
    projectileArray.push(new Projectile(x, y, 10, "lime", velocity))
})

function createEnemies() {
    setInterval(function() {
        const radius = Math.random() * (40 - 4) + 4
        let x, y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        let color = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
        enemyArray.push(new Enemies(x, y, radius, color, velocity))
    }, 2000)
}
createEnemies()

function animate() {
    interval = requestAnimationFrame(animate)
    ctx.fillStyle = "rgba(0,0,0,0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectileArray.forEach((element, index) => {
        element.update()
        if (element.x - element.radius < 0 || element.x + element.radius > canvas.width || element.y - element.radius < 0 || element.y + element.radius > canvas.height) {
            projectileArray.splice(index, 1)
        }
    })
    enemyArray.forEach((element, index) => {
        element.update()
        const distBtwEnemy = Math.hypot(player.x - element.x, player.y - element.y)
        if (distBtwEnemy - player.radius - element.radius < 1) {
            cancelAnimationFrame(interval)
            scoreBoard.innerHTML = scoreVar
            screenBoard.classList.remove("hidden")


        }
        projectileArray.forEach((projectile, proIndex) => {
            const dist = Math.hypot(projectile.x - element.x, projectile.y - element.y)
            if (dist - projectile.radius - element.radius < 1) {
                if (element.radius > 20) {
                    element.radius -= 5
                    projectileArray.splice(proIndex, 1)
                } else {
                    projectileArray.splice(proIndex, 1)
                    enemyArray.splice(index, 1)
                    scoreVar += 1
                    score.innerHTML = scoreVar

                }

            }

        })
    })

}
animate()
restartButton.addEventListener("click", function() {
    screenBoard.classList.add("hidden")
    init()
    score.innerHTML = scoreVar
    createEnemies()
    animate()

})
document.addEventListener('keydown', function(event) {
    if (event.key == "Enter") {
        cancelAnimationFrame(interval)
        scoreVar = "You Win"



        screenBoard.classList.remove("hidden")

    }
})