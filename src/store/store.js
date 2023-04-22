import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'

class Store {

  constructor() {
    makeAutoObservable(this)
  }

  cameraURL = null
  cameraDesc = null
  cityName = null
  mode = true
  isMobile = false
  token = null
  selected = null
  map = null
  videoRef = null
  menu = false
  zoomed = null
  isMapDragging = false
  bounds = null
  searchData = null
  serverURL = null
  isPopup = false
  cities = [
    { name: '台北', city: 'Taipei' },
    { name: '新北', city: 'NewTaipei' },
    { name: '基隆', city: 'Keelung' },
    { name: '桃園', city: 'Taoyuan' },
    { name: '苗栗', city: 'MiaoliCounty' },
    { name: '竹北', city: 'HsinchuCounty' },
    { name: '新竹', city: 'Hsinchu' },
    { name: '台中', city: 'Taichung' },
    { name: '南投', city: 'NantouCounty' },
    { name: '彰化', city: 'ChanghuaCounty' },
    { name: '雲林', city: 'YunlinCounty' },
    { name: '嘉義', city: 'Chiayi' },
    { name: '宜蘭', city: 'YilanCounty' },
    { name: '花蓮', city: 'HualienCounty' },
    { name: '台南', city: 'Tainan' },
    { name: '高雄', city: 'Kaohsiung' },
    { name: '台東', city: 'TaitungCounty' },
    { name: '屏東', city: 'PingtungCounty' },
  ]

  setMap = act => this.map = act
  setToken = act => this.token = act
  setMode = act => this.mode = act
  setIsMobile = act => this.isMobile = act
  setMenu = act => this.menu = act
  setSelected = act => this.selected = act
  setVideoRef = act => this.videoRef = act
  setCameraDesc = act => this.cameraDesc = act
  setZoomed = act => this.zoomed = act
  setIsMapDragging = act => this.isMapDragging = act
  setBounds = act => this.bounds = act
  setSearchData = act => this.searchData = act
  setServerURL = act => this.serverURL = act
  setIsPopup = act => this.isPopup = act
  setCameraURL  = act => {
    fetch(`${this.serverURL}/close`)
    if (act === null) {
      this.videoRef && ( this.videoRef.current.src = null )
      this.cameraURL = act
      console.log('connection down')
    } 
    this.cameraURL = act
  }
  setCityName = act => {
    this.videoRef && ( this.videoRef.current.src = null )
    this.cityName = act
    this.cameraURL = null
    this.selected = null
  }

}

const store = new Store()
const context = createContext(store)
export const useStore = () => useContext(context)