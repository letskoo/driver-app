import './style.css'

document.querySelector('#app').innerHTML = `
<div style="padding:40px;font-family:sans-serif;text-align:center">
  <h2>기사 운행 시스템</h2>
  <button id="startBtn" style="font-size:22px;padding:25px;width:200px">
    운행 시작
  </button>
  <div id="status" style="margin-top:30px;font-size:18px;color:green"></div>
</div>
`

const SERVER = "https://bus-server-production.up.railway.app"
const ROUTE_ID = 1

let watchId = null
let running = false

document.getElementById("startBtn").onclick = () => {

  if(running){
    stopDriving()
    return
  }

  startDriving()
}

function startDriving(){

  if(!navigator.geolocation){
    alert("GPS 지원 안됨")
    return
  }

  running = true
  document.getElementById("startBtn").innerText = "운행중 (종료하려면 클릭)"
  document.getElementById("status").innerText = "위치 전송중..."

  watchId = navigator.geolocation.watchPosition(async (pos)=>{

    const lat = pos.coords.latitude
    const lng = pos.coords.longitude

    await fetch(SERVER+"/driver/location",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({
        routeId: ROUTE_ID,
        lat,
        lng
      })
    })

  },{
    enableHighAccuracy:true,
    maximumAge:0,
    timeout:10000
  })
}

function stopDriving(){

  running = false

  if(watchId){
    navigator.geolocation.clearWatch(watchId)
  }

  document.getElementById("startBtn").innerText = "운행 시작"
  document.getElementById("status").innerText = "운행 종료됨"
}