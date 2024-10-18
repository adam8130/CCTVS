import { useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from '@mui/material'


const useDrag = (id) => {

  const isClicked = useRef(false);
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const diff = useRef({ x: 0, y: 0 })

  useEffect(() => {

    const target = document.getElementById(id)
    const container = target.parentElement;

    if (!target) throw new Error("Element with given id doesn't exist")
    if (!container) throw new Error("target element must have a parent")

    const onMouseDown = (e) => {
      const { left, top } = e.target.getBoundingClientRect()
     
      const width = target.clientWidth
      const height = target.clientHeight

      const event = isMobile ? e.changedTouches[0] : e
      
      if (
        // 實現點擊位置在元素寬高的0%內, 才觸發
        event.clientX > (left + width * 0.2) && event.clientX < (left + width * 0.8) &&
        event.clientY > (top + height * 0.2) && event.clientY < (top + height * 0.8)
      ) {
        e.preventDefault()
        e.stopPropagation()
        isClicked.current = true;
        diff.current = {
          x: event.clientX - target.offsetLeft,
          y: event.clientY - target.offsetTop
        }
      }
    }

    const onMouseUp = (e) => {
      e.stopPropagation()
      isClicked.current = false;
    }

    const onMouseMove = (e) => {
      e.preventDefault()
      const event = isMobile ? e.changedTouches[0] : e
      if (isClicked.current) {
        target.style.top = `${event.clientY - diff.current.y}px`
        target.style.left = `${event.clientX - diff.current.x}px`
      }
    }
    
    target.addEventListener(isMobile? 'touchstart' : 'mousedown', onMouseDown)
    target.addEventListener(isMobile? 'touchend' : 'mouseup', onMouseUp)
    target.addEventListener(isMobile? 'touchmove' : 'mousemove', onMouseMove)

    return() => {
      target.removeEventListener(isMobile ? 'touchstart' : 'mousedown', onMouseDown)
      target.removeEventListener(isMobile ? 'touchend' : 'mouseup', onMouseUp)
      target.removeEventListener(isMobile ? 'touchmove' : 'mousemove', onMouseMove)
    }
    
  }, [id, isMobile])

}

export default useDrag;