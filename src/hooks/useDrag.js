import { useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from '@mui/material'


const useDrag = (id) => {

  const isClicked = useRef(false);
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {

    const target = document.getElementById(id)
    const container = target.parentElement;

    if (!target) throw new Error("Element with given id doesn't exist")
    if (!container) throw new Error("target element must have a parent")

    const onMouseDown = (e) => {
      // 實現點擊位置在元素寬高的80%內, 才觸發
      const width = target.clientWidth
      const height = target.clientHeight
      const { left, top } = e.target.getBoundingClientRect()
      const event = isMobile ? e.changedTouches[0] : e

      if (
        event.clientX > (left + width * 0.2) && event.clientX < (left + width * 0.8) &&
        event.clientY > (top + height * 0.2) && event.clientY < (top + height * 0.8)
      ) {
        isClicked.current = true;
        e.preventDefault()
        e.stopPropagation()
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
        target.style.top = `${event.clientY - target.offsetHeight / 2}px`
        target.style.left = `${event.clientX - target.offsetWidth / 2}px`
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