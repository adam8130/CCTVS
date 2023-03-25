import { useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from '@mui/material'




const useResize = (id) => {

    const isClicked = useRef(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    useEffect(() => {

        if (!id) return

        const target = document.getElementById('Resize')
        if (!target) throw new Error("Element with given id doesn't exist")

        const parent = target.parentElement
        if (!parent) throw new Error("target element must have a parent")


        const onMouseDown = (e) => {
            isClicked.current = true;
            e.preventDefault()
        }

        const onMouseUp = (e) => {
            isClicked.current = false;
            e.preventDefault()
        }

        const onMouseMove = (e) => {
            const event = isMobile ? e.changedTouches[0] : e
            if (isClicked.current) {
                const { x, y } = parent.getBoundingClientRect()
                target.style.top = `${event.clientY - y - (target.offsetHeight / 2)}px`
                target.style.left = `${event.clientX - x - (target.offsetWidth / 2)}px`
                parent.style.height = `${event.clientY - y - (target.offsetHeight - (isMobile ? 20 : 5))}px`
                parent.style.width = `${event.clientX - x + (target.offsetWidth / 2)}px`
                console.log(parent.style.height)
            }
        }

        target.addEventListener(isMobile ? 'touchstart' : 'mousedown', onMouseDown)
        target.addEventListener(isMobile ? 'touchend' : 'mouseup', onMouseUp)
        target.addEventListener(isMobile ? 'touchmove' : 'mousemove', onMouseMove)
        !isMobile && window.addEventListener('mousemove', onMouseMove)
        
        return () => {
            target.removeEventListener(isMobile ? 'touchstart' : 'mousedown', onMouseDown)
            target.removeEventListener(isMobile ? 'touchend' : 'mouseup', onMouseUp)
            target.removeEventListener(isMobile ? 'touchmove' : 'mousemove', onMouseMove)
            window.removeEventListener('mousemove', onMouseMove)
        }

    }, [id, isMobile])

}


export default useResize