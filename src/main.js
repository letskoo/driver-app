import './style.css'

document.querySelector('#app').innerHTML = `
<div style="padding:40px;font-family:sans-serif">
  <h2>기사 GPS 전송</h2>
  <button id="startBtn" style="font-size:22px;padding:25px">
    운행 시작 (GPS ON)
  </button>
  <div id="status" style="margin-top:30px;font-size:18px;color:green"></div>
</div>
`

const SERVER = "https://bus-server-production.up.railway.app"
const ROUTE_ID = 1

let watchId = null

document.getElementById("startBtn").onclick = () => {

  if(!navigator.geolocation){
    alert("GPS 지원 안되는 기기")
    return
  }

  document.getElementById("status").innerText="GPS 연결중..."

  watchId = navigator.geolocation.watchPosition(async (pos)=>{

    const lat = pos.coords.latitude
    const lng = pos.coords.longitude

    document.getElementById("status").innerText =
      "전송중: "+lat.toFixed(5)+","+lng.toFixed(5)

    await fetch(SERVER+"/driver/location",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({
        routeId: ROUTE_ID,
        lat: lat,
        lng: lng
      })
    })

  }, err=>{
    alert("GPS 권한 허용 필요")
  },{
    enableHighAccuracy:true,
    maximumAge:0,
    timeout:10000
  })
}