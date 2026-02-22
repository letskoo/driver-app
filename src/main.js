import './style.css'

document.querySelector('#app').innerHTML = `
<div style="padding:40px;font-family:sans-serif">
  <h2>기사 GPS 전송</h2>
  <button id="startBtn" style="font-size:20px;padding:20px">
    운행 시작 (GPS ON)
  </button>
  <div id="status" style="margin-top:20px;color:green"></div>
</div>
`

const SERVER = "https://bus-server-production.up.railway.app"
const ROUTE_ID = 1

let watchId = null

document.getElementById("startBtn").onclick = () => {

  if(!navigator.geolocation){
    alert("GPS 안됨")
    return
  }

  document.getElementById("status").innerText="GPS 전송중..."

  watchId = navigator.geolocation.watchPosition(async (pos)=>{

    const lat = pos.coords.latitude
    const lng = pos.coords.longitude

    console.log("전송:",lat,lng)

    await fetch(SERVER+"/driver/location",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({
        routeId: ROUTE_ID,
        lat,
        lng
      })
    })

  }, err=>{
    alert("GPS 오류")
  },{
    enableHighAccuracy:true,
    maximumAge:0,
    timeout:5000
  })
}