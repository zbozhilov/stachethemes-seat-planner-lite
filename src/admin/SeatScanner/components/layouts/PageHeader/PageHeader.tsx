import React, { useEffect, useRef } from 'react'
import './PageHeader.scss'

const PageHeader = (props: {
    title: string
}) => {

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const handleScroll = () => {
            if (containerRef.current) {
                if (window.scrollY > 0) {
                    containerRef.current.classList.add('is-scrolled');
                } else {
                    containerRef.current.classList.remove('is-scrolled');
                }
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }

    }, []);

    return (
        <div ref={containerRef} className='stachesepl-page-header'>
            <h1 className='stachesepl-page-header-title'>{props.title}</h1>
        </div>
    )
}

export default PageHeader